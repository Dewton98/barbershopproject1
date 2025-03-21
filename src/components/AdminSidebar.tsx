
import React from 'react';
import { Calendar, Users, UserCircle, Settings } from 'lucide-react';

interface AdminSidebarProps {
  activeView: 'bookings' | 'staff' | 'customers';
  onViewChange: (view: 'bookings' | 'staff' | 'customers') => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeView, onViewChange }) => {
  const menuItems = [
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'customers', label: 'Customers', icon: UserCircle },
  ];

  return (
    <aside className="w-64 bg-white shadow h-[calc(100vh-4rem)]">
      <div className="p-4 border-b">
        <h2 className="font-bold text-xl text-gray-800">Admin Panel</h2>
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
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
