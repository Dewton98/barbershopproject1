
import React from 'react';
import { useNavigate } from 'react-router-dom';

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
            Project 1
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
