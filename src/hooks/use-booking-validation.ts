import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { config } from '@/lib/config';

interface BookingSlot {
  date: string;
  time: string;
  service: string;
}

interface ValidationResult {
  isValid: boolean;
  message?: string;
  conflictingBooking?: {
    id: string;
    service: string;
    time: string;
  };
}

export const useBookingValidation = () => {
  
  const getServiceDuration = useCallback((service: string): number => {
    const serviceConfig = config.services[service as keyof typeof config.services];
    return serviceConfig?.duration || 60; // Default to 60 minutes
  }, []);

  const getTimeInMinutes = useCallback((timeString: string): number => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }, []);

  const addMinutesToTime = useCallback((timeString: string, minutes: number): string => {
    const totalMinutes = getTimeInMinutes(timeString) + minutes;
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }, [getTimeInMinutes]);

  const isTimeSlotConflicting = useCallback((
    slot1: { time: string; service: string },
    slot2: { time: string; service: string }
  ): boolean => {
    const duration1 = getServiceDuration(slot1.service);
    const duration2 = getServiceDuration(slot2.service);
    const bufferTime = config.businessHours.bufferTime;

    const start1 = getTimeInMinutes(slot1.time);
    const end1 = start1 + duration1;
    
    const start2 = getTimeInMinutes(slot2.time);
    const end2 = start2 + duration2;

    // Check if there's overlap with buffer time
    return (
      (start1 < end2 + bufferTime && end1 + bufferTime > start2) ||
      (start2 < end1 + bufferTime && end2 + bufferTime > start1)
    );
  }, [getServiceDuration, getTimeInMinutes]);

  const validateBusinessHours = useCallback((time: string): ValidationResult => {
    const timeInMinutes = getTimeInMinutes(time);
    const openTime = getTimeInMinutes(config.businessHours.open);
    const closeTime = getTimeInMinutes(config.businessHours.close);

    if (timeInMinutes < openTime || timeInMinutes >= closeTime) {
      return {
        isValid: false,
        message: `Bookings are only available between ${config.businessHours.open} and ${config.businessHours.close}`
      };
    }

    return { isValid: true };
  }, [getTimeInMinutes]);

  const validateBookingDate = useCallback((dateString: string): ValidationResult => {
    const bookingDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      return {
        isValid: false,
        message: "Cannot book appointments in the past"
      };
    }

    // Check if it's a closed day
    const dayOfWeek = bookingDate.getDay();
    if (config.businessHours.closedDays.includes(dayOfWeek)) {
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return {
        isValid: false,
        message: `We are closed on ${dayNames[dayOfWeek]}s`
      };
    }

    // Don't allow bookings more than 30 days in advance
    const maxAdvanceDate = new Date();
    maxAdvanceDate.setDate(maxAdvanceDate.getDate() + 30);
    
    if (bookingDate > maxAdvanceDate) {
      return {
        isValid: false,
        message: "Bookings can only be made up to 30 days in advance"
      };
    }

    return { isValid: true };
  }, []);

  const checkDoubleBooking = useCallback(async (
    slot: BookingSlot,
    excludeBookingId?: string
  ): Promise<ValidationResult> => {
    try {
      // Build query to check for existing bookings on the same date
      let query = supabase
        .from('bookings')
        .select('id, service, time, date')
        .eq('date', slot.date)
        .in('status', ['upcoming', 'confirmed']); // Only check active bookings

      if (excludeBookingId) {
        query = query.neq('id', excludeBookingId);
      }

      const { data: existingBookings, error } = await query;

      if (error) {
        console.error('Error checking for double bookings:', error);
        return {
          isValid: false,
          message: "Unable to verify booking availability. Please try again."
        };
      }

      // Check for time conflicts
      for (const existingBooking of existingBookings || []) {
        if (isTimeSlotConflicting(
          { time: slot.time, service: slot.service },
          { time: existingBooking.time, service: existingBooking.service }
        )) {
          return {
            isValid: false,
            message: `This time slot conflicts with an existing ${existingBooking.service} appointment. Please choose a different time.`,
            conflictingBooking: {
              id: existingBooking.id,
              service: existingBooking.service,
              time: existingBooking.time
            }
          };
        }
      }

      return { isValid: true };
    } catch (error) {
      console.error('Unexpected error in double booking check:', error);
      return {
        isValid: false,
        message: "Unable to verify booking availability. Please try again."
      };
    }
  }, [isTimeSlotConflicting]);

  const getAvailableTimeSlots = useCallback(async (
    date: string,
    service: string,
    excludeBookingId?: string
  ): Promise<string[]> => {
    try {
      const { data: existingBookings, error } = await supabase
        .from('bookings')
        .select('service, time')
        .eq('date', date)
        .in('status', ['upcoming', 'confirmed']);

      if (error) {
        console.error('Error fetching existing bookings:', error);
        return config.businessHours.timeSlots; // Return all slots if we can't check
      }

      const availableSlots = config.businessHours.timeSlots.filter(timeSlot => {
        // Check if this time slot conflicts with any existing booking
        return !existingBookings?.some(booking => 
          isTimeSlotConflicting(
            { time: timeSlot, service },
            { time: booking.time, service: booking.service }
          )
        );
      });

      return availableSlots;
    } catch (error) {
      console.error('Unexpected error fetching available slots:', error);
      return config.businessHours.timeSlots;
    }
  }, [isTimeSlotConflicting]);

  const validateCompleteBooking = useCallback(async (
    slot: BookingSlot,
    excludeBookingId?: string
  ): Promise<ValidationResult> => {
    // Validate date
    const dateValidation = validateBookingDate(slot.date);
    if (!dateValidation.isValid) {
      return dateValidation;
    }

    // Validate business hours
    const timeValidation = validateBusinessHours(slot.time);
    if (!timeValidation.isValid) {
      return timeValidation;
    }

    // Check for double booking
    const doubleBookingValidation = await checkDoubleBooking(slot, excludeBookingId);
    if (!doubleBookingValidation.isValid) {
      return doubleBookingValidation;
    }

    return { isValid: true };
  }, [validateBookingDate, validateBusinessHours, checkDoubleBooking]);

  return {
    validateCompleteBooking,
    checkDoubleBooking,
    validateBookingDate,
    validateBusinessHours,
    getAvailableTimeSlots,
    getServiceDuration,
    isTimeSlotConflicting
  };
};