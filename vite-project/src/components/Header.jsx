
// components/common/Header.js
import React, { useState, useRef, useEffect } from 'react';
import { FiMenu, FiBell, FiSearch, FiUser, FiSettings, FiLogOut, FiMessageSquare, FiHelpCircle, FiX, FiMail } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Profile from '../pages/Profile';


import { Navigate, useNavigate } from 'react-router-dom';

const Header = ({ setSidebarOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const {currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Refs for outside click detection
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'invoice',
      title: 'New Invoice Paid',
      message: 'Invoice #INV-001 has been paid by Raj Sharma',
      time: '5 min ago',
      read: false,
      icon: '💰'
    },
    {
      id: 2,
      type: 'customer',
      title: 'New Customer Added',
      message: 'Amit Kumar has been added to your customers',
      time: '1 hour ago',
      read: false,
      icon: '👤'
    },
    {
      id: 3,
      type: 'system',
      title: 'Weekly Report Ready',
      message: 'Your weekly sales report is now available',
      time: '2 hours ago',
      read: true,
      icon: '📊'
    },
    {
      id: 4,
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of ₹15,000 received for INV-002',
      time: '1 day ago',
      read: true,
      icon: '💳'
    }
  ];

  // Mock search results
  const searchResults = [
    { type: 'customer', name: 'Raj Sharma', email: 'raj@example.com', id: '1', icon: '👤' },
    { type: 'invoice', name: 'INV-001', amount: '₹5,000', id: '2', icon: '📄' },
    { type: 'product', name: 'Web Development Package', price: '₹25,000', id: '3', icon: '📦' },
    { type: 'customer', name: 'Raj Enterprises', email: 'info@rajent.com', id: '4', icon: '👤' },
    { type: 'invoice', name: 'INV-002', amount: '₹15,000', id: '5', icon: '📄' }
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setShowSearchResults(e.target.value.length > 0);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSearchResultClick = (result) => {
    setSearchQuery('');
    setShowSearchResults(false);
    
    switch (result.type) {
      case 'customer':
        navigate(`/customers/${result.id}`);
        break;
      case 'invoice':
        navigate(`/invoices/${result.id}`);
        break;
      case 'product':
        navigate(`/products/${result.id}`);
        break;
      default:
        break;
    }
  };

  const markNotificationAsRead = (notificationId) => {
    // In real app, you'd make an API call here
    console.log('Marking notification as read:', notificationId);
  };

  const clearAllNotifications = () => {
    // In real app, you'd make an API call here
    console.log('Clearing all notifications');
    setShowNotifications(false);
  };

  const unreadNotifications = notifications.filter(notification => !notification.read).length;

  const getUserInitials =  () => {
      //const response=  await authAPI.getCurrentUser()
     // console.log(response.data)
    if (currentUser.name) {
      return currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return 'U';
  };
  //open setting page
  const SettingPage=()=>{
    navigate('/settings')
  }

  //open help page
  const HelpPage=()=>{
    navigate('/help')
  }
  //open profile 
  const ProfilePage=()=>{
    navigate('/profile')
  }
  const filteredResults = searchResults.filter(result =>
    result.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (result.email && result.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95 shadow-sm">
      <div className="flex items-center justify-between p-4 md:p-6">
        {/* Left Section - Menu Button */}
        <div className="flex items-center flex-1">
          <button 
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200 mr-2"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu className="h-6 w-6" />
          </button>
          
          {/* Search Bar */}
          <div className="relative flex-1 max-w-xl ml-2 md:ml-0" ref={searchRef}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search customers, invoices, products..."
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearchResults(false);
                  }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-xl transition-colors duration-200"
                >
                  <FiX className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
                {filteredResults.length > 0 ? (
                  <>
                    <div className="p-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-700">
                        Search Results ({filteredResults.length})
                      </p>
                    </div>
                    {filteredResults.map((result, index) => (
                      <div
                        key={`${result.type}-${result.id}`}
                        className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                          index !== filteredResults.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                        onClick={() => handleSearchResultClick(result)}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{result.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {result.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {result.email || result.amount || result.price}
                            </p>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                            {result.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="p-4 text-center">
                    <FiSearch className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No results found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Right Section - Notifications & Profile */}
        <div className="flex items-center space-x-3 md:space-x-4">
          {/* Notifications Bell */}
          <div className="relative" ref={notificationsRef}>
            <button 
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FiBell className="h-6 w-6" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                  <button
                    onClick={clearAllNotifications}
                    className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Mark all as read
                  </button>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification, index) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                        index !== notifications.length - 1 ? 'border-b border-gray-100' : ''
                      } ${!notification.read ? 'bg-blue-50' : ''}`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className="flex space-x-3">
                        <span className="text-xl">{notification.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 border-t border-gray-200">
                  <button className="w-full text-center text-sm text-blue-600 hover:text-blue-500 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button 
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg">
                {getUserInitials()}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{currentUser.name || 'User'}</p>
                <p className="text-xs text-gray-500">{currentUser.email || 'user@example.com'}</p>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                      {getUserInitials()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {currentUser.name || 'User'}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {currentUser.email || 'user@example.com'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors duration-150">
                    <FiUser className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium" onClick={ProfilePage}>My Profile</span>
                  </button>
                  
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors duration-150">
                    <FiSettings className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium" onClick={SettingPage}>Settings</span>
                  </button>
                  
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors duration-150">
                    <FiHelpCircle className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium" onClick={HelpPage}>Help & Support</span>
                  </button>
                </div>

                <div className="p-2 border-t border-gray-200">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors duration-150"
                  >
                    <FiLogOut className="h-5 w-5" />
                    <span className="text-sm font-medium">Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;