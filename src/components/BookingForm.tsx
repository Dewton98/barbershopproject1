import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Scissors } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useSupabaseErrorHandler, useNetworkErrorHandler } from "@/hooks/use-error-handler";
import { useBookingValidation } from "@/hooks/use-booking-validation";
import { useFormValidation, bookingFormRules } from "@/hooks/use-form-validation";
import type { Booking as BookingType } from "@/components/BookingHistory";
import BookingConfirmation from './BookingConfirmation';
import SectionWindow from './SectionWindow';
import { 
  sendSMS, 
  formatAppointmentReminderMessage, 
  validateKenyanPhoneNumber 
} from '../services/africasTalkingService';
import { useSupabase } from "@/integrations/supabase/provider";
import { config } from '@/lib/config';

interface BookingFormProps {
  availableTimes: string[];
  onBookingSubmit: (booking: Omit<BookingType, 'id' | 'status'>) => void;
}

export interface Booking {
  id: string;
  service: string;
  date: string;
  time: string;
  status: 'completed' | 'upcoming' | 'cancelled';
  price: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ availableTimes, onBookingSubmit }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [reminder, setReminder] = useState<boolean>(true);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [currentBooking, setCurrentBooking] = useState<Omit<BookingType, 'id' | 'status'> | null>(null);
  const [isSendingSMS, setIsSendingSMS] = useState<boolean>(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>(availableTimes);
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);
  const { toast } = useToast();
  const { user } = useSupabase();
  const handleSupabaseError = useSupabaseErrorHandler();
  const handleNetworkError = useNetworkErrorHandler();
  const { validateCompleteBooking, getAvailableTimeSlots } = useBookingValidation();
  const { validateForm, validateSingleField, getFieldError, hasFieldError, clearAllErrors } = useFormValidation(bookingFormRules);

  const getServicePrice = (service: string): string => {
    const serviceConfig = config.services[service as keyof typeof config.services];
    return serviceConfig ? `KES ${serviceConfig.price.toLocaleString()}` : '';
  };

  // Update available time slots when date or service changes
  useEffect(() => {
    const updateAvailableSlots = async () => {
      if (selectedDate && selectedService) {
        setIsLoadingSlots(true);
        try {
          const slots = await getAvailableTimeSlots(selectedDate, selectedService);
          setAvailableTimeSlots(slots);
          
          // If the currently selected time is no longer available, clear it
          if (selectedTime && !slots.includes(selectedTime)) {
            setSelectedTime('');
            toast({
              title: "Time Slot Unavailable",
              description: "Your selected time is no longer available. Please choose another time.",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error('Error fetching available slots:', error);
          setAvailableTimeSlots(availableTimes); // Fallback to all slots
        } finally {
          setIsLoadingSlots(false);
        }
      } else {
        setAvailableTimeSlots(availableTimes);
      }
    };

    updateAvailableSlots();
  }, [selectedDate, selectedService, getAvailableTimeSlots, availableTimes, selectedTime, toast]);

  const handleBooking = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book an appointment",
        variant: "destructive"
      });
      return;
    }

    // Validate the form
    const formData = {
      selectedService,
      selectedDate,
      selectedTime,
      customerPhone
    };

    const validationResult = validateForm(formData);
    
    if (!validationResult.isValid) {
      const firstError = Object.values(validationResult.errors)[0];
      toast({
        title: "Validation Error",
        description: firstError,
        variant: "destructive"
      });
      return;
    }

    const formattedPhone = validationResult.formattedValues.customerPhone;

    // Validate booking for double booking prevention
    const bookingValidation = await validateCompleteBooking({
      date: selectedDate,
      time: selectedTime,
      service: selectedService
    });

    if (!bookingValidation.isValid) {
      toast({
        title: "Booking Conflict",
        description: bookingValidation.message,
        variant: "destructive"
      });
      return;
    }
    
    const newBooking = {
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      price: getServicePrice(selectedService),
      customerPhone: formattedPhone,
      reminder: reminder
    };

    setCurrentBooking(newBooking);
    setShowConfirmation(true);
    clearAllErrors(); // Clear form validation errors on successful submission
    
    if (reminder) {
      setIsSendingSMS(true);
      try {
        const message = formatAppointmentReminderMessage(
          selectedService,
          selectedDate,
          selectedTime
        );
        
        const response = await sendSMS(formattedPhone, message);
        
        if (response.success) {
          toast({
            title: "SMS Notification Set",
            description: "You will receive an SMS reminder before your appointment",
          });
        } else {
          toast({
            title: "SMS Notification Failed",
            description: "We couldn't set up your SMS reminder. Please contact us.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error setting up SMS notification:", error);
        toast({
          title: "SMS Notification Error",
          description: "There was an error setting up your SMS reminder.",
          variant: "destructive"
        });
      } finally {
        setIsSendingSMS(false);
      }
    }
    
    onBookingSubmit(newBooking);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    
    setSelectedDate('');
    setSelectedTime('');
    setSelectedService('');
    setCustomerPhone('');
  };

  return (
    <>
      <SectionWindow
        id="booking"
        title="Book an Appointment"
        backgroundImage="/lovable-uploads/a50064bb-68d4-455b-a857-9ee029a9a4e2.png"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-white mb-2">Service</label>
            <select 
              value={selectedService}
              onChange={(e) => {
                setSelectedService(e.target.value);
                validateSingleField('selectedService', e.target.value);
              }}
              className={`w-full bg-white/20 text-white border rounded-md p-2 ${
                hasFieldError('selectedService') 
                  ? 'border-red-400 focus:border-red-400' 
                  : 'border-white/20 focus:border-purple-400'
              }`}
              required
            >
              <option value="">Select a service</option>
              {Object.entries(config.services).map(([serviceName, serviceConfig]) => (
                <option key={serviceName} value={serviceName}>
                  {serviceName} - KES {serviceConfig.price.toLocaleString()} ({serviceConfig.duration}min)
                </option>
              ))}
            </select>
            {getFieldError('selectedService') && (
              <p className="text-red-300 text-sm mt-1">{getFieldError('selectedService')}</p>
            )}
          </div>

          <div>
            <label className="block text-white mb-2">Date</label>
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                validateSingleField('selectedDate', e.target.value);
              }}
              className={`w-full bg-white/20 text-white border rounded-md p-2 ${
                hasFieldError('selectedDate') 
                  ? 'border-red-400 focus:border-red-400' 
                  : 'border-white/20 focus:border-purple-400'
              }`}
              min={new Date().toISOString().split('T')[0]}
              max={(() => {
                const maxDate = new Date();
                maxDate.setDate(maxDate.getDate() + 30);
                return maxDate.toISOString().split('T')[0];
              })()}
              required
            />
            {getFieldError('selectedDate') && (
              <p className="text-red-300 text-sm mt-1">{getFieldError('selectedDate')}</p>
            )}
          </div>

          <div>
            <label className="block text-white mb-2">
              Time {isLoadingSlots && <span className="text-purple-300">(Loading available slots...)</span>}
            </label>
            <select 
              value={selectedTime}
              onChange={(e) => {
                setSelectedTime(e.target.value);
                validateSingleField('selectedTime', e.target.value);
              }}
              className={`w-full bg-white/20 text-white border rounded-md p-2 ${
                hasFieldError('selectedTime') 
                  ? 'border-red-400 focus:border-red-400' 
                  : 'border-white/20 focus:border-purple-400'
              }`}
              disabled={isLoadingSlots || !selectedDate || !selectedService}
              required
            >
              <option value="">
                {isLoadingSlots 
                  ? "Loading..." 
                  : !selectedDate || !selectedService 
                    ? "Select service and date first"
                    : availableTimeSlots.length === 0
                      ? "No available slots"
                      : "Select a time"
                }
              </option>
              {availableTimeSlots.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
            {getFieldError('selectedTime') && (
              <p className="text-red-300 text-sm mt-1">{getFieldError('selectedTime')}</p>
            )}
            {selectedDate && selectedService && !isLoadingSlots && availableTimeSlots.length === 0 && (
              <p className="text-red-300 text-sm mt-1">
                No available time slots for this date. Please choose a different date.
              </p>
            )}
          </div>

          <div>
            <label className="block text-white mb-2">Your Phone Number</label>
            <input 
              type="tel"
              value={customerPhone}
              onChange={(e) => {
                setCustomerPhone(e.target.value);
                validateSingleField('customerPhone', e.target.value);
              }}
              placeholder="07XXXXXXXX or +254XXXXXXXX"
              className={`w-full bg-white/20 text-white border rounded-md p-2 ${
                hasFieldError('customerPhone') 
                  ? 'border-red-400 focus:border-red-400' 
                  : 'border-white/20 focus:border-purple-400'
              }`}
              required
            />
            {getFieldError('customerPhone') ? (
              <p className="text-red-300 text-sm mt-1">{getFieldError('customerPhone')}</p>
            ) : (
              <p className="text-gray-300 text-xs mt-1">Format: 07XXXXXXXX or +254XXXXXXXX</p>
            )}
          </div>

          <div className="flex items-center col-span-2">
            <input
              type="checkbox"
              id="reminder"
              checked={reminder}
              onChange={(e) => setReminder(e.target.checked)}
              className="h-4 w-4 text-callGreen border-white/20 rounded focus:ring-callGreen bg-white/20"
            />
            <label htmlFor="reminder" className="ml-2 block text-white">
              Send me an SMS reminder via Africa's Talking
            </label>
          </div>
        </div>

        <button 
          onClick={handleBooking}
          disabled={isSendingSMS}
          className={`mt-6 ${isSendingSMS ? 'bg-gray-500' : 'bg-callGreen hover:bg-callGreen/80'} text-white font-medium py-2 px-6 rounded-md transition-colors`}
        >
          {isSendingSMS ? 'Setting up SMS...' : 'Book Appointment'}
        </button>
      </SectionWindow>

      {showConfirmation && currentBooking && (
        <BookingConfirmation 
          booking={currentBooking} 
          onClose={handleConfirmationClose} 
        />
      )}
    </>
  );
};

export default BookingForm;
