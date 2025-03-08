
import React from 'react';
import { Calendar, History } from 'lucide-react';

interface NavigationTabsProps {
  activeTab: 'booking' | 'history';
  onTabChange: (tab: 'booking' | 'history') => void;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-white/10">
      <div className="max-w-md mx-auto flex justify-around">
        <button
          onClick={() => onTabChange('booking')}
          className={`flex flex-col items-center py-4 px-6 transition-colors duration-200 ${
            activeTab === 'booking'
              ? 'text-callGreen'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Calendar className="w-6 h-6" />
          <span className="text-sm mt-1">Book</span>
        </button>
        <button
          onClick={() => onTabChange('history')}
          className={`flex flex-col items-center py-4 px-6 transition-colors duration-200 ${
            activeTab === 'history'
              ? 'text-callGreen'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <History className="w-6 h-6" />
          <span className="text-sm mt-1">History</span>
        </button>
      </div>
    </div>
  );
};

export default NavigationTabs;
