import React, { useState, useEffect, useRef } from 'react';
import { Bell, User, Search } from 'lucide-react';

const Header = ({ title, subtitle, onLogout, onSearch, onNotificationsClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value); // 🔎 passes query up to App
  };

  // ✅ close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ✅ helper text mapping per page
  const helperTexts = {
    "Bookings Management": "Manage and track all customer bookings here",
    "Payments": "View and manage customer payments and transactions",
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex-shrink-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Title + Subtitle */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {/* ✅ Dynamic helper text */}
          {helperTexts[title] && (
            <p className="text-sm text-gray-600 mt-1">
              {helperTexts[title]}
            </p>
          )}
        </div>

        {/* Search + Actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
            />
          </div>

          {/* Notifications */}
          <div className="relative cursor-pointer" onClick={onNotificationsClick}>
            <Bell className="w-6 h-6 text-gray-600 hover:text-blue-600 transition-colors duration-200" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </div>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center space-x-3 bg-gray-50 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="bg-black p-2 rounded-full">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-800">Admin</p>
                <p className="text-gray-500">Owner</p>
              </div>
            </div>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
