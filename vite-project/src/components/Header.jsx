// components/Header.js
import React from 'react';
import { FiMenu, FiBell, FiSearch } from 'react-icons/fi';

const Header = ({ setSidebarOpen }) => {
  return (
    <header className="bg-white shadow">
      <div className="flex items-center justify-between p-4 md:p-6">
        <button 
          className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          onClick={() => setSidebarOpen(true)}
        >
          <FiMenu className="h-6 w-6" />
        </button>
        
        <div className="relative flex-1 max-w-xl mx-4 md:mx-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for customers, invoices, products..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <FiBell className="h-6 w-6" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              RS
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;