// pages/Welcome.js
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiTrendingUp, 
  FiUsers, 
  FiFileText, 
  FiPackage, 
  FiDollarSign,
  FiBarChart2,
  FiSettings,
  FiArrowRight,
  FiCheckCircle,
  FiPlay,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Welcome = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: FiFileText,
      title: 'Easy Invoicing',
      description: 'Create professional invoices in seconds and send to clients',
      color: 'blue'
    },
    {
      icon: FiUsers,
      title: 'Customer Management',
      description: 'Manage all your customers and their information in one place',
      color: 'green'
    },
    {
      icon: FiPackage,
      title: 'Product Catalog',
      description: 'Organize your products and services with inventory tracking',
      color: 'purple'
    },
    {
      icon: FiDollarSign,
      title: 'Expense Tracking',
      description: 'Track business expenses and manage your finances',
      color: 'orange'
    },
    {
      icon: FiBarChart2,
      title: 'Sales Reports',
      description: 'Get insights into your business with detailed analytics',
      color: 'indigo'
    },
    {
      icon: FiSettings,
      title: 'Customizable',
      description: 'Customize the app according to your business needs',
      color: 'pink'
    }
  ];

  const quickActions = [
    {
      title: 'Create Invoice',
      description: 'Start by creating an invoice',
      icon: FiFileText,
      link: '/addinvoice',
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Add Customers',
      description: 'Import or add customers',
      icon: FiUsers,
      link: '/addCustomer',
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Setup Products',
      description: 'Add products to catalog',
      icon: FiPackage,
      link: '/addProduct',
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
      indigo: 'bg-indigo-100 text-indigo-600',
      pink: 'bg-pink-100 text-pink-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Mobile Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 lg:hidden">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-2 rounded-lg">
                <FiTrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Devure</h1>
                <p className="text-xs text-gray-500">Business Suite</p>
              </div>
            </div>
            <Link 
              to="/dashboard"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
            >
              <span>Dashboard</span>
              <FiArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-2 rounded-lg">
                <FiTrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Devure</h1>
                <p className="text-sm text-gray-500">Business Management Suite</p>
              </div>
            </div>
            <Link 
              to="/dashboard"
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              <span>Go to Dashboard</span>
              <FiArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="text-center mb-8 lg:mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-medium mb-4 lg:mb-6">
            <FiCheckCircle className="h-3 w-3 lg:h-4 lg:w-4" />
            <span>Welcome to Devure</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-6xl font-bold text-gray-900 mb-4 lg:mb-6">
            Welcome to <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">Devure</span>
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-6 lg:mb-8 px-4">
            Hello <span className="font-semibold text-blue-600">{user?.name || 'there'}</span>! 
            We're excited to help you manage your business more efficiently.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center items-center px-4">
            <Link 
              to="/dashboard"
              className="inline-flex items-center space-x-2 px-6 py-3 lg:px-8 lg:py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-semibold text-sm lg:text-base shadow-lg w-full sm:w-auto justify-center"
            >
              <FiPlay className="h-4 w-4 lg:h-5 lg:w-5" />
              <span>Start Using Devure</span>
            </Link>
            
            <button className="inline-flex items-center space-x-2 px-6 py-3 lg:px-8 lg:py-4 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold text-sm lg:text-base w-full sm:w-auto justify-center">
              <span>Watch Tutorial</span>
            </button>
          </div>
        </div>

        {/* Quick Start Section */}
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-8 mb-8 lg:mb-12 mx-2 lg:mx-0">
          <div className="text-center mb-6 lg:mb-8">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Get Started in 3 Steps</h2>
            <p className="text-gray-600 text-sm lg:text-base">Quick setup to get your business running</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.link}
                  className="group p-4 lg:p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-center"
                >
                  <div className={`inline-flex p-2 lg:p-3 rounded-lg ${action.color} mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="h-4 w-4 lg:h-6 lg:w-6 text-white" />
                  </div>
                  <h3 className={`font-semibold text-base lg:text-lg mb-1 lg:mb-2 ${action.textColor}`}>
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-xs lg:text-sm leading-relaxed">
                    {action.description}
                  </p>
                  <div className="mt-3 lg:mt-4 inline-flex items-center space-x-1 text-blue-600 font-medium text-xs lg:text-sm">
                    <span>Get Started</span>
                    <FiArrowRight className="h-3 w-3 lg:h-4 lg:w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-8 lg:mb-16 px-2 lg:px-0">
          <div className="text-center mb-6 lg:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 lg:mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-600 text-sm lg:text-lg max-w-2xl mx-auto px-4">
              All the tools you need to streamline your business operations and focus on growth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="group p-4 lg:p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300"
                >
                  <div className={`inline-flex p-2 lg:p-3 rounded-lg ${getColorClasses(feature.color)} mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="h-4 w-4 lg:h-6 lg:w-6" />
                  </div>
                  <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2 lg:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl lg:rounded-2xl p-6 lg:p-8 text-white mx-2 lg:mx-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 text-center">
            <div>
              <div className="text-xl lg:text-3xl font-bold mb-1 lg:mb-2">5000+</div>
              <div className="text-blue-200 text-xs lg:text-sm">Businesses</div>
            </div>
            <div>
              <div className="text-xl lg:text-3xl font-bold mb-1 lg:mb-2">1M+</div>
              <div className="text-blue-200 text-xs lg:text-sm">Invoices</div>
            </div>
            <div>
              <div className="text-xl lg:text-3xl font-bold mb-1 lg:mb-2">99.9%</div>
              <div className="text-blue-200 text-xs lg:text-sm">Uptime</div>
            </div>
            <div>
              <div className="text-xl lg:text-3xl font-bold mb-1 lg:mb-2">24/7</div>
              <div className="text-blue-200 text-xs lg:text-sm">Support</div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-8 lg:mt-16 px-2 lg:px-0">
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8 max-w-2xl mx-auto">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 lg:mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-gray-600 text-sm lg:text-base mb-4 lg:mb-6">
              Join thousands of businesses using Devure.
            </p>
            <Link 
              to="/dashboard"
              className="inline-flex items-center space-x-2 px-6 py-3 lg:px-8 lg:py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-semibold text-sm lg:text-base shadow-lg w-full sm:w-auto justify-center"
            >
              <FiTrendingUp className="h-4 w-4 lg:h-5 lg:w-5" />
              <span>Launch Dashboard</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden p-4">
        <div className="flex justify-center">
          <Link 
            to="/dashboard"
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-semibold text-sm"
          >
            <FiTrendingUp className="h-4 w-4" />
            <span>Open Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;