
import React from 'react';
import { Calendar, History, Settings, User } from 'lucide-react';
import { useSupabase } from '@/integrations/supabase/provider';

interface NavigationTabsProps {
  activeTab: 'booking' | 'history' | 'admin';
  onTabChange: (tab: 'booking' | 'history' | 'admin') => void;
  showAdmin?: boolean;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, onTabChange, showAdmin = false }) => {
  const { user } = useSupabase();
  
  // Check if user has admin role
  const isAdmin = user?.user_metadata?.role === 'admin' || user?.user_metadata?.role === 'staff';
  
  // Only show admin tab if user is authenticated and has admin/staff role
  const shouldShowAdmin = showAdmin && isAdmin;
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
        {shouldShowAdmin && (
          <button
            onClick={() => onTabChange('admin')}
            className={`flex flex-col items-center py-4 px-6 transition-colors duration-200 ${
              activeTab === 'admin'
                ? 'text-callGreen'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Settings className="w-6 h-6" />
            <span className="text-sm mt-1">Admin</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default NavigationTabs;
