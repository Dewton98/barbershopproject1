
import React from 'react';
import { Calendar, Scissors, Activity, Image } from 'lucide-react';

interface SectionNavigationProps {
  onItemClick?: () => void;
}

const SectionNavigation: React.FC<SectionNavigationProps> = ({ onItemClick }) => {
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
                className="flex items-center gap-3 px-2 py-3 text-gray-200 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                  if (onItemClick) onItemClick();
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
