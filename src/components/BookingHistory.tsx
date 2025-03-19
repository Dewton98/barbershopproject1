import React from 'react';
import { History, Calendar, Clock, Scissors } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define the booking type
export interface Booking {
  id: string;
  service: string;
  date: string;
  time: string;
  status: 'completed' | 'upcoming' | 'cancelled';
  price: string;
  customerPhone: string;
}

interface BookingHistoryProps {
  bookings: Booking[];
}

const BookingHistory = ({ bookings }: BookingHistoryProps) => {
  // Debug check - Ensure bookings are being passed correctly
  console.log('BookingHistory received bookings:', bookings);
  
  return (
    <div 
      className="relative rounded-xl p-6 md:p-8 mb-8 overflow-hidden"
      style={{
        backgroundImage: 'url("/lovable-uploads/eb0b2532-3cdb-4b47-ac25-608cf2696126.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transform: 'rotate(90deg)',
        transformOrigin: 'center center'
      }}
    >
      {/* Dark overlay to improve text readability */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      
      <div className="relative z-10" style={{ transform: 'rotate(-90deg)' }}>
        <h2 className="text-2xl font-semibold text-white mb-4">Your Booking History</h2>
        
        {(!bookings || bookings.length === 0) ? (
          <div className="text-center py-12">
            <History className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Bookings Yet</h3>
            <p className="text-gray-300">Your booking history will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div 
                key={booking.id} 
                className={cn(
                  "bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10",
                  {
                    "border-l-4 border-l-callGreen": booking.status === 'upcoming',
                    "border-l-4 border-l-gray-400": booking.status === 'completed',
                    "border-l-4 border-l-red-500": booking.status === 'cancelled',
                  }
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-white">{booking.service}</h3>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    {
                      "bg-callGreen/20 text-callGreen": booking.status === 'upcoming',
                      "bg-gray-500/20 text-gray-300": booking.status === 'completed',
                      "bg-red-500/20 text-red-400": booking.status === 'cancelled',
                    }
                  )}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                
                <div className="flex flex-col space-y-2 text-gray-300">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{booking.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{booking.time}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/10">
                    <span className="text-gray-400">Price:</span>
                    <span className="text-callGreen font-medium">{booking.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
