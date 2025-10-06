import React, { useRef, useState, useEffect } from "react";
import { Bell, User, Search } from "lucide-react";

const API_URL =
  import.meta.env.REACT_APP_Backend_URL ||
  "https://cabadmin-backend-production.up.railway.app";

const Header = ({ title, subtitle, currentPage, searchQuery = "", onSearch, onLogout, onNotificationsClick }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [isComposing, setIsComposing] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const helperTexts = {
    "Bookings Management": "Manage and track all customer bookings here",
    "Payments": "View and manage customer payments and transactions",
  };

  useEffect(() => {
    if (!isComposing) {
      setLocalQuery(searchQuery || "");
    }
  }, [searchQuery, isComposing]);

  useEffect(() => {
    const id = setTimeout(() => {
      if (typeof onSearch === "function") onSearch(localQuery);
      if (inputRef.current) inputRef.current.focus();
    }, 400);
    return () => clearTimeout(id);
  }, [localQuery]);

  const showSearch = ["bookings", "payments", "notifications"].includes(currentPage);
  const placeholder = currentPage === "bookings"
    ? "Search bookings by name, phone, pickup, drop, driver"
    : currentPage === "payments"
    ? "Search payments by customer or date"
    : currentPage === "notifications"
    ? "Search notifications"
    : "Search...";

  useEffect(() => {
    let cancelled = false;
    const fetchCount = async () => {
      try {
        const res = await fetch(`${API_URL}/api/notifications`);
        const data = await res.json();
        if (!cancelled && Array.isArray(data)) {
          const unread = data.filter((n) => !n.read).length;
          setNotificationCount(unread);
        }
      } catch (e) {}
    };
    fetchCount();
    const id = setInterval(fetchCount, 5000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <header className="bg-white/90 backdrop-blur sticky top-0 z-30 shadow-sm border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 flex-shrink-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          {helperTexts[title] && (
            <p className="text-sm text-gray-600 mt-1">{helperTexts[title]}</p>
          )}
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {showSearch && (
            <div className="relative w-full min-w-0 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={placeholder}
                ref={inputRef}
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={(e) => {
                  setIsComposing(false);
                  setLocalQuery(e.target.value);
                }}
                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              />
              {localQuery && (
                <button
                  aria-label="Clear search"
                  onClick={() => setLocalQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
          )}

          <div className="relative cursor-pointer" onClick={onNotificationsClick}>
            <Bell className="w-6 h-6 text-gray-600 hover:text-blue-600 transition-colors duration-200" />
            {notificationCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
          </div>

          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center space-x-2 md:space-x-3 bg-gray-50 rounded-lg px-2 md:px-3 py-2 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="bg-black p-2 rounded-full">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block text-sm">
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