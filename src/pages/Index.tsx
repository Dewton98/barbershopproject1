import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import BookingHistory, { Booking } from "@/components/BookingHistory";
import BookingForm from "@/components/BookingForm";
import HaircutServiceSection from "@/components/HaircutServiceSection";
import MassageServiceSection from "@/components/MassageServiceSection";
import GallerySection from "@/components/GallerySection";
import NavigationTabs from "@/components/NavigationTabs";
import Header from "@/components/Header";
import AdminBookings from "@/components/AdminBookings";
import { supabase } from "@/integrations/supabase/client";
import { useSupabase } from "@/integrations/supabase/provider";
import { config } from '@/lib/config';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'booking' | 'history' | 'admin'>('booking');
  const [activeSection, setActiveSection] = useState<'booking' | 'haircut' | 'massage' | 'gallery'>('booking');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [barberPhone] = useState<string>(config.app.barberPhone);
  const { toast } = useToast();
  const { user } = useSupabase();

  const availableTimes = config.businessHours.timeSlots;

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
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    try {
      const isUserAdmin = user.email?.includes('admin') || false;
      setIsAdmin(isUserAdmin);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

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

  const handleTabChange = (tab: 'booking' | 'history' | 'admin') => {
    console.log('Changing tab to:', tab);
    if (tab === 'admin' && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin area",
        variant: "destructive",
      });
      return;
    }
    setActiveTab(tab);
  };

  const handleSectionChange = (section: 'booking' | 'haircut' | 'massage' | 'gallery') => {
    console.log('Changing section to:', section);
    setActiveSection(section);
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
        ) : activeTab === 'history' ? (
          <div className="bg-white/10 backdrop-blur-md dark:bg-gray-800/10 rounded-xl p-6 md:p-8 mb-8">
            {isLoading ? (
              <div className="py-8 text-center">
                <div className="w-8 h-8 border-4 border-callGreen border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white">Loading your bookings...</p>
              </div>
            ) : (
              <>
                <BookingHistory bookings={bookings} isLoading={isLoading} />
                <button 
                  onClick={addSampleBookings}
                  className="mt-4 bg-gray-700 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 text-white px-4 py-2 rounded text-sm"
                >
                  Add Sample Bookings
                </button>
              </>
            )}
          </div>
        ) : activeTab === 'admin' && isAdmin ? (
          <div className="bg-white/10 backdrop-blur-md dark:bg-gray-800/10 rounded-xl p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Admin Dashboard</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Bookings Management</h3>
                <AdminBookings />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Services Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/20 p-4 rounded-md">
                    <h4 className="font-medium text-white">Haircut</h4>
                    <p className="text-gray-200">KES 3,900</p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-md">
                    <h4 className="font-medium text-white">Beard Trim</h4>
                    <p className="text-gray-200">KES 2,600</p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-md">
                    <h4 className="font-medium text-white">Hot Shave</h4>
                    <p className="text-gray-200">KES 3,250</p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-md">
                    <h4 className="font-medium text-white">Hair & Beard Combo</h4>
                    <p className="text-gray-200">KES 5,850</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {galleryImages.map((image, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden h-36">
                      <img 
                        src={image.src} 
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                        <p className="text-white text-sm">{image.caption}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <NavigationTabs 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        showAdmin={isAdmin || false}
      />
    </div>
  );
};

export default Index;
