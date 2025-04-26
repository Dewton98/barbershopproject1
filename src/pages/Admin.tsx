
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSupabase } from '@/integrations/supabase/provider';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import AdminBookings from '@/components/AdminBookings';
import AdminSidebar from '@/components/AdminSidebar';

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<'bookings' | 'staff' | 'customers'>('bookings');
  const { user } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();

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
      <Header />
      
      <div className="pt-16 flex">
        <AdminSidebar activeView={activeView} onViewChange={setActiveView} />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Admin Dashboard</h1>
            
            {activeView === 'bookings' && <AdminBookings />}
            {activeView === 'staff' && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Staff Management</h2>
                <p className="text-gray-500">Staff management functionality coming soon.</p>
              </div>
            )}
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
