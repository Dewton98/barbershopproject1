
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import SectionNavigation from './SectionNavigation';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-black/40 backdrop-blur-md z-50">
      <div className="content-container">
        <div className="flex justify-between items-center h-16 px-4">
          <div 
            className="text-white font-playfair font-bold text-xl cursor-pointer"
            onClick={() => navigate('/')}
          >
            Project 1
          </div>
          
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <button className="text-white p-2 rounded-md hover:bg-white/10">
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black/80 backdrop-blur-md border-white/10">
              <SectionNavigation onItemClick={() => setIsMenuOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
