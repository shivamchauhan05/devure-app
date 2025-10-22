import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { customersAPI } from '../services/api';
import { invoicesAPI } from '../services/api';

const AddInvoice = ({ onInvoiceAdded, onCancel }) => {
  const [formData, setFormData] = useState({
    customer: '',
    invoice_number: '',
    date: new Date().toISOString().split('T')[0],
    due_date: '',
    items: [],
    status: 'draft',
    total_amount: 0
  });

  const [newItem, setNewItem] = useState({
    description: '',
    quantity: 1,
    price: 0,
    total: 0
  });

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [fetchingCustomers, setFetchingCustomers] = useState(true);

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers();
    generateInvoiceNumber();
  }, []);

  const fetchCustomers = async () => {
    try {
      setFetchingCustomers(true);
      // Replace with your actual API endpoint
      const response = await customersAPI.getAll()
      
      // Handle different API response structures
      let customersData = [];
      
      if (Array.isArray(response.data)) {
        customersData = response.data;
      } else if (response.data && Array.isArray(response.data.customers)) {
        customersData = response.data.customers;
      } else if (response.data && Array.isArray(response.data.data)) {
        customersData = response.data.data;
      } else {
        console.error('Unexpected API response structure:', response.data);
        customersData = [];
      }
      
      setCustomers(customersData);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]); // Ensure it's always an array
    } finally {
      setFetchingCustomers(false);
    }
  };

  const generateInvoiceNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(100 + Math.random() * 900);
    const invoiceNumber = `INV-${timestamp}-${random}`;
    setFormData(prev => ({ ...prev, invoice_number: invoiceNumber }));
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle item input changes
  const handleItemChange = (e) => {
    const { name, value } = e.target;
    const updatedItem = {
      ...newItem,
      [name]: name === 'quantity' || name === 'price' ? parseFloat(value) || 0 : value
    };

    // Calculate item total
    updatedItem.total = updatedItem.quantity * updatedItem.price;
    
    setNewItem(updatedItem);
  };

  // Add item to invoice
  const addItem = () => {
    if (!newItem.description || newItem.quantity <= 0 || newItem.price < 0) {
      setErrors({ items: 'Please fill all item fields with valid values' });
      return;
    }

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { ...newItem, id: Date.now() }]
    }));

    // Reset new item form
    setNewItem({
      description: '',
      quantity: 1,
      price: 0,
      total: 0
    });

    setErrors(prev => ({ ...prev, items: '' }));
  };

  // Remove item from invoice
  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  // Calculate total amount whenever items change
  useEffect(() => {
    const total = formData.items.reduce((sum, item) => sum + item.total, 0);
    setFormData(prev => ({ ...prev, total_amount: total }));
  }, [formData.items]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.customer) newErrors.customer = 'Customer is required';
    if (!formData.invoice_number) newErrors.invoice_number = 'Invoice number is required';
    if (formData.items.length === 0) newErrors.items = 'At least one item is required';
    if (!formData.date) newErrors.date = 'Invoice date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Prepare data for API (remove temporary id from items)
      const invoiceData = {
        ...formData,
        items: formData.items.map(({ id, ...item }) => item)
      };

      // Replace with your actual API endpoint
      const response = invoicesAPI.create(invoiceData);

      if (onInvoiceAdded) {
        onInvoiceAdded(response.data);
      }

      // Reset form
      setFormData({
        customer: '',
        invoice_number: '',
        date: new Date().toISOString().split('T')[0],
        due_date: '',
        items: [],
        status: 'draft',
        total_amount: 0
      });

      generateInvoiceNumber();
      alert('Invoice created successfully!');

    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-800">Create New Invoice</h2>
        <p className="text-gray-600">Create and manage customer invoices</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {/* Invoice Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Invoice Number *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="invoice_number"
                value={formData.invoice_number}
                onChange={handleChange}
                className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.invoice_number ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Invoice number"
              />
              <button
                type="button"
                onClick={generateInvoiceNumber}
                className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
              >
                Generate
              </button>
            </div>
            {errors.invoice_number && <p className="text-red-500 text-xs mt-1">{errors.invoice_number}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Invoice Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Due Date
            </label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Customer *
            </label>
            <select
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.customer ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={fetchingCustomers}
            >
              <option value="">Select Customer</option>
              {fetchingCustomers ? (
                <option value="" disabled>Loading customers...</option>
              ) : (
                Array.isArray(customers) && customers.map(customer => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name} {customer.email ? `(${customer.email})` : ''}
                  </option>
                ))
              )}
            </select>
            {errors.customer && <p className="text-red-500 text-xs mt-1">{errors.customer}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>

        {/* Items Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Invoice Items</h3>
          
          {/* Add Item Form */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="md:col-span-5">
              <label className="block text-sm font-medium text-gray-600 mb-1">Description *</label>
              <input
                type="text"
                name="description"
                value={newItem.description}
                onChange={handleItemChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Item description"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={newItem.quantity}
                onChange={handleItemChange}
                min="1"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={newItem.price}
                onChange={handleItemChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">Total (₹)</label>
              <input
                type="number"
                value={newItem.total.toFixed(2)}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>

            <div className="md:col-span-1 flex items-end">
              <button
                type="button"
                onClick={addItem}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Add
              </button>
            </div>
          </div>

          {errors.items && <p className="text-red-500 text-xs mb-4">{errors.items}</p>}

          {/* Items List */}
          {formData.items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Quantity</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Price</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Total</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.quantity}</td>
                      <td className="border border-gray-300 px-4 py-2">₹{item.price.toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-2">₹{item.total.toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No items added yet. Add items to create the invoice.
            </div>
          )}
        </div>

        {/* Summary Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Invoice Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600">Total Items</div>
              <div className="text-2xl font-bold text-blue-700">{formData.items.length}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600">Subtotal</div>
              <div className="text-2xl font-bold text-green-700">₹{formData.total_amount.toFixed(2)}</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-purple-600">Total Amount</div>
              <div className="text-2xl font-bold text-purple-700">₹{formData.total_amount.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || formData.items.length === 0}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddInvoice;