
import React from 'react';
import { Calendar, Scissors, Activity, Image } from 'lucide-react';

interface SectionNavigationProps {
  activeSection: 'booking' | 'haircut' | 'massage' | 'gallery';
  onSectionChange: (section: 'booking' | 'haircut' | 'massage' | 'gallery') => void;
}

const SectionNavigation: React.FC<SectionNavigationProps> = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { id: 'booking', label: 'Booking', icon: <Calendar className="w-5 h-5" /> },
    { id: 'haircut', label: 'Haircut Services', icon: <Scissors className="w-5 h-5" /> },
    { id: 'massage', label: 'Massage Services', icon: <Activity className="w-5 h-5" /> },
    { id: 'gallery', label: 'Gallery', icon: <Image className="w-5 h-5" /> }
  ];

  return (
    <div className="pt-8">
      <h2 className="text-xl font-playfair font-bold text-white mb-6">Sections</h2>
      <nav>
        <ul className="space-y-4">
          {menuItems.map(item => (
            <li key={item.id}>
              <a 
                href={`#${item.id}`}
                className={`flex items-center gap-3 px-2 py-3 rounded-md transition-colors ${
                  activeSection === item.id 
                    ? 'bg-white/20 text-white' 
                    : 'text-gray-200 hover:text-white hover:bg-white/10'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  onSectionChange(item.id as 'booking' | 'haircut' | 'massage' | 'gallery');
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SectionNavigation;
