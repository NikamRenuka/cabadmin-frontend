// types/index.js

// Example shape references (not enforced like TS, but useful for documentation)

// Booking object example
export const bookingExample = {
  id: "1",
  customerName: "John Doe",
  phone: "9876543210",
  pickup: "Delhi",
  drop: "Agra",
  tripType: "One Way", // 'One Way' | 'Round Trip' | 'Multi City'
  vehicleType: "Dzire", // 'Dzire' | 'Ertiga' | 'Innova' | 'Tempo'
  fare: 1500,
  status: "Pending", // 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled'
  bookingTime: "2025-09-16 10:00",
  driverName: "Rajesh",
  driverPhone: "9123456789",
};

// Earnings data example
export const earningsExample = {
  today: 1200,
  week: 8000,
  month: 32000,
  totalBookings: 150,
  completedTrips: 120,
  pendingBookings: 5,
};

// Rate config example
export const rateConfigExample = {
  perSeatRate: 0,
  perKmRates: {
    dzire: 11,
    ertiga: 14,
    innova: 17,
    tempo: 20,
  },
  fixedCabRates: {
    dzire: 3500,
    ertiga: 4500,
    innova: 5500,
    tempo: 6500,
  },
  driverAllowance: 150,
};

// Pages enum replacement
export const PAGES = ["bookings", "earnings", "rates", "notifications", "payments"];
