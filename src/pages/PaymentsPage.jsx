// PaymentsPage.jsx

import React, { useMemo } from "react";

const PaymentsPage = ({ searchQuery = "" }) => {
  const payments = [
    { id: 1, customer: "Priya Sharma", amount: 4500, date: "2025-09-15" },
    { id: 2, customer: "Amit Patel", amount: 5500, date: "2025-09-14" },
  ];

  const filtered = useMemo(() => {
    const q = (searchQuery || "").toLowerCase();
    if (!q) return payments;
    return payments.filter(
      (p) =>
        String(p.id).includes(q) ||
        p.customer.toLowerCase().includes(q) ||
        p.date.toLowerCase().includes(q)
    );
  }, [searchQuery, payments]);

  return (
    <div className="p-4 md:p-6">
      {/* Table container */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-blue-50">
            <tr>
              <th className="text-left px-4 md:px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="text-left px-4 md:px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Customer
              </th>
              <th className="text-left px-4 md:px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Amount
              </th>
              <th className="text-left px-4 md:px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((payment, index) => (
              <tr
                key={payment.id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50 transition-colors`}
              >
                <td className="px-4 md:px-6 py-4 text-sm text-gray-800 font-medium">
                  {payment.id}
                </td>
                <td className="px-4 md:px-6 py-4 text-sm text-gray-700">
                  {payment.customer}
                </td>
                <td className="px-4 md:px-6 py-4 text-sm font-bold text-green-600">
                  ₹{payment.amount.toLocaleString("en-IN")}
                </td>
                <td className="px-4 md:px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {payment.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
