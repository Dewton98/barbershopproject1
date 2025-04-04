
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

/**
 * Hook to handle authentication redirects
 * @param {string} redirectPath - Path to redirect to when user is authenticated
 * @param {boolean} redirectIfAuthenticated - If true, redirect when user is authenticated; if false, redirect when not authenticated
 * @returns {boolean} isLoading - Whether authentication check is in progress
 */
export const useAuthRedirect = (redirectPath: string, redirectIfAuthenticated: boolean = true) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log(`Checking session (redirectIfAuthenticated: ${redirectIfAuthenticated})...`);
        
        // Get the current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error checking session:", sessionError);
          toast({
            title: "Authentication Error",
            description: sessionError.message,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        const hasSession = !!sessionData?.session;
        
        // If user is authenticated and we should redirect if authenticated, redirect to specified path
        if (hasSession && redirectIfAuthenticated) {
          console.log(`User authenticated, redirecting to ${redirectPath}`);
          navigate(redirectPath);
        } 
        // If user is NOT authenticated and we should redirect if NOT authenticated, redirect to specified path
        else if (!hasSession && !redirectIfAuthenticated) {
          console.log(`User not authenticated, redirecting to ${redirectPath}`);
          navigate(redirectPath);
        } else {
          console.log(`No redirection needed. Authentication status: ${hasSession}`);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Unexpected error during authentication check:", error);
        setIsLoading(false);
      }
    };
    
    // Check session immediately
    checkSession();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, !!session);
        
        if ((session && redirectIfAuthenticated) || (!session && !redirectIfAuthenticated)) {
          console.log(`Auth state changed, redirecting to ${redirectPath}`);
          navigate(redirectPath);
        }
      }
    );
    
    // Clean up the subscription when component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast, redirectPath, redirectIfAuthenticated]);

  return { isLoading };
};
