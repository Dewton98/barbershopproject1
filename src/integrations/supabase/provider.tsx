
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from './client';
import { toast } from "@/hooks/use-toast";

// Create context
type SupabaseContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
};

const SupabaseContext = createContext<SupabaseContextType>({
  user: null,
  session: null,
  isLoading: true,
});

// Create provider
export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        if (event === 'PASSWORD_RECOVERY') {
          toast({
            title: "Password Recovery",
            description: "Please update your password",
          });
        }
        
        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully');
        }
      }
    );

    // THEN check for existing session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Exception checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Run session check
    checkSession();

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    isLoading,
  };

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
};

// Create hook for using the context
export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
