import React, { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave, FiEdit, FiCamera } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const Profile = () => {
  const { currentUser,updateUser } = useAuth();
  console.log(currentUser)
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    business_name: currentUser?.business_name || '', // ✅ Backend compatible name
    address: currentUser?.address || '',
    city: currentUser?.city || '',
    state: currentUser?.state || '',
    zip_code: currentUser?.zip_code || '' // ✅ Backend compatible name
  });

  const handleSave = async () => {
    setLoading(true);
    
    try {
      // ✅ Clean data banao - sirf necessary fields bhejo
      const cleanProfileData = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        business_name: profileData.business_name,
        address: profileData.address,
        city: profileData.city,
        state: profileData.state,
        zip_code: profileData.zip_code
      };

      console.log('Sending data:', cleanProfileData);
      
      const response = await authAPI.updateProfile(cleanProfileData);
      
      if (response.data) {
        alert('Profile updated successfully:', response.data);
        updateUser(response.data.user);
        setIsEditing(false);
        // ✅ Yahan aap success message show kar sakte hain
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const getUserInitials = () => {
    if (currentUser?.name) {
      return currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>
        <button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : isEditing ? (
            <FiSave className="h-4 w-4" />
          ) : (
            <FiEdit className="h-4 w-4" />
          )}
          <span>
            {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors duration-200"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                <input
                  type="text"
                  name="business_name"
                  value={profileData.business_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors duration-200"
                />
              </div>
            </div>
          </div>

          {/* Address Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors duration-200"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={profileData.city}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={profileData.state}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                <input
                  type="text"
                  name="zip_code"
                  value={profileData.zip_code}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-2xl mx-auto">
                {getUserInitials()}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600 transition-colors duration-200">
                  <FiCamera className="h-3 w-3" />
                </button>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{profileData.name}</h3>
            <p className="text-gray-600 text-sm">{profileData.business_name}</p>
            <p className="text-sm text-gray-500 mt-2">{profileData.email}</p>
          </div>

          {/* Account Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Member since</span>
                <span className="font-medium text-sm">Jan 2024</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Total Invoices</span>
                <span className="font-medium text-sm">45</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Active Customers</span>
                <span className="font-medium text-sm">28</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Account Type</span>
                <span className="font-medium text-sm text-blue-600">Pro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;