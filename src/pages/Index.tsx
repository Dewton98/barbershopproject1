import React, { useState, useEffect } from 'react';
import { Calendar, Clock, History } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import BookingHistory, { Booking } from "@/components/BookingHistory";

const Index = () => {
  const [activeTab, setActiveTab] = useState<'booking' | 'history'>('booking');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [barberPhone, setBarberPhone] = useState<string>('+254700000000');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { toast } = useToast();

  const availableTimes = [
    '09:00', '10:00', '11:00', '12:00', 
    '14:00', '15:00', '16:00', '17:00'
  ];

  // Load bookings from localStorage on component mount
  useEffect(() => {
    const savedBookings = localStorage.getItem('barberBookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
  }, []);

  // Extract price from service selection
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

    // Create a new booking
    const newBooking: Booking = {
      id: Date.now().toString(),
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      status: 'upcoming',
      price: getServicePrice(selectedService)
    };

    // Add to bookings array
    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    
    // Save to localStorage
    localStorage.setItem('barberBookings', JSON.stringify(updatedBookings));

    toast({
      title: "Booking Confirmed",
      description: `Your ${selectedService} appointment is scheduled for ${selectedDate} at ${selectedTime}. You will receive an SMS confirmation shortly.`,
    });

    // Reset form
    setSelectedDate('');
    setSelectedTime('');
    setSelectedService('');
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: 'url("/lovable-uploads/e23deada-876e-458a-8252-6f77beedbeb1.png")',
        backgroundColor: '#222222',
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="relative z-10 max-w-4xl mx-auto pt-16 px-4 pb-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Premium Barber Shop
          </h1>
          <p className="text-xl text-gray-200">
            Experience the art of perfect grooming
          </p>
        </div>

        {activeTab === 'booking' ? (
          <>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-6">
                Book Your Appointment
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Service Selection */}
                <div>
                  <label className="block text-gray-200 mb-2">Select Service</label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <option value="">Choose a service</option>
                    <optgroup label="Haircut Services" className="bg-gray-800">
                      <option value="Haircut" className="bg-gray-800">Haircut (KES 3,900)</option>
                      <option value="Beard Trim" className="bg-gray-800">Beard Trim (KES 2,600)</option>
                      <option value="Hot Shave" className="bg-gray-800">Hot Shave (KES 3,250)</option>
                      <option value="Hair & Beard Combo" className="bg-gray-800">Hair & Beard Combo (KES 5,850)</option>
                    </optgroup>
                    <optgroup label="Massage Services" className="bg-gray-800">
                      <option value="Head Massage" className="bg-gray-800">Head Massage (KES 3,250)</option>
                      <option value="Face Massage" className="bg-gray-800">Face Massage (KES 2,600)</option>
                      <option value="Shoulder & Back" className="bg-gray-800">Shoulder & Back (KES 4,550)</option>
                      <option value="Premium Package" className="bg-gray-800">Premium Package (KES 7,800)</option>
                    </optgroup>
                  </select>
                </div>

                {/* Phone Number Input */}
                <div>
                  <label className="block text-gray-200 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+254700000000"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block text-gray-200 mb-2">Select Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>

                {/* Time Selection */}
                <div>
                  <label className="block text-gray-200 mb-2">Select Time</label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <option value="">Choose a time</option>
                    {availableTimes.map((time) => (
                      <option key={time} value={time} className="bg-gray-800">
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBooking}
                className="mt-8 w-full bg-callGreen hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Book Appointment
              </button>
            </div>

            {/* Haircut Services */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-6">
                Haircut Services
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-gray-200">
                  <h3 className="text-xl font-semibold mb-2">Haircut</h3>
                  <p className="mb-1">Professional cut and style</p>
                  <p className="text-callGreen">KES 3,900</p>
                </div>
                <div className="text-gray-200">
                  <h3 className="text-xl font-semibold mb-2">Beard Trim</h3>
                  <p className="mb-1">Shape and style your beard</p>
                  <p className="text-callGreen">KES 2,600</p>
                </div>
                <div className="text-gray-200">
                  <h3 className="text-xl font-semibold mb-2">Hot Shave</h3>
                  <p className="mb-1">Traditional hot towel shave</p>
                  <p className="text-callGreen">KES 3,250</p>
                </div>
                <div className="text-gray-200">
                  <h3 className="text-xl font-semibold mb-2">Hair & Beard Combo</h3>
                  <p className="mb-1">Complete grooming package</p>
                  <p className="text-callGreen">KES 5,850</p>
                </div>
              </div>
            </div>

            {/* Massage Services */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-6">
                Massage Services
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-gray-200">
                  <h3 className="text-xl font-semibold mb-2">Head Massage</h3>
                  <p className="mb-1">Relaxing scalp and neck massage</p>
                  <p className="mb-2 text-sm text-gray-300">Duration: 20 minutes</p>
                  <p className="text-callGreen">KES 3,250</p>
                </div>
                <div className="text-gray-200">
                  <h3 className="text-xl font-semibold mb-2">Face Massage</h3>
                  <p className="mb-1">Rejuvenating facial massage</p>
                  <p className="mb-2 text-sm text-gray-300">Duration: 15 minutes</p>
                  <p className="text-callGreen">KES 2,600</p>
                </div>
                <div className="text-gray-200">
                  <h3 className="text-xl font-semibold mb-2">Shoulder & Back</h3>
                  <p className="mb-1">Stress-relieving upper body massage</p>
                  <p className="mb-2 text-sm text-gray-300">Duration: 30 minutes</p>
                  <p className="text-callGreen">KES 4,550</p>
                </div>
                <div className="text-gray-200">
                  <h3 className="text-xl font-semibold mb-2">Premium Package</h3>
                  <p className="mb-1">Complete relaxation treatment</p>
                  <p className="mb-2 text-sm text-gray-300">Duration: 45 minutes</p>
                  <p className="text-callGreen">KES 7,800</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 md:p-8 mb-8">
            <BookingHistory bookings={bookings} />
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-md mx-auto flex justify-around">
          <button
            onClick={() => setActiveTab('booking')}
            className={`flex flex-col items-center py-4 px-6 transition-colors duration-200 ${
              activeTab === 'booking'
                ? 'text-callGreen'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-sm mt-1">Book</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center py-4 px-6 transition-colors duration-200 ${
              activeTab === 'history'
                ? 'text-callGreen'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <History className="w-6 h-6" />
            <span className="text-sm mt-1">History</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
