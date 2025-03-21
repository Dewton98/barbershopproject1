
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '@/integrations/supabase/provider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, LogOut, Shield } from 'lucide-react';

const Header = () => {
  const { user } = useSupabase();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out",
        description: "You've been successfully logged out",
      });
      
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  // Check if user is an admin (email contains 'admin')
  const isAdmin = user?.email?.includes('admin') || false;

  return (
    <header className="fixed top-0 left-0 right-0 bg-black/40 backdrop-blur-md z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <div 
          className="text-white font-playfair font-bold text-xl cursor-pointer"
          onClick={() => navigate('/')}
        >
          Premium Barber
        </div>
        
        {user ? (
          <div className="flex items-center space-x-4">
            <div className="text-white flex items-center">
              <User className="w-4 h-4 mr-2" />
              <span className="text-sm">{user.email}</span>
            </div>
            
            {isAdmin && (
              <button 
                onClick={() => navigate('/admin')}
                className="text-white hover:text-callGreen flex items-center text-sm"
              >
                <Shield className="w-4 h-4 mr-1" />
                Admin
              </button>
            )}
            
            <button 
              onClick={handleLogout}
              className="text-white hover:text-callGreen flex items-center text-sm"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </button>
          </div>
        ) : (
          <button 
            onClick={() => navigate('/auth')}
            className="text-white hover:text-callGreen flex items-center text-sm"
          >
            <User className="w-4 h-4 mr-1" />
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
