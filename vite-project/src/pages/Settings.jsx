// pages/Settings.js
import React, { useState, useEffect } from 'react';
import { FiSave, FiUser, FiDollarSign, FiBell, FiShield, FiDatabase, FiHelpCircle, FiCreditCard,FiFileText } from 'react-icons/fi';
import { settingsAPI } from '../services/api.jsx';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    // Profile Settings
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    
    // Business Settings
    currency: 'INR',
    fiscalYear: 'April-March',
    taxId: '',
    invoicePrefix: 'INV',
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    lowStockAlerts: true,
    paymentReminders: true,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    
    // Payment Settings
    paymentMethods: {
      cash: true,
      upi: true,
      bankTransfer: true,
      card: false
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'business', label: 'Business', icon: FiDollarSign },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'security', label: 'Security', icon: FiShield },
    { id: 'payments', label: 'Payments', icon: FiCreditCard },
    { id: 'backup', label: 'Backup', icon: FiDatabase },
    { id: 'help', label: 'Help', icon: FiHelpCircle }
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsAPI.get();
      
      if (response.data) {
        setFormData(prev => ({
          ...prev,
          businessName: response.data.business_name || '',
          ownerName: response.data.owner_name || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          address: response.data.address || '',
          currency: response.data.currency || 'INR',
          fiscalYear: response.data.fiscal_year || 'April-March',
          taxId: response.data.tax_id || '',
          invoicePrefix: response.data.invoice_prefix || 'INV',
          emailNotifications: response.data.email_notifications !== false,
          smsNotifications: response.data.sms_notifications || false,
          lowStockAlerts: response.data.low_stock_alerts !== false,
          paymentReminders: response.data.payment_reminders !== false,
          twoFactorAuth: response.data.two_factor_auth || false,
          sessionTimeout: response.data.session_timeout || 30,
          paymentMethods: response.data.payment_methods || {
            cash: true,
            upi: true,
            bankTransfer: true,
            card: false
          }
        }));
      }
    } catch (err) {
      setError('Failed to load settings');
      console.error('Settings fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setFormData(prev => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [method]: !prev.paymentMethods[method]
      }
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      await settingsAPI.update(formData);
      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save settings');
      console.error('Save settings error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading settings...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          Settings saved successfully!
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow">
            <nav className="p-4">
              <ul className="space-y-1">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <li key={tab.id}>
                      <button
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left ${activeTab === tab.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{tab.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          <div className="bg-white rounded-lg shadow p-6">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Business Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
                    <input
                      type="text"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Business Settings */}
            {activeTab === 'business' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Business Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="INR">Indian Rupee (₹)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                      <option value="GBP">British Pound (£)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fiscal Year</label>
                    <select
                      name="fiscalYear"
                      value={formData.fiscalYear}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="January-December">January-December</option>
                      <option value="April-March">April-March</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID (GSTIN)</label>
                    <input
                      type="text"
                      name="taxId"
                      value={formData.taxId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Prefix</label>
                    <input
                      type="text"
                      name="invoicePrefix"
                      value={formData.invoicePrefix}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-md font-medium text-gray-800">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Receive important updates via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        checked={formData.emailNotifications}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-md font-medium text-gray-800">SMS Notifications</h3>
                      <p className="text-sm text-gray-500">Receive important updates via SMS</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="smsNotifications"
                        checked={formData.smsNotifications}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-md font-medium text-gray-800">Low Stock Alerts</h3>
                      <p className="text-sm text-gray-500">Get notified when inventory is low</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="lowStockAlerts"
                        checked={formData.lowStockAlerts}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-md font-medium text-gray-800">Payment Reminders</h3>
                      <p className="text-sm text-gray-500">Get reminders for pending payments</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="paymentReminders"
                        checked={formData.paymentReminders}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-md font-medium text-gray-800">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="twoFactorAuth"
                        checked={formData.twoFactorAuth}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                    <select
                      name="sessionTimeout"
                      value={formData.sessionTimeout}
                      onChange={handleInputChange}
                      className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>60 minutes</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-gray-800 mb-2">Change Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="password"
                        placeholder="Current Password"
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="password"
                        placeholder="New Password"
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Settings */}
            {activeTab === 'payments' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-800 mb-4">Accepted Payment Methods</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`border rounded-lg p-4 cursor-pointer ${formData.paymentMethods.cash ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                           onClick={() => handlePaymentMethodChange('cash')}>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.paymentMethods.cash}
                            onChange={() => {}}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm font-medium text-gray-700">Cash</span>
                        </div>
                      </div>
                      <div className={`border rounded-lg p-4 cursor-pointer ${formData.paymentMethods.upi ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                           onClick={() => handlePaymentMethodChange('upi')}>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.paymentMethods.upi}
                            onChange={() => {}}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm font-medium text-gray-700">UPI</span>
                        </div>
                      </div>
                      <div className={`border rounded-lg p-4 cursor-pointer ${formData.paymentMethods.bankTransfer ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                           onClick={() => handlePaymentMethodChange('bankTransfer')}>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.paymentMethods.bankTransfer}
                            onChange={() => {}}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm font-medium text-gray-700">Bank Transfer</span>
                        </div>
                      </div>
                      <div className={`border rounded-lg p-4 cursor-pointer ${formData.paymentMethods.card ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                           onClick={() => handlePaymentMethodChange('card')}>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.paymentMethods.card}
                            onChange={() => {}}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm font-medium text-gray-700">Credit/Debit Card</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-gray-800 mb-2">Payment Terms</h3>
                    <select className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Due on receipt</option>
                      <option>Net 7 (due in 7 days)</option>
                      <option>Net 15 (due in 15 days)</option>
                      <option>Net 30 (due in 30 days)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Backup Settings */}
            {activeTab === 'backup' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Data Backup & Export</h2>
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-md font-medium text-blue-800 mb-2">Automatic Backups</h3>
                    <p className="text-sm text-blue-600 mb-4">Your data is automatically backed up daily. Last backup: Today at 2:30 AM</p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                      Backup Now
                    </button>
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-gray-800 mb-4">Export Data</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <FiDatabase className="h-8 w-8 text-gray-600 mb-2" />
                        <span className="text-sm font-medium">Export All Data</span>
                        <span className="text-xs text-gray-500">CSV format</span>
                      </button>
                      <button className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <FiFileText className="h-8 w-8 text-gray-600 mb-2" />
                        <span className="text-sm font-medium">Export Invoices</span>
                        <span className="text-xs text-gray-500">PDF format</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Help Settings */}
            {activeTab === 'help' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Help & Support</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-800 mb-4">Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <a href="#" className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <FiHelpCircle className="h-6 w-6 text-gray-600 mr-3" />
                        <span className="text-sm font-medium">Help Center</span>
                      </a>
                      <a href="#" className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <FiFileText className="h-6 w-6 text-gray-600 mr-3" />
                        <span className="text-sm font-medium">User Manual</span>
                      </a>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-gray-800 mb-2">Contact Support</h3>
                    <p className="text-sm text-gray-600 mb-4">Get help from our support team</p>
                    <div className="flex flex-col md:flex-row gap-4">
                      <a href="mailto:support@vyapar.com" className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 text-sm">
                        Email Support
                      </a>
                      <a href="tel:+18005551234" className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 text-sm">
                        Call Support
                      </a>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-gray-800 mb-2">App Version</h3>
                    <p className="text-sm text-gray-600">Vyapar App v2.4.1</p>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                <FiSave className="mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;