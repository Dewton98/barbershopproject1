
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 bg-black/40 backdrop-blur-md z-50">
      <div className="content-container">
        <div className="flex justify-between items-center h-16">
          <div 
            className="text-white font-playfair font-bold text-xl cursor-pointer"
            onClick={() => navigate('/')}
          >
            Premium Barber
          </div>
          
          <button 
            onClick={() => navigate('/admin')}
            className="text-white hover:text-callGreen flex items-center text-sm"
          >
            <Shield className="w-4 h-4 mr-1" />
            Admin
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
