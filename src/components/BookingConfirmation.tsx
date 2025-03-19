
import React from 'react';
import { Check, Calendar, Clock, Phone } from 'lucide-react';
import { Booking } from '@/components/BookingHistory';

interface BookingConfirmationProps {
  booking: Omit<Booking, 'id' | 'status'>;
  onClose: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ booking, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div 
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 max-w-md w-full text-center relative"
        style={{
          backgroundImage: 'url("/lovable-uploads/dc5a0720-ed8b-4ba9-af5e-add5ab3a26ff.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-xl"></div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-callGreen rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-white mb-4">
            Booking Confirmed!
          </h2>
          
          <p className="text-gray-200 mb-6">
            Thank you for booking with Premium Barber Shop. We look forward to serving you.
          </p>
          
          <div className="bg-white/10 rounded-lg p-4 mb-6 text-left">
            <div className="flex items-center mb-3">
              <Calendar className="w-5 h-5 text-callGreen mr-3" />
              <span className="text-white">{booking.date}</span>
            </div>
            <div className="flex items-center mb-3">
              <Clock className="w-5 h-5 text-callGreen mr-3" />
              <span className="text-white">{booking.time}</span>
            </div>
            <div className="flex items-center mb-3">
              <span className="w-5 h-5 flex items-center justify-center text-callGreen mr-3">💇</span>
              <span className="text-white">{booking.service}</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-callGreen mr-3" />
              <span className="text-white">{booking.customerPhone}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-300 mb-6">
            An SMS confirmation has been sent to your phone. Please arrive 10 minutes before your appointment.
          </p>
          
          <button 
            onClick={onClose}
            className="bg-callGreen hover:bg-callGreen/80 text-white font-medium py-3 px-8 rounded-md transition-colors w-full"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
