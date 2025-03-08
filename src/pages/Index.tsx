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

  useEffect(() => {
    console.log('Loading bookings from localStorage');
    const savedBookings = localStorage.getItem('barberBookings');
    if (savedBookings) {
      try {
        const parsedBookings = JSON.parse(savedBookings);
        console.log('Parsed bookings:', parsedBookings);
        setBookings(parsedBookings);
      } catch (error) {
        console.error('Error parsing bookings from localStorage:', error);
        setBookings([]);
      }
    } else {
      console.log('No bookings found in localStorage');
    }
  }, []);

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

    const newBooking: Booking = {
      id: Date.now().toString(),
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      status: 'upcoming',
      price: getServicePrice(selectedService)
    };

    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    
    localStorage.setItem('barberBookings', JSON.stringify(updatedBookings));

    toast({
      title: "Booking Confirmed",
      description: `Your ${selectedService} appointment is scheduled for ${selectedDate} at ${selectedTime}. You will receive an SMS confirmation shortly.`,
    });

    setSelectedDate('');
    setSelectedTime('');
    setSelectedService('');
  };

  const addSampleBookings = () => {
    const sampleBookings: Booking[] = [
      {
        id: '1',
        service: 'Haircut',
        date: '2023-06-10',
        time: '10:00',
        status: 'completed',
        price: 'KES 3,900'
      },
      {
        id: '2',
        service: 'Beard Trim',
        date: '2023-06-15',
        time: '14:00',
        status: 'cancelled',
        price: 'KES 2,600'
      },
      {
        id: '3',
        service: 'Hot Shave',
        date: '2023-07-20',
        time: '11:00',
        status: 'upcoming',
        price: 'KES 3,250'
      }
    ];
    
    const updatedBookings = [...sampleBookings, ...bookings];
    setBookings(updatedBookings);
    localStorage.setItem('barberBookings', JSON.stringify(updatedBookings));
    
    toast({
      title: "Sample Bookings Added",
      description: "Sample bookings have been added to your history for testing."
    });
  };

  const handleTabChange = (tab: 'booking' | 'history') => {
    console.log('Changing tab to:', tab);
    setActiveTab(tab);
  };

  const galleryImages = [
    {
      src: "/lovable-uploads/1d67ea84-a863-483f-9e89-b6c7fd2ce380.png",
      alt: "Textured hairstyle with designs",
      caption: "Premium Textured Designs"
    },
    {
      src: "/lovable-uploads/d31dd35d-6e7c-4c2b-8fe9-4b9e2b26d4c4.png",
      alt: "Clean fade haircut",
      caption: "Professional Clean Fade"
    },
    {
      src: "/lovable-uploads/a1f1666e-6805-4b83-9476-db4cd9a9079d.png",
      alt: "Designer haircut with patterns",
      caption: "Custom Design Patterns"
    },
    {
      src: "/lovable-uploads/767ead22-789b-4626-8449-5ae430612cc3.png",
      alt: "Creative wave designs",
      caption: "Precision Wave Styling"
    }
  ];

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: 'url("/lovable-uploads/307d6cc2-7249-4075-95a2-c1ce6c09f4ea.png")',
        backgroundColor: '#9ED0BD', // Soft mint green background that matches the image
      }}
    >
      <div className="absolute inset-0 bg-black/40" /> {/* Lighter overlay for the pastel background */}
      
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
            <div 
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 md:p-8 mb-8 relative overflow-hidden"
              style={{
                backgroundImage: 'url("/lovable-uploads/20ede269-17f1-4946-9e73-4ea8585d27a4.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-navy/70 backdrop-blur-sm"></div>
              
              <div className="relative z-10">
                <h2 className="text-2xl font-semibold text-white mb-6">
                  Haircut Services
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-white">
                    <h3 className="text-xl font-semibold mb-2">Haircut</h3>
                    <p className="mb-1">Professional cut and style</p>
                    <p className="text-callGreen font-semibold">KES 3,900</p>
                  </div>
                  <div className="text-white">
                    <h3 className="text-xl font-semibold mb-2">Beard Trim</h3>
                    <p className="mb-1">Shape and style your beard</p>
                    <p className="text-callGreen font-semibold">KES 2,600</p>
                  </div>
                  <div className="text-white">
                    <h3 className="text-xl font-semibold mb-2">Hot Shave</h3>
                    <p className="mb-1">Traditional hot towel shave</p>
                    <p className="text-callGreen font-semibold">KES 3,250</p>
                  </div>
                  <div className="text-white">
                    <h3 className="text-xl font-semibold mb-2">Hair & Beard Combo</h3>
                    <p className="mb-1">Complete grooming package</p>
                    <p className="text-callGreen font-semibold">KES 5,850</p>
                  </div>
                </div>
              </div>
            </div>

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

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">
                Our Gallery
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {galleryImages.map((image, index) => (
                  <div 
                    key={index} 
                    className="relative overflow-hidden rounded-lg group"
                  >
                    <img 
                      src={image.src} 
                      alt={image.alt}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <p className="text-white p-4 font-medium">{image.caption}</p>
                    </div>
                  </div>
                ))}
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
            onClick={() => handleTabChange('booking')}
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
            onClick={() => handleTabChange('history')}
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
