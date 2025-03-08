
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

interface BookingFormProps {
  availableTimes: string[];
  onBookingSubmit: (newBooking: Omit<Booking, 'id' | 'status'>) => void;
}

export interface BookingFormData {
  service: string;
  date: string;
  time: string;
  price: string;
  customerPhone: string;
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
  const { toast } = useToast();

  const getServicePrice = (service: string): string => {
    const priceMap: Record<string, string> = {
      'Haircut': 'KES 3,900',
      'Beard Trim': 'KES 2,600',
      'Hot Shave': 'KES 3,250',
      'Hair & Beard Combo': 'KES 5,850',
      'Head Massage': 'KES 3,250',
      'Face Massage': 'KES 2,600',
      'Shoulder & Back': 'KES 4,550',
      'Premium Package': 'KES 7,800'
    };
    return priceMap[service] || '';
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !selectedService || !customerPhone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields including your phone number",
        variant: "destructive"
      });
      return;
    }

    const phoneRegex = /^\+254\d{9}$/;
    if (!phoneRegex.test(customerPhone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Kenyan phone number starting with +254",
        variant: "destructive"
      });
      return;
    }

    const newBooking = {
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      price: getServicePrice(selectedService)
    };

    onBookingSubmit(newBooking);

    // Reset form
    setSelectedDate('');
    setSelectedTime('');
    setSelectedService('');
    // Don't reset phone number for convenience
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 md:p-8 mb-8">
      <h2 className="text-2xl font-semibold text-white mb-6">Book an Appointment</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-white mb-2">Service</label>
          <select 
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full bg-white/20 text-white border border-white/20 rounded-md p-2"
            required
          >
            <option value="">Select a service</option>
            <option value="Haircut">Haircut - KES 3,900</option>
            <option value="Beard Trim">Beard Trim - KES 2,600</option>
            <option value="Hot Shave">Hot Shave - KES 3,250</option>
            <option value="Hair & Beard Combo">Hair & Beard Combo - KES 5,850</option>
            <option value="Head Massage">Head Massage - KES 3,250</option>
            <option value="Face Massage">Face Massage - KES 2,600</option>
            <option value="Shoulder & Back">Shoulder & Back - KES 4,550</option>
            <option value="Premium Package">Premium Package - KES 7,800</option>
          </select>
        </div>

        <div>
          <label className="block text-white mb-2">Date</label>
          <input 
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-white/20 text-white border border-white/20 rounded-md p-2"
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div>
          <label className="block text-white mb-2">Time</label>
          <select 
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full bg-white/20 text-white border border-white/20 rounded-md p-2"
            required
          >
            <option value="">Select a time</option>
            {availableTimes.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white mb-2">Your Phone Number</label>
          <input 
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="+254XXXXXXXXX"
            className="w-full bg-white/20 text-white border border-white/20 rounded-md p-2"
            required
          />
          <p className="text-gray-300 text-xs mt-1">Format: +254XXXXXXXXX</p>
        </div>
      </div>

      <button 
        onClick={handleBooking}
        className="mt-6 bg-callGreen hover:bg-callGreen/80 text-white font-medium py-2 px-6 rounded-md transition-colors"
      >
        Book Appointment
      </button>
    </div>
  );
};

export default BookingForm;
