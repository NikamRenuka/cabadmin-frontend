import React, { useState, useEffect } from "react";
import { Bell, CheckCircle } from "lucide-react";

const API_URL = process.env.Backend_URL || "http://localhost:5000";
const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");

  // Fetch notifications
  const fetchNotifications = () => {
    fetch(`${API_URL}/api/notifications`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((n) => ({
          id: n._id,
          message: n.message,
          date: new Date(n.date).toLocaleString(),
          read: n.read,
        }));
        setNotifications(formatted);
      })
      .catch((err) => console.error("❌ Failed to fetch notifications", err));
  };

  useEffect(() => {
    fetchNotifications();

    // 🔄 Auto-refresh every 5 seconds
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  // Mark as read
  const markAsRead = async (id) => {
    try {
      await fetch(`${API_URL}/api/notifications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("❌ Failed to mark notification as read", err);
    }
  };

  // Apply filter
  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
      {/* Filter Tabs */}
      <div className="flex gap-3">
        {["all", "unread", "read"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === type
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden divide-y">
        {filteredNotifications.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">
            No notifications available
          </p>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`flex items-start px-4 md:px-6 py-4 cursor-pointer transition ${
                n.read
                  ? "bg-gray-50 hover:bg-gray-100"
                  : "bg-blue-50 hover:bg-blue-100"
              }`}
            >
              <div className="flex-shrink-0 mt-1">
                {n.read ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Bell className="w-5 h-5 text-blue-500" />
                )}
              </div>
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    n.read ? "text-gray-700" : "text-gray-900"
                  }`}
                >
                  {n.message}
                </p>
                <p className="text-xs text-gray-500">{n.date}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
