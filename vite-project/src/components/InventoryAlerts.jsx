// components/InventoryAlerts.js
import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

const InventoryAlerts = () => {
  const alerts = [
    { product: 'Smartphone X', stock: 5, min: 10 },
    { product: 'Laptop Chargers', stock: 3, min: 5 },
    { product: 'Wireless Earbuds', stock: 7, min: 15 }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Inventory Alerts</h2>
      <div className="flow-root">
        <ul className="divide-y divide-gray-200">
          {alerts.map((alert, index) => (
            <li key={index} className="py-3">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <FiAlertTriangle className="h-6 w-6 text-yellow-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {alert.product}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    Current stock: {alert.stock} units
                  </p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-yellow-600">
                  Low stock
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <a href="/inventory" className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Manage Inventory
        </a>
      </div>
    </div>
  );
};

export default InventoryAlerts;