import React, { useState, useEffect } from 'react';
import axios from 'axios';
import inventoryAPI from '../services/api';
import { useAuth } from '../context/AuthContext';


const AddProduct = ({ onProductAdded, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    cost: '',
    stock: 0,
    min_stock: 10
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const {create} = useAuth();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Calculate profit margin
  const calculateProfit = () => {
    const costPrice = parseFloat(formData.cost) || 0;
    const sellingPrice = parseFloat(formData.price) || 0;
    
    if (costPrice > 0 && sellingPrice > 0) {
      const profit = sellingPrice - costPrice;
      const margin = ((profit / costPrice) * 100).toFixed(2);
      return { profit, margin };
    }
    return { profit: 0, margin: 0 };
  };

  // Check if stock is low
  const isLowStock = () => {
    const currentStock = parseFloat(formData.stock) || 0;
    const minStock = parseFloat(formData.min_stock) || 10;
    return currentStock <= minStock;
  };

  const { profit, margin } = calculateProfit();
  const lowStockAlert = isLowStock();

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.price || parseFloat(formData.price) < 0) 
      newErrors.price = 'Valid price is required';
    if (formData.stock && parseFloat(formData.stock) < 0)
      newErrors.stock = 'Stock cannot be negative';
    if (formData.min_stock && parseFloat(formData.min_stock) < 0)
      newErrors.min_stock = 'Minimum stock cannot be negative';
    if (formData.cost && parseFloat(formData.cost) < 0)
      newErrors.cost = 'Cost cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Prepare data according to your schema
      const productData = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        price: parseFloat(formData.price),
        cost: formData.cost ? parseFloat(formData.cost) : undefined,
        stock: parseInt(formData.stock) || 0,
        min_stock: parseInt(formData.min_stock) || 10
      };

      // Remove undefined values
      Object.keys(productData).forEach(key => {
        if (productData[key] === undefined || productData[key] === '') {
          delete productData[key];
        }
      });

      // Replace with your actual API endpoint
      console.log(productData)
      const response = create(productData);
      
      // Call success callback if provided
      if (onProductAdded) {
         console.log(onProductAdded)
        onProductAdded(response.data);
      }
      
      // Reset form
      setFormData({
        name: '',
        category: '',
        price: '',
        cost: '',
        stock: 0,
        min_stock: 10
      });
      
      alert('Product added successfully!');
      
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Sample categories (you can fetch these from your backend)
  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports', 'Beauty', 'Automotive', 'Other'];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
        <p className="text-gray-600">Add a new product to your inventory</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {/* Basic Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Product Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Product Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter product name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Category */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>

            {/* Cost */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Cost Price (₹)
              </label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.cost ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.cost && <p className="text-red-500 text-xs mt-1">{errors.cost}</p>}
            </div>
          </div>
        </div>

        {/* Stock Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Stock Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Current Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Current Stock
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.stock ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
            </div>

            {/* Minimum Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Minimum Stock Alert
              </label>
              <input
                type="number"
                name="min_stock"
                value={formData.min_stock}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.min_stock ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="10"
              />
              {errors.min_stock && <p className="text-red-500 text-xs mt-1">{errors.min_stock}</p>}
            </div>

            {/* Stock Status Indicator */}
            <div className="md:col-span-2">
              <div className={`p-3 rounded-lg ${
                lowStockAlert ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
              }`}>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    lowStockAlert ? 'bg-red-500' : 'bg-green-500'
                  }`}></div>
                  <span className={`text-sm font-medium ${
                    lowStockAlert ? 'text-red-700' : 'text-green-700'
                  }`}>
                    {lowStockAlert ? 'Low Stock Alert!' : 'Stock Level OK'}
                  </span>
                </div>
                <p className={`text-xs mt-1 ${
                  lowStockAlert ? 'text-red-600' : 'text-green-600'
                }`}>
                  Current stock: {formData.stock} | Minimum required: {formData.min_stock}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profit Calculation */}
        {formData.cost && formData.price && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Profit Calculation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600">Cost Price</div>
                <div className="text-lg font-bold text-blue-700">
                  ₹{parseFloat(formData.cost || 0).toFixed(2)}
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600">Selling Price</div>
                <div className="text-lg font-bold text-green-700">
                  ₹{parseFloat(formData.price || 0).toFixed(2)}
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600">Profit Margin</div>
                <div className="text-lg font-bold text-purple-700">
                  ₹{profit.toFixed(2)} ({margin}%)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => setFormData({
              name: '',
              category: '',
              price: '',
              cost: '',
              stock: 0,
              min_stock: 10
            })}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Reset
          </button>
          
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
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;