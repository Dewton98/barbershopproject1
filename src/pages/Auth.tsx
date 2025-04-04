
import React, { useState } from 'react';
import { useSupabase } from '@/integrations/supabase/provider';
import { Separator } from "@/components/ui/separator";
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user } = useSupabase();
  
  // Use our custom hook to handle authentication redirects
  // If user is authenticated, redirect to home page
  const { isLoading } = useAuthRedirect('/', true);

  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-callGreen border-t-transparent"></div>
      </div>
    );
  }

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
          
          {isLogin ? (
            <LoginForm onLoginSuccess={() => {}} />
          ) : (
            <RegisterForm onRegisterSuccess={() => setIsLogin(true)} />
          )}
          
          <div className="mt-6 flex items-center gap-3">
            <Separator className="flex-1 bg-white/20" />
            <span className="text-white text-sm">OR</span>
            <Separator className="flex-1 bg-white/20" />
          </div>
          
          <div className="mt-6">
            <GoogleAuthButton />
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
