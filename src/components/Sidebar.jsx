import React from 'react';
import {
  Car,
  Settings,
  BarChart3,
  LogOut,
  Bell,
  CreditCard,
} from 'lucide-react';

const Sidebar = ({ currentPage, onPageChange, onLogout, onNotificationsClick }) => {
  const menuItems = [
    { id: 'bookings', label: 'Bookings', icon: Car },
    { id: 'earnings', label: 'Earnings', icon: BarChart3 },
    { id: 'rates', label: 'Rates', icon: Settings },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="bg-white shadow-xl h-screen w-64 fixed left-0 top-0 z-50 flex flex-col transform md:translate-x-0">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
            <Car className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">SSST Cabs</h1>
          </div>
        </div>
      </div>

      <nav className="mt-6 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'notifications') {
                  onNotificationsClick();
                  onPageChange('notifications'); // ✅ ensures sidebar closes
                } else {
                  onPageChange(item.id);
                }
              }}
              className={`w-full flex items-center space-x-3 px-6 py-4 text-left transition-all duration-200 hover:bg-blue-50 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-r-4 border-blue-600 text-blue-700'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : ''}`} />
              <span className={`font-medium ${isActive ? 'text-blue-700' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-gray-200 mt-auto">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
