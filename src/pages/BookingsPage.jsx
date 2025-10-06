// BookingsPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Cake,
  Users,
  IndianRupee,
  Hash,
  Pencil,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
const API_URL = import.meta.env.REACT_APP_Backend_URL || "https://cabadmin-backend-production.up.railway.app";
const drivers = [
  { id: 1, name: "Ramesh" },
  { id: 2, name: "Suresh" },
  { id: 3, name: "Amit" },
  { id: 4, name: "Deepak" },
  { id: 5, name: "Vijay" },
  { id: 6, name: "Arjun" },
];

const BookingsPage = ({ searchQuery = "" }) => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [driverModal, setDriverModal] = useState(null);
  const [driverSearch, setDriverSearch] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/bookings`);
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    const filtered = bookings.filter(
      (b) =>
        b.customerName.toLowerCase().includes(q) ||
        b.phone.toLowerCase().includes(q) ||
        b.pickup.toLowerCase().includes(q) ||
        b.drop.toLowerCase().includes(q) ||
        (b.driverName && b.driverName.toLowerCase().includes(q))
    );
    setFilteredBookings(filtered);
  }, [searchQuery, bookings]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus, driverName = null) => {
    try {
      const updateData = { status: newStatus };
      if (driverName) {
        updateData.driverName = driverName;
      }
      
      await axios.put(`${API_URL}/api/bookings/${bookingId}`, updateData);

      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId
            ? { ...b, status: newStatus, driverName: driverName || b.driverName }
            : b
        )
      );
      setDriverModal(null);
    } catch (error) {
      console.error("Failed to update booking:", error);
    }
  };

  const formatRupee = (value) =>
    value ? `₹${value.toLocaleString("en-IN")}` : "—";

  const computeFareDetails = (booking) => {
    if (booking.rideType === "Shared") {
      const perSeat = booking.fare || 0;
      const total = perSeat * (booking.passengers || 1);
      return { perSeat, total, passengers: booking.passengers };
    }
    return { total: booking.fare || 0 };
  };

  const filteredDrivers = drivers.filter((d) =>
    d.name.toLowerCase().includes(driverSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Loading bookings...
      </div>
    );
  }

  if (filteredBookings.length === 0 && !searchQuery) {
    return (
      <div className="text-center mt-10 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700">No bookings found.</h2>
        <p className="text-gray-500 mt-2">Check your database connection or run the seeding script.</p>
      </div>
    );
  }
  
  return (
    <div className="w-full space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl p-4 text-white shadow">
          <h3 className="text-sm font-medium opacity-90">Total Bookings</h3>
          <p className="text-2xl font-bold">{filteredBookings.length}</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-4 text-white shadow">
          <h3 className="text-sm font-medium opacity-90">Pending</h3>
          <p className="text-2xl font-bold">
            {filteredBookings.filter((b) => b.status === "Pending").length}
          </p>
        </div>
        <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-xl p-4 text-white shadow">
          <h3 className="text-sm font-medium opacity-90">Confirmed</h3>
          <p className="text-2xl font-bold">
            {filteredBookings.filter((b) => b.status === "Confirmed").length}
          </p>
        </div>
      </div>

      {/* Mobile Cards (show on small screens) */}
      <div className="grid md:hidden grid-cols-1 gap-4">
        {filteredBookings.map((b) => {
          const fd = computeFareDetails(b);
          return (
            <div key={b._id} className="bg-white rounded-xl shadow p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-base font-semibold text-gray-900">{b.customerName}</p>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <Phone className="w-4 h-4 mr-1" /> {b.phone}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(b.status)}`}>{b.status}</span>
              </div>
              <div className="mt-3 border-l-4 border-blue-500 pl-3">
                <div className="text-sm font-bold text-gray-900 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-blue-600" /> {b.pickup}
                  <span className="mx-1">→</span>
                  {b.drop}
                </div>
                <div className="text-xs text-gray-500 mt-1 flex items-center">
                  <Clock className="w-3 h-3 mr-1" /> {b.bookingTime}
                </div>
                <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full mt-2">
                  {b.tripType} ({b.rideType || "Exclusive"})
                </span>
              </div>
              <div className="mt-3">
                <p className="text-sm text-gray-900 font-medium">{b.vehicleType}</p>
                {b.rideType === 'Shared' ? (
                  <div className="text-sm text-gray-700">
                    <div>
                      {formatRupee(fd.perSeat)} <span className="text-xs">per seat</span>
                    </div>
                    <div className="font-bold text-green-600">Total: {formatRupee(fd.total)}</div>
                  </div>
                ) : (
                  <p className="text-lg font-bold text-green-600">{formatRupee(fd.total)}</p>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <button onClick={() => setSelectedCustomer(b)} className="text-sm text-blue-600 underline">View</button>
                {b.status === 'Pending' ? (
                  <div className="flex gap-2">
                    <button onClick={() => setDriverModal(b)} className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg">Allocate</button>
                    <button onClick={() => handleStatusUpdate(b._id, 'Cancelled')} className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg">Reject</button>
                  </div>
                ) : (
                  b.driverName && <p className="text-xs text-gray-600">Driver: {b.driverName}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Table (md and up) */}
      <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden relative">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">All Bookings</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Customer
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Trip Details
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Vehicle & Fare
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Status
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((b) => {
                const fd = computeFareDetails(b);
                return (
                  <tr
                    key={b._id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    {/* Customer */}
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-900">
                        {b.customerName}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Phone className="w-4 h-4 mr-1" /> {b.phone}
                      </div>
                      <button
                        onClick={() => setSelectedCustomer(b)}
                        className="mt-2 text-xs text-blue-600 underline hover:text-blue-800"
                      >
                        View Details
                      </button>
                    </td>

                    {/* Trip */}
                    <td className="px-4 md:px-6 py-4">
                      <div className="space-y-2 border-l-4 border-blue-500 pl-3">
                        <div className="flex items-center text-sm text-gray-900 font-bold">
                          <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                          <span>{b.pickup}</span>
                          <span className="mx-1 text-gray-700 font-semibold">
                            →
                          </span>
                          <span>{b.drop}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" /> {b.bookingTime}
                        </div>
                        <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                          {b.tripType} ({b.rideType || "Exclusive"})
                        </span>
                      </div>
                    </td>

                    {/* Fare */}
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-900">
                        {b.vehicleType}
                      </p>
                      {b.rideType === "Shared" ? (
                        <div className="text-sm text-gray-700">
                          <div>
                            {formatRupee(fd.perSeat)}{" "}
                            <span className="text-xs">per seat</span>
                          </div>
                          <div className="font-bold text-green-600">
                            Total: {formatRupee(fd.total)}
                          </div>
                          <p className="text-xs text-gray-500">
                            Passengers: {fd.passengers}
                          </p>
                        </div>
                      ) : (
                        <p className="text-lg font-bold text-green-600">
                          {formatRupee(fd.total)}
                        </p>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          b.status
                        )}`}
                      >
                        {b.status}
                      </span>
                      {b.driverName && (
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-500">
                            Driver: {b.driverName}
                          </p>
                          <button
                            onClick={() => setDriverModal(b)}
                            className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                          >
                            <Pencil className="w-3 h-3 mr-1" /> Edit
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {b.status === "Pending" && (
                          <>
                            <button
                              onClick={() => setDriverModal(b)}
                              className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" /> Allocate & Confirm
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(b._id, "Cancelled")}
                              className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700"
                            >
                              <XCircle className="w-4 h-4 mr-1" /> Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Driver Allocation Modal */}
        <AnimatePresence>
          {driverModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-200 bg-opacity-70 flex justify-center items-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full"
              >
                <h2 className="text-xl font-semibold text-blue-600 mb-4">
                  {driverModal.driverName ? "Edit Driver" : "Allocate Driver"}
                </h2>
                <input
                  type="text"
                  placeholder="Search driver..."
                  value={driverSearch}
                  onChange={(e) => setDriverSearch(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg mb-4"
                />
                <ul className="max-h-60 overflow-y-auto divide-y">
                  {filteredDrivers.map((d) => (
                    <li
                      key={d.id}
                      className="flex justify-between items-center p-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <span className="text-gray-700 font-medium">{d.name}</span>
                      <button
                        onClick={() =>
                          handleStatusUpdate(driverModal._id, "Confirmed", d.name)
                        }
                        className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600"
                      >
                        Allocate
                      </button>
                    </li>
                  ))}
                  {filteredDrivers.length === 0 && (
                    <li className="p-2 text-gray-500 text-sm">No drivers found</li>
                  )}
                </ul>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setDriverModal(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View Details Modal */}
        <AnimatePresence>
          {selectedCustomer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-200 bg-opacity-70 flex justify-center items-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full border border-blue-100"
              >
                <h2 className="text-2xl font-bold text-blue-600 mb-4 border-b pb-2">
                  Customer Details
                </h2>

                {(() => {
                  const [firstName, ...lastArr] =
                    selectedCustomer.customerName.split(" ");
                  const lastName = lastArr.join(" ");
                  return (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <p className="flex items-center text-gray-700 bg-blue-50 p-2 rounded-lg">
                          <User className="w-4 h-4 mr-2 text-blue-500" />
                          <span>First Name: {firstName}</span>
                        </p>
                        <p className="flex items-center text-gray-700 bg-blue-50 p-2 rounded-lg">
                          <User className="w-4 h-4 mr-2 text-blue-500" />
                          <span>Last Name: {lastName || "—"}</span>
                        </p>
                      </div>
                      <p className="flex items-center text-gray-700 bg-blue-50 p-2 rounded-lg">
                        <Mail className="w-4 h-4 mr-2 text-blue-500" />
                        <span>Email: {selectedCustomer.email}</span>
                      </p>
                      <p className="flex items-center text-gray-700 bg-blue-50 p-2 rounded-lg">
                        <Cake className="w-4 h-4 mr-2 text-blue-500" />
                        <span>DOB: {selectedCustomer.dob || "N/A"}</span>
                      </p>
                    </div>
                  );
                })()}

                <h3 className="mt-6 text-lg font-semibold text-blue-600 border-b pb-2">
                  Trip Details
                </h3>
                <div className="mt-3 space-y-2">
                  <p className="text-gray-700">
                    <MapPin className="w-4 h-4 inline text-blue-500 mr-1" />
                    {selectedCustomer.pickup} → {selectedCustomer.drop}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedCustomer.tripType} (
                    {selectedCustomer.rideType || "Exclusive"})
                  </p>
                  {selectedCustomer.rideType === "Shared" && (
                    <div className="bg-blue-50 p-4 rounded-xl mt-2 border border-blue-100">
                      <p className="flex items-center text-gray-700">
                        <Users className="w-4 h-4 mr-2 text-blue-500" />
                        Passengers: {selectedCustomer.passengers}
                      </p>
                      <p className="flex items-center text-gray-700">
                        <IndianRupee className="w-4 h-4 mr-2 text-blue-500" />
                        Per Seat: {formatRupee(selectedCustomer.fare)}
                      </p>
                      <p className="flex items-center font-bold text-green-600">
                        Total:{" "}
                        {formatRupee(
                          selectedCustomer.fare * selectedCustomer.passengers
                        )}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BookingsPage;