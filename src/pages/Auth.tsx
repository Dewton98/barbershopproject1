
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabase } from '@/integrations/supabase/provider';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FcGoogle } from 'react-icons/fc';
import { Separator } from "@/components/ui/separator";

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();
  const { user } = useSupabase();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we're returning from a OAuth redirect
    const handleOAuthRedirect = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error checking session:", error);
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      // If we have a user session, consider auth successful
      if (data.session) {
        console.log("Session detected after OAuth redirect");
        navigate('/');
      }
    };
    
    // Call the function to handle OAuth redirect
    handleOAuthRedirect();
    
    // Also check if user is already logged in for normal navigation
    if (user) {
      navigate('/');
    }
  }, [user, navigate, toast]);

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
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
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
          <h2 className="text-3xl font-playfair font-bold text-white mb-6 text-center">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          
          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/20 text-white border border-white/20 rounded-md p-3"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/20 text-white border border-white/20 rounded-md p-3"
                placeholder="••••••••"
              />
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-md font-semibold text-white ${
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
              className="w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded flex items-center justify-center gap-2"
            >
              <FcGoogle className="w-5 h-5" />
              {googleLoading ? 'Processing...' : 'Continue with Google'}
            </Button>
          </div>
          
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-gray-300 hover:text-white transition-colors"
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
