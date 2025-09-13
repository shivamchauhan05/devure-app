// components/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, FiPieChart, FiShoppingCart, FiDollarSign, 
  FiUsers, FiPackage, FiFileText, FiSettings, 
  FiX, FiTrendingUp, FiCreditCard, FiBox 
} from 'react-icons/fi';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: FiHome },
    { name: 'Sales', href: '/sales', icon: FiTrendingUp },
    { name: 'Inventory', href: '/inventory', icon: FiPackage },
    { name: 'Customers', href: '/customers', icon: FiUsers },
    { name: 'Invoices', href: '/invoices', icon: FiFileText },
    { name: 'Expenses', href: '/expenses', icon: FiDollarSign },
    { name: 'Reports', href: '/reports', icon: FiPieChart },
    { name: 'Settings', href: '/settings', icon: FiSettings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-800 bg-opacity-50 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={`fixed md:relative z-30 w-64 bg-blue-800 text-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out h-full`}>
        <div className="p-4 flex items-center justify-between border-b border-blue-700">
          <div className="flex items-center space-x-2">
            <FiDollarSign className="h-8 w-8" />
            <h1 className="text-xl font-bold"> Devure-App</h1>
          </div>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <FiX className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center space-x-2 p-3 rounded-lg ${location.pathname === item.href ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;