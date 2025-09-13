// pages/CustomerPage.js (updated)
import React, { useState, useEffect } from 'react';
import { customersAPI } from '../services/api';

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await customersAPI.getAll();
     // console.log("API Response:", response.data);
      setCustomers(response.data.customers);
    } catch (err) {
      setError('Failed to load customers');
      console.error('Customers fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customersAPI.delete(id);
        setCustomers(customers.filter(customer => customer.id !== id));
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
      {/* Customer page content with real data */}
      {/* Table rows will use customers state */}
      {customers.map((customer) => (
        <tr key={customer.id}>
          {/* Render customer data */}
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                {customer.name.charAt(0)}
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                <div className="text-sm text-gray-500">{customer.id}</div>
              </div>
            </div>
          </td>
          {/* Other customer fields */}
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button 
              className="text-primary hover:text-secondary mr-3"
              onClick={() => handleEditCustomer(customer)}
            >
              <FiEdit className="inline mr-1" /> Edit
            </button>
            <button 
              className="text-red-600 hover:text-red-900"
              onClick={() => handleDeleteCustomer(customer.id)}
            >
              <FiTrash2 className="inline mr-1" /> Delete
            </button>
          </td>
        </tr>
      ))}
    </div>
  );
};

export default CustomerPage;