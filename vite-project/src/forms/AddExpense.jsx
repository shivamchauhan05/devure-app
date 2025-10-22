// pages/AddExpense.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiDollarSign, FiFileText, FiCalendar, FiCreditCard, FiSave, FiArrowLeft, FiTag } from 'react-icons/fi';
import { expensesAPI } from '../services/api';

const AddExpense = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    category: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    payment_method: 'cash'
  });

  const categories = [
    'Inventory',
    'Salaries',
    'Rent',
    'Utilities',
    'Marketing',
    'Travel',
    'Office Supplies',
    'Maintenance',
    'Taxes',
    'Other'
  ];

  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'upi', label: 'UPI' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'card', label: 'Card' }
  ];

  useEffect(() => {
    // Reset messages when form data changes
    setError('');
    setSuccess('');
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.category.trim()) {
      setError('Please select a category');
      setLoading(false);
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      setLoading(false);
      return;
    }

    if (!formData.date) {
      setError('Please select a date');
      setLoading(false);
      return;
    }

    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date)
      };

      await expensesAPI.create(expenseData);
      
      setSuccess('Expense added successfully!');
      
      // Reset form
      setFormData({
        category: '',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        payment_method: 'cash'
      });

      // Redirect to expenses list after 2 seconds
      setTimeout(() => {
        navigate('/expenses');
      }, 2000);

    } catch (err) {
      console.error('Error adding expense:', err);
      setError(err.response?.data?.error || 'Failed to add expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleGoBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft className="mr-2" />
            Back
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Expense</h1>
              <p className="text-gray-600 mt-2">Record your business expenses</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <FiDollarSign className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <div className="flex items-center">
              <FiSave className="h-5 w-5 text-green-400 mr-2" />
              <p className="text-green-700">{success}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex items-center">
              <FiFileText className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Expense Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                <FiTag className="inline mr-2 h-4 w-4 text-gray-400" />
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                <FiFileText className="inline mr-2 h-4 w-4 text-gray-400" />
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Enter expense description (optional)"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Amount and Date - Inline on larger screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Amount */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  <FiDollarSign className="inline mr-2 h-4 w-4 text-gray-400" />
                  Amount *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    required
                    className="w-full border border-gray-300 rounded-md pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  <FiCalendar className="inline mr-2 h-4 w-4 text-gray-400" />
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 mb-2">
                <FiCreditCard className="inline mr-2 h-4 w-4 text-gray-400" />
                Payment Method *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {paymentMethods.map(method => (
                  <label
                    key={method.value}
                    className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                      formData.payment_method === method.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value={method.value}
                      checked={formData.payment_method === method.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {method.label}
                          </div>
                        </div>
                      </div>
                      {formData.payment_method === method.value && (
                        <div className="shrink-0 text-blue-600">
                          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#fff" opacity="0.2" />
                            <path
                              d="M7 13l3 3 7-7"
                              stroke="currentColor"
                              strokeWidth={1.5}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleGoBack}
                disabled={loading}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    Add Expense
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">💡 Quick Tips</h3>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>• Categorize expenses properly for better reporting</li>
            <li>• Add detailed descriptions for future reference</li>
            <li>• Record expenses immediately to avoid forgetting</li>
            <li>• Use consistent categories for accurate analytics</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;