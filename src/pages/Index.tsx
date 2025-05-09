
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import BookingHistory, { Booking } from "@/components/BookingHistory";
import BookingForm from "@/components/BookingForm";
import HaircutServiceSection from "@/components/HaircutServiceSection";
import MassageServiceSection from "@/components/MassageServiceSection";
import GallerySection from "@/components/GallerySection";
import NavigationTabs from "@/components/NavigationTabs";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useSupabase } from "@/integrations/supabase/provider";

const Index = () => {
  const [activeTab, setActiveTab] = useState<'booking' | 'history'>('booking');
  const [activeSection, setActiveSection] = useState<'booking' | 'haircut' | 'massage' | 'gallery'>('booking');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [barberPhone] = useState<string>('+254700000000');
  const { toast } = useToast();
  const { user } = useSupabase();

  const availableTimes = [
    '09:00', '10:00', '11:00', '12:00', 
    '14:00', '15:00', '16:00', '17:00'
  ];

  const galleryImages = [
    {
      src: "/lovable-uploads/1d67ea84-a863-483f-9e89-b6c7fd2ce380.png",
      alt: "Service image 1",
      caption: "Quality Service"
    },
    {
      src: "/lovable-uploads/d31dd35d-6e7c-4c2b-8fe9-4b9e2b26d4c4.png",
      alt: "Service image 2",
      caption: "Professional Care"
    },
    {
      src: "/lovable-uploads/a1f1666e-6805-4b83-9476-db4cd9a9079d.png",
      alt: "Service image 3",
      caption: "Custom Solutions"
    },
    {
      src: "/lovable-uploads/767ead22-789b-4626-8449-5ae430612cc3.png",
      alt: "Service image 4",
      caption: "Premium Experience"
    }
  ];

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    setIsLoading(true);
    
    try {
      let retries = 3;
      let success = false;
      let data = null;
      let error = null;
      
      while (retries > 0 && !success) {
        try {
          const response = await supabase
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (response.error) {
            error = response.error;
            console.warn(`Retry attempt ${4-retries}: Failed to fetch bookings`, error);
            retries--;
            if (retries > 0) {
              await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
            }
          } else {
            data = response.data;
            success = true;
          }
        } catch (e) {
          console.error('Network error in fetchBookings:', e);
          error = e;
          retries--;
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
          }
        }
      }
      
      if (!success) {
        console.error('Error fetching bookings after retries:', error);
        toast({
          title: "Connection Issue",
          description: "Could not connect to our servers. Your data will load when the connection is restored.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      if (data) {
        const formattedBookings: Booking[] = data.map(booking => ({
          id: booking.id,
          service: booking.service,
          date: booking.date,
          time: booking.time,
          status: booking.status,
          price: booking.price,
          customerPhone: booking.customer_phone,
          reminder: booking.reminder
        }));
        
        setBookings(formattedBookings);
      }
    } catch (error) {
      console.error('Error in fetchBookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingSubmit = useCallback(async (newBookingData: Omit<Booking, 'id' | 'status'>) => {
    try {
      const bookingData = {
        service: newBookingData.service,
        date: newBookingData.date,
        time: newBookingData.time,
        price: newBookingData.price,
        customer_phone: newBookingData.customerPhone,
        reminder: newBookingData.reminder,
        status: 'upcoming',
        user_id: user?.id
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (error) {
        console.error('Error creating booking:', error);
        toast({
          title: "Booking Failed",
          description: "There was an error creating your booking.",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        const newBooking: Booking = {
          id: data.id,
          service: data.service,
          date: data.date,
          time: data.time,
          status: data.status,
          price: data.price,
          customerPhone: data.customer_phone,
          reminder: data.reminder
        };

        setBookings(prevBookings => [newBooking, ...prevBookings]);
        
        if (newBooking.reminder) {
          toast({
            title: "Reminder Set",
            description: `You'll receive a reminder 1 hour before your appointment on ${newBooking.date} at ${newBooking.time}`,
          });
        }
      }
    } catch (error) {
      console.error('Error in handleBookingSubmit:', error);
    }
  }, [toast, user, supabase]);

  const addSampleBookings = async () => {
    const sampleBookings = [
      {
        service: 'Haircut',
        date: '2023-06-10',
        time: '10:00',
        status: 'completed',
        price: 'KES 3,900',
        customer_phone: '+254700000000',
        reminder: true,
        user_id: user?.id
      },
      {
        service: 'Beard Trim',
        date: '2023-06-15',
        time: '14:00',
        status: 'cancelled',
        price: 'KES 2,600',
        customer_phone: '+254700000000',
        reminder: false,
        user_id: user?.id
      },
      {
        service: 'Hot Shave',
        date: '2023-07-20',
        time: '11:00',
        status: 'upcoming',
        price: 'KES 3,250',
        customer_phone: '+254700000000',
        reminder: true,
        user_id: user?.id
      }
    ];
    
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert(sampleBookings)
        .select();
        
      if (error) {
        console.error('Error adding sample bookings:', error);
        toast({
          title: "Error",
          description: "Could not add sample bookings",
          variant: "destructive",
        });
        return;
      }
      
      fetchBookings();
      
      toast({
        title: "Sample Bookings Added",
        description: "Sample bookings have been added successfully",
      });
    } catch (error) {
      console.error('Error in addSampleBookings:', error);
    }
  };

  const handleTabChange = (tab: 'booking' | 'history') => {
    console.log('Changing tab to:', tab);
    setActiveTab(tab);
  };

  const handleSectionChange = (section: 'booking' | 'haircut' | 'massage' | 'gallery') => {
    console.log('Changing section to:', section);
    setActiveSection(section);
    // If the user is in history tab, switch to booking tab when selecting a section
    if (activeTab !== 'booking') {
      setActiveTab('booking');
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: 'url("/lovable-uploads/307d6cc2-7249-4075-95a2-c1ce6c09f4ea.png")',
        backgroundColor: '#9ED0BD',
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      
      <Header onSectionChange={handleSectionChange} activeSection={activeSection} />
      
      <div className="relative z-10 max-w-4xl mx-auto pt-16 px-4 pb-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4 leading-tight">
            Project 1
          </h1>
          <p className="text-xl text-gray-200">
            Experience excellence in service
          </p>
        </div>

        {activeTab === 'booking' ? (
          <>
            {/* Only render the active section */}
            {activeSection === 'booking' && (
              <section id="booking" className="scroll-mt-20">
                <BookingForm
                  availableTimes={availableTimes}
                  onBookingSubmit={handleBookingSubmit}
                />
              </section>
            )}
            
            {activeSection === 'haircut' && (
              <section id="haircut" className="scroll-mt-20">
                <HaircutServiceSection />
              </section>
            )}
            
            {activeSection === 'massage' && (
              <section id="massage" className="scroll-mt-20">
                <MassageServiceSection />
              </section>
            )}
            
            {activeSection === 'gallery' && (
              <section id="gallery" className="scroll-mt-20">
                <GallerySection galleryImages={galleryImages} />
              </section>
            )}
          </>
        ) : (
          <div className="bg-white/10 backdrop-blur-md dark:bg-gray-800/10 rounded-xl p-6 md:p-8 mb-8">
            {isLoading ? (
              <div className="py-8 text-center">
                <div className="w-8 h-8 border-4 border-callGreen border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white">Loading your bookings...</p>
              </div>
            ) : (
              <>
                <BookingHistory bookings={bookings} />
                <button 
                  onClick={addSampleBookings}
                  className="mt-4 bg-gray-700 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 text-white px-4 py-2 rounded text-sm"
                >
                  Add Sample Bookings
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <NavigationTabs activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default Index;
