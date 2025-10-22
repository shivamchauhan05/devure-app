// pages/Customers.jsx
import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { customersAPI } from '../services/api';
import AddCustomer from '../forms/AddCustomer';

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await customersAPI.getAll();
      console.log(response)
      console.log("API Response:", response.data);
      
      let customersData = [];
      if (Array.isArray(response.data)) {
        customersData = response.data;
      } else if (response.data && Array.isArray(response.data.customers)) {
        customersData = response.data.customers;
      } else if (response.data && Array.isArray(response.data.data)) {
        customersData = response.data.data;
      }
      
      setCustomers(customersData);
    } catch (err) {
      setError('Failed to load customers');
      console.error('Customers fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = (newCustomer) => {
    setCustomers(prev => [newCustomer, ...prev]);
    setShowAddForm(false);
  };

  const handleEditCustomer = (customer) => {
    console.log('Edit customer:', customer);
  };

  const handleDeleteCustomer = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customersAPI.delete(id);
        setCustomers(customers.filter(customer => customer._id !== id));
      } catch (err) {
        setError('Failed to delete customer');
        console.error('Delete customer error:', err);
      }
    }
  };

  if (loading) return <div className="p-6">Loading customers...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
          <p className="text-gray-600">Manage your customers</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
        >
          <FiPlus className="mr-2" /> Add Customer
        </button>
      </div>

      {showAddForm ? (
        <AddCustomer 
          onCustomerAdded={handleAddCustomer}
          onCancel={() => setShowAddForm(false)}
        />
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <tr key={customer._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {customer.name?.charAt(0) || 'C'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {customer.name || 'No Name'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {customer.gst_number || 'No GST'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.email || 'No email'}</div>
                      <div className="text-sm text-gray-500">{customer.phone || 'No phone'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {customer.address ? `${customer.address}, ${customer.address}` : 'No address'}
                      </div>
                      <div className="text-sm text-gray-500">{205304}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => handleEditCustomer(customer)}
                      >
                        <FiEdit className="inline mr-1" /> Edit
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteCustomer(customer._id)}
                      >
                        <FiTrash2 className="inline mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    No customers found. <button 
                      onClick={() => setShowAddForm(true)}
                      className="text-blue-600 hover:underline"
                    >
                      Add your first customer
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerPage;