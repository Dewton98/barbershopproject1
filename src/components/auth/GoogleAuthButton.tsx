
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';

const GoogleAuthButton = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      
      // Get the current URL of the application - fully qualified URL
      const currentUrl = window.location.origin;
      console.log("Current URL for redirect:", currentUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: currentUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        },
      });
      
      if (error) throw error;
      
      // The user will be redirected to Google's OAuth page
      console.log("Redirecting to Google OAuth...", data);
      
    } catch (error: any) {
      console.error("Google auth error:", error);
      toast({
        title: "Error",
        description: error?.message || "An error occurred during Google authentication",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleGoogleAuth}
      disabled={loading}
      className="w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded flex items-center justify-center gap-2 animation"
    >
      <FcGoogle className="w-5 h-5" />
      {loading ? 'Processing...' : 'Continue with Google'}
    </Button>
  );
};

export default GoogleAuthButton;
