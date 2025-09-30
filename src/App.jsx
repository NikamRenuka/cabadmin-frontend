import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import BookingsPage from "./pages/BookingsPage";
import EarningsPage from "./pages/EarningsPage";
import RatesPage from "./pages/RatesPage";
import NotificationsPage from "./pages/NotificationsPage";
import PaymentsPage from "./pages/PaymentsPage";
import Login from "./pages/Login";

function App() {
  const [currentPage, setCurrentPage] = useState("bookings");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getPageTitle = (page) => {
    switch (page) {
      case "bookings":
        return "Bookings Management";
      case "earnings":
        return "Earnings & Analytics";
      case "rates":
        return "Rate Configuration";
      case "notifications":
        return "Notifications";
      case "payments":
        return "Payments Dashboard";
      default:
        return "Dashboard";
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "bookings":
        return <BookingsPage searchQuery={searchQuery} />;
      case "earnings":
        return <EarningsPage />;
      case "rates":
        return <RatesPage />;
      case "notifications":
        return <NotificationsPage />;
      case "payments":
        return <PaymentsPage />;
      default:
        return <BookingsPage searchQuery={searchQuery} />;
    }
  };

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("bookings");
  };

  const handleSearch = (query) => setSearchQuery(query);
  const handleNotificationsClick = () => setCurrentPage("notifications");

  const DashboardLayout = () => (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (desktop) */}
      <div className="hidden md:block">
        <Sidebar
          currentPage={currentPage}
          onPageChange={(p) => {
            setCurrentPage(p);
            setSidebarOpen(false);
          }}
          onLogout={handleLogout}
          onNotificationsClick={handleNotificationsClick}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
          <Sidebar
            currentPage={currentPage}
            onPageChange={(p) => {
              setCurrentPage(p);
              setSidebarOpen(false);
            }}
            onLogout={handleLogout}
            onNotificationsClick={handleNotificationsClick}
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64">
        <Header
          title={getPageTitle(currentPage)}
          subtitle={
            currentPage === "rates"
              ? "Manage pricing for different services and vehicles"
              : currentPage === "earnings"
              ? "Monitor earnings, trips, and financial performance at a glance"
              : undefined
          }
          onLogout={handleLogout}
          onSearch={handleSearch}
          onNotificationsClick={handleNotificationsClick}
        />

        {/* Mobile menu button */}
        <button
          className="md:hidden m-4 p-2 rounded bg-blue-600 text-white w-fit"
          onClick={() => setSidebarOpen(true)}
        >
          ☰ Menu
        </button>

        <main className="transition-all duration-300 p-6">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login onLogin={handleLogin} />} />

      {/* Private route */}
      <Route
        path="/dashboard"
        element={isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />}
      />

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
