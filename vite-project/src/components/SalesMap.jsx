// components/SalesMap.js
import React from 'react';
import { FiMapPin } from 'react-icons/fi';

const SalesMap = () => {
  // Sample data for sales by region
  const regions = [
    { name: 'North India', sales: 45000, growth: 12.5, color: 'bg-blue-500' },
    { name: 'South India', sales: 52000, growth: 8.2, color: 'bg-green-500' },
    { name: 'East India', sales: 38000, growth: 15.7, color: 'bg-purple-500' },
    { name: 'West India', sales: 48000, growth: 5.4, color: 'bg-yellow-500' },
    { name: 'Central India', sales: 32000, growth: 9.8, color: 'bg-red-500' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Sales by Region</h2>
      
      {/* Simplified map visualization */}
      <div className="relative h-64 mb-6 bg-gray-100 rounded-lg overflow-hidden">
        <div className="absolute top-1/4 left-1/4">
          <div className="relative">
            <FiMapPin className="h-8 w-8 text-blue-500" />
            <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              ₹45K
            </div>
          </div>
          <span className="text-xs font-medium text-gray-700">North</span>
        </div>
        
        <div className="absolute top-1/2 right-1/4">
          <div className="relative">
            <FiMapPin className="h-8 w-8 text-green-500" />
            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              ₹52K
            </div>
          </div>
          <span className="text-xs font-medium text-gray-700">South</span>
        </div>
        
        <div className="absolute top-3/4 left-1/3">
          <div className="relative">
            <FiMapPin className="h-8 w-8 text-purple-500" />
            <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              ₹38K
            </div>
          </div>
          <span className="text-xs font-medium text-gray-700">East</span>
        </div>
        
        <div className="absolute top-1/3 right-1/3">
          <div className="relative">
            <FiMapPin className="h-8 w-8 text-yellow-500" />
            <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              ₹48K
            </div>
          </div>
          <span className="text-xs font-medium text-gray-700">West</span>
        </div>
        
        <div className="absolute top-1/2 left-1/2">
          <div className="relative">
            <FiMapPin className="h-8 w-8 text-red-500" />
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              ₹32K
            </div>
          </div>
          <span className="text-xs font-medium text-gray-700">Central</span>
        </div>
      </div>
      
      {/* Region details */}
      <div className="space-y-3">
        {regions.map((region, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${region.color} mr-2`}></div>
              <span className="text-sm font-medium text-gray-700">{region.name}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900">₹{region.sales.toLocaleString()}</div>
              <div className={`text-xs ${region.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {region.growth >= 0 ? '+' : ''}{region.growth}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesMap;