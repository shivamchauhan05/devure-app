// components/LowStockAlert.js
import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

const LowStockAlert = () => {
  const lowStockItems = [
    { product: 'Wireless Earbuds', stock: 3, min: 10 },
    { product: 'Coffee Beans', stock: 5, min: 15 },
    { product: 'Desk Chair', stock: 2, min: 5 },
    { product: 'Water Bottle', stock: 4, min: 12 },
    { product: 'Backpack', stock: 1, min: 8 }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <FiAlertTriangle className="text-yellow-500 mr-2" />
        Low Stock Alerts
      </h2>
      <div className="space-y-3">
        {lowStockItems.map((item, index) => (
          <div key={index} className="p-3 bg-yellow-50 rounded-md border border-yellow-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.product}</p>
                <p className="text-xs text-gray-500">Current stock: {item.stock} units</p>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Min: {item.min}
              </span>
            </div>
            <div className="mt-2">
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-yellow-200">
                  <div
                    style={{ width: `${(item.stock / item.min) * 100}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-4 w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium">
        View all alerts
      </button>
    </div>
  );
};

export default LowStockAlert;