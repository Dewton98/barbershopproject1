
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { BsPersonFill, BsEnvelopeFill, BsLockFill } from 'react-icons/bs';

interface RegisterFormProps {
  onRegisterSuccess: () => void;
}

const RegisterForm = ({ onRegisterSuccess }: RegisterFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
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
      
      onRegisterSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-6">
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
        {loading ? 'Processing...' : 'Sign Up'}
      </Button>
    </form>
  );
};

export default RegisterForm;
