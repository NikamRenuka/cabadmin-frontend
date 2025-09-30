// mockData.js

export const mockBookings = [
  {
    id: 'BK001',
    customerId: 'CUST-001',
    customerName: 'Rajesh Kumar',
    phone: '+91 9876543210',
    email: '', // not provided
    dob: '',
    pickup: 'Pune',
    drop: 'Sambhaji Nagar',
    tripType: 'One Way',
    vehicleType: 'Dzire',
    fare: 3500,          // total for exclusive
    status: 'Pending',
    bookingTime: '2025-01-13 10:30 AM',
    passengers: 1,
    rideType: 'Exclusive'
  },
  {
    id: 'BK002',
    customerId: 'CUST-002',
    customerName: 'Priya Sharma',
    phone: '+91 9123456789',
    email: 'priya.sharma@example.com',
    dob: '1992-08-22',
    pickup: 'Sambhaji Nagar',
    drop: 'Pune',
    tripType: 'Round Trip',
    vehicleType: 'Ertiga',
    fare: 4500,          // total (could be fixed)
    status: 'Confirmed',
    bookingTime: '2025-01-13 09:15 AM',
    driverName: 'Suresh Singh',
    driverPhone: '+91 9988776655',
    passengers: 2,
    rideType: 'Shared',
    perSeatFare: 2300    // per-seat price set (so total = 4600)
  },
  {
    id: 'BK003',
    customerId: 'CUST-003',
    customerName: 'Amit Patel',
    phone: '+91 8765432109',
    email: 'amit.patel@example.com',
    dob: '1988-11-10',
    pickup: 'Sambhaji Nagar',
    drop: 'Pune',
    tripType: 'One Way',
    vehicleType: 'Innova',
    fare: 5500,
    status: 'In Progress',
    bookingTime: '2025-01-13 08:00 AM',
    driverName: 'Ravi Kumar',
    driverPhone: '+91 9876543221',
    passengers: 3,
    rideType: 'Shared',
    // perSeatFare not provided -> code will split fare among passengers
  },
  {
    id: 'BK004',
    customerId: 'CUST-004',
    customerName: 'Sneha Reddy',
    phone: '+91 7654321098',
    email: 'sneha.reddy@example.com',
    dob: '1995-02-05',
    pickup: 'Sambhaji Nagar',
    drop: 'Pune',
    tripType: 'One Way',
    vehicleType: 'Dzire',
    fare: 3500,
    status: 'Completed',
    bookingTime: '2025-01-13 07:30 AM',
    driverName: 'Mohan Das',
    driverPhone: '+91 9123457890',
    passengers: 1,
    rideType: 'Exclusive'
  },
  {
    id: 'BK005',
    customerId: 'CUST-005',
    customerName: 'Vikram Joshi',
    phone: '+91 6543210987',
    email: 'vikram.joshi@example.com',
    dob: '1987-07-18',
    pickup: 'Pune',
    drop: 'Sambhaji Nagar',
    tripType: 'Multi City',
    vehicleType: 'Tempo',
    fare: 4500,
    status: 'Pending',
    bookingTime: '2025-01-13 11:45 AM',
    passengers: 2,
    rideType: 'Shared',
    perSeatFare: 2200
  }
];

export const mockEarnings = {
  today: 12500,
  week: 89000,
  month: 350000,
  totalBookings: 156,
  completedTrips: 134,
  pendingBookings: 8
};

export const initialRates = {
  perSeatRate: 900,
  perKmRates: {
    dzire: 12,
    ertiga: 15,
    innova: 18,
    tempo: 22
  },
  fixedCabRates: {
    dzire: 1000,
    ertiga: 1500,
    innova: 2000,
    tempo: 2500
  },
  driverAllowance: 150
};
