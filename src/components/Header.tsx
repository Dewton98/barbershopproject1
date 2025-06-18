
import React from 'react';

interface HeaderProps {
  activeSection: 'booking' | 'haircut' | 'massage' | 'gallery';
  onSectionChange: (section: 'booking' | 'haircut' | 'massage' | 'gallery') => void;
}

const Header: React.FC<HeaderProps> = ({ activeSection, onSectionChange }) => {
  const handleLogoClick = () => {
    // Navigate to booking section when logo is clicked
    onSectionChange('booking');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-black/40 backdrop-blur-md z-50">
      <div className="content-container">
        <div className="flex justify-between items-center h-16 px-4">
          <div 
            className="text-white font-playfair font-bold text-xl cursor-pointer"
            onClick={handleLogoClick}
          >
            Project 1
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
