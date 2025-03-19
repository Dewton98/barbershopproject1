import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import BookingHistory, { Booking } from "@/components/BookingHistory";
import BookingForm from "@/components/BookingForm";
import HaircutServiceSection from "@/components/HaircutServiceSection";
import MassageServiceSection from "@/components/MassageServiceSection";
import GallerySection from "@/components/GallerySection";
import NavigationTabs from "@/components/NavigationTabs";

const Index = () => {
  const [activeTab, setActiveTab] = useState<'booking' | 'history'>('booking');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [barberPhone] = useState<string>('+254700000000');
  const { toast } = useToast();

  const availableTimes = [
    '09:00', '10:00', '11:00', '12:00', 
    '14:00', '15:00', '16:00', '17:00'
  ];

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

  const handleBookingSubmit = (newBookingData: Omit<Booking, 'id' | 'status'>) => {
    const newBooking: Booking = {
      id: Date.now().toString(),
      ...newBookingData,
      status: 'upcoming'
    };

    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    
    localStorage.setItem('barberBookings', JSON.stringify(updatedBookings));
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
  };

  const handleTabChange = (tab: 'booking' | 'history') => {
    console.log('Changing tab to:', tab);
    setActiveTab(tab);
  };

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
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4 leading-tight">
            Premium Barber Shop
          </h1>
          <p className="text-xl text-gray-200">
            Experience the art of perfect grooming
          </p>
        </div>

        {activeTab === 'booking' ? (
          <>
            {/* Add Booking Form (Hidden until needed) */}
            <BookingForm
              availableTimes={availableTimes}
              onBookingSubmit={handleBookingSubmit}
            />
            
            <HaircutServiceSection />
            <MassageServiceSection />
            <GallerySection galleryImages={galleryImages} />
          </>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 md:p-8 mb-8">
            <BookingHistory bookings={bookings} />
            <button 
              onClick={addSampleBookings}
              className="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
            >
              Add Sample Bookings
            </button>
          </div>
        )}
      </div>

      <NavigationTabs activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default Index;
