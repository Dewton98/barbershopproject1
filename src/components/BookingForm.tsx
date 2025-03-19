import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import BookingConfirmation from './BookingConfirmation';
import { Booking } from '@/components/BookingHistory';

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
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [currentBooking, setCurrentBooking] = useState<Omit<Booking, 'id' | 'status'> | null>(null);
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

    let formattedPhone = customerPhone;
    
    if (customerPhone.startsWith('0') && customerPhone.length === 10) {
      formattedPhone = '+254' + customerPhone.substring(1);
    }
    
    const phoneRegex = /^(\+254\d{9}|0\d{9})$/;
    if (!phoneRegex.test(customerPhone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Kenyan phone number (07XXXXXXXX or +254XXXXXXXX)",
        variant: "destructive"
      });
      return;
    }

    const newBooking = {
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      price: getServicePrice(selectedService),
      customerPhone: formattedPhone
    };

    setCurrentBooking(newBooking);
    
    setShowConfirmation(true);
    
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
      <div 
        className="relative rounded-xl p-6 md:p-8 mb-8 overflow-hidden"
        style={{
          backgroundImage: 'url("/lovable-uploads/a50064bb-68d4-455b-a857-9ee029a9a4e2.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-playfair font-semibold text-white mb-6">Book an Appointment</h2>
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
                placeholder="07XXXXXXXX or +254XXXXXXXX"
                className="w-full bg-white/20 text-white border border-white/20 rounded-md p-2"
                required
              />
              <p className="text-gray-300 text-xs mt-1">Format: 07XXXXXXXX or +254XXXXXXXX</p>
            </div>
          </div>

          <button 
            onClick={handleBooking}
            className="mt-6 bg-callGreen hover:bg-callGreen/80 text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            Book Appointment
          </button>
        </div>
      </div>

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
