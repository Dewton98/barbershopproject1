
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSupabase } from '@/integrations/supabase/provider';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import AdminBookings from '@/components/AdminBookings';
import AdminSidebar from '@/components/AdminSidebar';
import HaircutServiceSection from '@/components/HaircutServiceSection';
import MassageServiceSection from '@/components/MassageServiceSection';
import GallerySection from '@/components/GallerySection';

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<'bookings' | 'staff' | 'customers'>('bookings');
  const [activeSection, setActiveSection] = useState<'booking' | 'haircut' | 'massage' | 'gallery'>('booking');
  const { user } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();

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
    const checkAdminStatus = async () => {
      if (!user) {
        setIsLoading(false);
        setIsAdmin(false);
        return;
      }

      try {
        // For this demo, we'll just check if the user's email contains 'admin'
        // In a real app, you would check against a proper admin role in the database
        const isUserAdmin = user.email?.includes('admin') || false;
        setIsAdmin(isUserAdmin);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  // Use effect to show toast when isAdmin is set to false
  useEffect(() => {
    if (isAdmin === false && !isLoading) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin area",
        variant: "destructive",
      });
      navigate("/", { replace: true });
    }
  }, [isAdmin, isLoading, toast, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-callGreen border-t-transparent"></div>
      </div>
    );
  }

  // Instead of rendering a Navigate component and calling toast during render,
  // we handle this in the useEffect above
  if (!isAdmin) {
    return null; // Return null while the navigation happens in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
      />
      
      <div className="pt-16 flex">
        <AdminSidebar activeView={activeView} onViewChange={setActiveView} />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Admin Dashboard</h1>
            
            {/* Always show bookings management section */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Bookings Management</h2>
              <AdminBookings />
            </div>
            
            {/* Always show services section */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Services Overview</h2>
              
              <div className="space-y-6">
                {/* Haircut Services */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Haircut Services</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium">Haircut</h4>
                      <p className="text-gray-600">KES 3,900</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium">Beard Trim</h4>
                      <p className="text-gray-600">KES 2,600</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium">Hot Shave</h4>
                      <p className="text-gray-600">KES 3,250</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium">Hair & Beard Combo</h4>
                      <p className="text-gray-600">KES 5,850</p>
                    </div>
                  </div>
                </div>
                
                {/* Massage Services */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Massage Services</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium">Head Massage</h4>
                      <p className="text-gray-600">KES 3,250</p>
                      <p className="text-sm text-gray-500">Duration: 20 minutes</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium">Face Massage</h4>
                      <p className="text-gray-600">KES 2,600</p>
                      <p className="text-sm text-gray-500">Duration: 15 minutes</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium">Shoulder & Back</h4>
                      <p className="text-gray-600">KES 4,550</p>
                      <p className="text-sm text-gray-500">Duration: 30 minutes</p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium">Premium Package</h4>
                      <p className="text-gray-600">KES 7,800</p>
                      <p className="text-sm text-gray-500">Duration: 45 minutes</p>
                    </div>
                  </div>
                </div>
                
                {/* Gallery */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Gallery</h3>
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
            
            {/* Staff management section - only show when activeView is staff */}
            {activeView === 'staff' && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Staff Management</h2>
                <p className="text-gray-500">Staff management functionality coming soon.</p>
              </div>
            )}
            
            {/* Customer management section - only show when activeView is customers */}
            {activeView === 'customers' && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Customer Management</h2>
                <p className="text-gray-500">Customer management functionality coming soon.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
