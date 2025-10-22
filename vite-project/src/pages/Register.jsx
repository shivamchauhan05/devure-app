
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiBriefcase, FiTrendingUp, FiCheck } from 'react-icons/fi';

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    business_name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate passwords match
    if (userData.password !== userData.confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }
    
    const result = await register(userData);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    const password = userData.password;
    if (!password) return { strength: 0, text: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][strength];
    const strengthColor = ['red', 'orange', 'yellow', 'blue', 'green'][strength];
    
    return { strength: (strength / 4) * 100, text: strengthText, color: strengthColor };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Left Side - Registration Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md lg:max-w-lg">
          {/* Logo and Brand */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-green-600 to-blue-700 p-3 rounded-xl shadow-lg">
                <FiTrendingUp className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-700 bg-clip-text text-transparent">
                  Devure
                </h1>
                <p className="text-sm text-gray-500">Start Your Business Journey</p>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Join thousands of businesses using Devure
            </p>
          </div>

          {/* Registration Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white p-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2">
                  <FiUser className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50"
                    placeholder="Enter your full name"
                    value={userData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Business Name Field */}
              <div>
                <label htmlFor="business_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiBriefcase className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="business_name"
                    name="business_name"
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50"
                    placeholder="Your business name (optional)"
                    value={userData.business_name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50"
                    placeholder="Enter your email address"
                    value={userData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50"
                    placeholder="Create a strong password"
                    value={userData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-xl transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {userData.password && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Password strength</span>
                      <span className={`font-medium text-${passwordStrength.color}-600`}>
                        {passwordStrength.text}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-${passwordStrength.color}-500 transition-all duration-300`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50"
                    placeholder="Confirm your password"
                    value={userData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
                {userData.confirmPassword && userData.password !== userData.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
                )}
                {userData.confirmPassword && userData.password === userData.confirmPassword && (
                  <p className="mt-1 text-xs text-green-600 flex items-center">
                    <FiCheck className="h-3 w-3 mr-1" />
                    Passwords match
                  </p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Password requirements:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className={`flex items-center ${userData.password.length >= 8 ? 'text-green-600' : ''}`}>
                    <FiCheck className={`h-3 w-3 mr-2 ${userData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`} />
                    At least 8 characters
                  </li>
                  <li className={`flex items-center ${/[A-Z]/.test(userData.password) ? 'text-green-600' : ''}`}>
                    <FiCheck className={`h-3 w-3 mr-2 ${/[A-Z]/.test(userData.password) ? 'text-green-600' : 'text-gray-400'}`} />
                    One uppercase letter
                  </li>
                  <li className={`flex items-center ${/[0-9]/.test(userData.password) ? 'text-green-600' : ''}`}>
                    <FiCheck className={`h-3 w-3 mr-2 ${/[0-9]/.test(userData.password) ? 'text-green-600' : 'text-gray-400'}`} />
                    One number
                  </li>
                  <li className={`flex items-center ${/[^A-Za-z0-9]/.test(userData.password) ? 'text-green-600' : ''}`}>
                    <FiCheck className={`h-3 w-3 mr-2 ${/[^A-Za-z0-9]/.test(userData.password) ? 'text-green-600' : 'text-gray-400'}`} />
                    One special character
                  </li>
                </ul>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-green-600 hover:text-green-500 font-medium">
                    Terms and Conditions
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-blue-700 hover:from-green-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    'Create Devure Account'
                  )}
                </button>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="font-medium text-green-600 hover:text-green-500 transition-colors duration-200"
                  >
                    Sign in to Devure
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Section */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-green-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-6">
              Grow Your Business with <span className="text-green-200">Devure</span>
            </h1>
            <p className="text-lg text-green-100 mb-8 leading-relaxed">
              Join thousands of successful businesses that use Devure to manage their operations, track growth, and achieve their goals.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">✓</span>
                </div>
                <span className="text-green-100">Free 14-day trial</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">✓</span>
                </div>
                <span className="text-green-100">No credit card required</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">✓</span>
                </div>
                <span className="text-green-100">Setup in 5 minutes</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">✓</span>
                </div>
                <span className="text-green-100">24/7 customer support</span>
              </div>
            </div>

            {/* Testimonial */}
            <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <p className="text-green-100 italic mb-4">
                "Devure helped us streamline our invoicing and customer management. Our efficiency increased by 40% in the first month!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">RS</span>
                </div>
                <div className="ml-3">
                  <p className="text-white font-medium">Raj Sharma</p>
                  <p className="text-green-200 text-sm">Small Business Owner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full -translate-y-36 translate-x-36"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-48 -translate-x-48"></div>
        </div>
      </div>
    </div>
  );
};

export default Register;