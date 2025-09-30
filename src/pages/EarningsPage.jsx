// pages/EarningsPage.jsx

import React from 'react';
import { TrendingUp, Calendar, Users, MapPin, IndianRupee, Clock } from 'lucide-react';
import { mockEarnings } from '../data/mockData';

const EarningsPage = () => {
  const earningsData = mockEarnings;

  const earningsCards = [
    {
      title: "Today's Earnings",
      amount: earningsData.today,
      change: '+12%',
      positive: true,
      icon: IndianRupee,
      gradient: 'from-green-500 to-green-600',
    },
    {
      title: 'Weekly Earnings',
      amount: earningsData.week,
      change: '+8%',
      positive: true,
      icon: Calendar,
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Monthly Earnings',
      amount: earningsData.month,
      change: '+15%',
      positive: true,
      icon: TrendingUp,
      gradient: 'from-purple-500 to-purple-600',
    },
  ];

  const statsCards = [
    {
      title: 'Total Bookings',
      value: earningsData.totalBookings,
      icon: Users,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      title: 'Completed Trips',
      value: earningsData.completedTrips,
      icon: MapPin,
      color: 'text-green-600 bg-green-100',
    },
    {
      title: 'Pending Bookings',
      value: earningsData.pendingBookings,
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-100',
    },
  ];

  return (
    <div className="p-4 md:p-6 w-full space-y-6">
      {/* Earnings Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {earningsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`bg-gradient-to-r ${card.gradient} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">{card.title}</p>
                  <p className="text-3xl font-bold">₹{card.amount.toLocaleString('en-IN')}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm">{card.change} from last period</span>
                  </div>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <Icon className="w-8 h-8" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Earnings Chart Area */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Earnings Overview</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Breakdown */}
          <div>
            <h4 className="text-lg font-medium text-gray-700 mb-4">This Week's Daily Earnings</h4>
            <div className="space-y-3">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
                (day) => {
                  const amount = Math.floor(Math.random() * 15000) + 5000;
                  const percentage = (amount / 20000) * 100;

                  return (
                    <div key={day} className="flex items-center space-x-3">
                      <div className="w-20 text-sm text-gray-600">{day}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="w-24 text-sm font-medium text-gray-800">
                        ₹{amount.toLocaleString('en-IN')}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Vehicle Type Performance */}
          <div>
            <h4 className="text-lg font-medium text-gray-700 mb-4">Earnings by Vehicle Type</h4>
            <div className="space-y-4">
              {[
                { name: 'Dzire', earnings: 85000, trips: 45, color: 'bg-blue-500' },
                { name: 'Ertiga', earnings: 120000, trips: 32, color: 'bg-green-500' },
                { name: 'Innova', earnings: 95000, trips: 28, color: 'bg-purple-500' },
                { name: 'Tempo', earnings: 50000, trips: 15, color: 'bg-yellow-500' },
              ].map((vehicle) => (
                <div key={vehicle.name} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${vehicle.color}`}></div>
                      <span className="font-medium text-gray-800">{vehicle.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">{vehicle.trips} trips</span>
                  </div>
                  <div className="text-xl font-bold text-gray-800">
                    ₹{vehicle.earnings.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Financial Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600">Gross Revenue</p>
            <p className="text-2xl font-bold text-green-600">
              ₹{(earningsData.month + 50000).toLocaleString('en-IN')}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600">Driver Commission</p>
            <p className="text-2xl font-bold text-orange-600">
              ₹{(earningsData.month * 0.3).toLocaleString('en-IN')}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600">Operating Costs</p>
            <p className="text-2xl font-bold text-red-600">
              ₹{(earningsData.month * 0.2).toLocaleString('en-IN')}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600">Net Profit</p>
            <p className="text-2xl font-bold text-blue-600">
              ₹{earningsData.month.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsPage;
