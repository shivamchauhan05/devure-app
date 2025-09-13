// components/TopProducts.js
import React from 'react';

const TopProducts = () => {
  const products = [
    { name: 'Smartphone X', sales: 45, revenue: 225000 },
    { name: 'Laptop Pro', sales: 32, revenue: 192000 },
    { name: 'Wireless Earbuds', sales: 67, revenue: 134000 },
    { name:' Smartwatch Series 5', sales: 28, revenue: 112000 },
    { name: 'Tablet Mini', sales: 38, revenue: 114000 }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Top Selling Products</h2>
      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={index} className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{product.name}</p>
              <p className="text-sm text-gray-500">{product.sales} units sold</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">₹{product.revenue.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Revenue</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProducts;