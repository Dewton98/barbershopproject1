
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, UserCircle, Settings } from 'lucide-react';

interface AdminSidebarProps {
  activeView: 'bookings' | 'staff' | 'customers';
  onViewChange: (view: 'bookings' | 'staff' | 'customers') => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeView, onViewChange }) => {
  const navigate = useNavigate();
  
  const menuItems = [
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'customers', label: 'Customers', icon: UserCircle },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow h-[calc(100vh-4rem)]">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="font-bold text-xl text-gray-800 dark:text-gray-200">Admin Panel</h2>
      </div>
      
      <nav className="mt-4">
        <ul>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id as 'bookings' | 'staff' | 'customers')}
                  className={`w-full flex items-center px-6 py-3 text-left ${
                    activeView === item.id
                      ? 'bg-callGreen/10 text-callGreen border-l-4 border-callGreen'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
          
          <li>
            <button
              onClick={() => navigate('/settings')}
              className="w-full flex items-center px-6 py-3 text-left text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Settings className="w-5 h-5 mr-3" />
              <span>Settings</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
