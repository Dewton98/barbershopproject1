
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabase } from '@/integrations/supabase/provider';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { Separator } from "@/components/ui/separator";
import { BsPersonFill, BsEnvelopeFill, BsLockFill } from 'react-icons/bs';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();
  const { user } = useSupabase();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      console.log("Checking session on Auth page load...");
      
      // Get the current session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Error checking session:", sessionError);
        toast({
          title: "Authentication Error",
          description: sessionError.message,
          variant: "destructive",
        });
        return;
      }
      
      // If we have a session, redirect to the home page
      if (sessionData?.session) {
        console.log("Active session found, redirecting to home");
        navigate('/');
      } else {
        console.log("No active session found");
      }
    };
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, !!session);
        
        if (session) {
          console.log("New session detected, redirecting to home");
          navigate('/');
        }
      }
    );
    
    checkSession();
    
    // Clean up the subscription when component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Logged in successfully",
          description: "Welcome back!",
        });
      } else {
        // Sign up
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username,
            }
          }
        });
        
        if (error) throw error;
        
        toast({
          title: "Signed up successfully",
          description: "Welcome to Premium Barber Shop!",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setGoogleLoading(true);
      
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
      setGoogleLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
      style={{
        backgroundImage: 'url("/lovable-uploads/307d6cc2-7249-4075-95a2-c1ce6c09f4ea.png")',
        backgroundColor: '#9ED0BD',
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
          <h2 className="text-3xl font-playfair font-bold text-white mb-6 text-center animation">
            {isLogin ? 'Welcome Back' : 'Sign Up'}
          </h2>
          
          <form onSubmit={handleAuth} className="space-y-6">
            {!isLogin && (
              <div className="relative input-box animation">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full bg-white/20 text-white border-b border-white/20 p-3 pl-10 focus:outline-none focus:border-white transition-all"
                  placeholder=" "
                />
                <label className="absolute text-white/80 left-10 top-3 transition-all duration-300 pointer-events-none">
                  Username
                </label>
                <BsPersonFill className="absolute left-3 top-4 text-white" size={18} />
              </div>
            )}
            
            <div className="relative input-box animation">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/20 text-white border-b border-white/20 p-3 pl-10 focus:outline-none focus:border-white transition-all"
                placeholder=" "
              />
              <label className="absolute text-white/80 left-10 top-3 transition-all duration-300 pointer-events-none">
                Email
              </label>
              <BsEnvelopeFill className="absolute left-3 top-4 text-white" size={18} />
            </div>
            
            <div className="relative input-box animation">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/20 text-white border-b border-white/20 p-3 pl-10 focus:outline-none focus:border-white transition-all"
                placeholder=" "
              />
              <label className="absolute text-white/80 left-10 top-3 transition-all duration-300 pointer-events-none">
                Password
              </label>
              <BsLockFill className="absolute left-3 top-4 text-white" size={18} />
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-md font-semibold text-white animation ${
                loading ? 'bg-gray-500' : 'bg-callGreen hover:bg-callGreen/80'
              } transition-colors`}
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
          
          <div className="mt-6 flex items-center gap-3">
            <Separator className="flex-1 bg-white/20" />
            <span className="text-white text-sm">OR</span>
            <Separator className="flex-1 bg-white/20" />
          </div>
          
          <div className="mt-6">
            <Button
              type="button"
              onClick={handleGoogleAuth}
              disabled={googleLoading}
              className="w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded flex items-center justify-center gap-2 animation"
            >
              <FcGoogle className="w-5 h-5" />
              {googleLoading ? 'Processing...' : 'Continue with Google'}
            </Button>
          </div>
          
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-gray-300 hover:text-white transition-colors animation"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
