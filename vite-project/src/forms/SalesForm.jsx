// components/SalesForm.jsx
import React, { useState, useEffect } from 'react';

const SalesForm = () => {
  // State for form data
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    items: [],
    notes: ''
  });

  // State for new item
  const [newItem, setNewItem] = useState({
    productName: '',
    quantity: 1,
    price: 0,
    gstRate: 0
  });

  // Sample products data
  const [products] = useState([
    { id: 1, name: 'Laptop', price: 50000, stock: 10 },
    { id: 2, name: 'Mouse', price: 500, stock: 50 },
    { id: 3, name: 'Keyboard', price: 1500, stock: 30 },
    { id: 4, name: 'Monitor', price: 10000, stock: 15 },
    { id: 5, name: 'Headphones', price: 2000, stock: 25 }
  ]);

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const gstAmount = formData.items.reduce((sum, item) => sum + (item.quantity * item.price * item.gstRate / 100), 0);
    const total = subtotal + gstAmount;

    return { subtotal, gstAmount, total };
  };

  const { subtotal, gstAmount, total } = calculateTotals();

  // Add item to the sales list
  const addItem = () => {
    if (!newItem.productName || newItem.quantity <= 0 || newItem.price <= 0) {
      alert('Please fill all item details');
      return;
    }

    const itemTotal = newItem.quantity * newItem.price;
    const itemGst = itemTotal * newItem.gstRate / 100;

    const item = {
      id: Date.now(),
      ...newItem,
      total: itemTotal,
      gstAmount: itemGst
    };

    setFormData({
      ...formData,
      items: [...formData.items, item]
    });

    // Reset new item form
    setNewItem({
      productName: '',
      quantity: 1,
      price: 0,
      gstRate: 0
    });
  };

  // Remove item from list
  const removeItem = (id) => {
    setFormData({
      ...formData,
      items: formData.items.filter(item => item.id !== id)
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sales Data:', formData);
    alert('Sales added successfully!');
    
    // Reset form
    setFormData({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      invoiceNumber: `INV-${Date.now()}`,
      invoiceDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash',
      items: [],
      notes: ''
    });
  };

  // Auto-generate invoice number
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      invoiceNumber: `INV-${Date.now()}`
    }));
  }, []);

  // Auto-fill price when product is selected
  const handleProductSelect = (productName) => {
    const selectedProduct = products.find(p => p.name === productName);
    if (selectedProduct) {
      setNewItem({
        ...newItem,
        productName: selectedProduct.name,
        price: selectedProduct.price
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New Sale</h1>
          <p className="text-gray-600">Enter customer and product details</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
          {/* Customer Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
              Customer Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter customer name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  value={formData.invoiceNumber}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Invoice Date
                </label>
                <input
                  type="date"
                  value={formData.invoiceDate}
                  onChange={(e) => setFormData({...formData, invoiceDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Payment Method
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>
            </div>
          </div>

          {/* Add Items Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
              Add Products
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Product</label>
                <select
                  value={newItem.productName}
                  onChange={(e) => handleProductSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Product</option>
                  {products.map(product => (
                    <option key={product.id} value={product.name}>
                      {product.name} (₹{product.price})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 1})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Price (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newItem.price}
                  onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">GST Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="28"
                  step="0.01"
                  value={newItem.gstRate}
                  onChange={(e) => setNewItem({...newItem, gstRate: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={addItem}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200"
                >
                  Add Item
                </button>
              </div>
            </div>

            {/* Items List */}
            {formData.items.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Product</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Qty</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Price</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">GST %</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Total</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">{item.productName}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.quantity}</td>
                        <td className="border border-gray-300 px-4 py-2">₹{item.price.toFixed(2)}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.gstRate}%</td>
                        <td className="border border-gray-300 px-4 py-2">₹{item.total.toFixed(2)}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
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
            )}
          </div>

          {/* Summary Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
              Order Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600">Subtotal</div>
                <div className="text-2xl font-bold text-blue-700">₹{subtotal.toFixed(2)}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600">GST Amount</div>
                <div className="text-2xl font-bold text-green-700">₹{gstAmount.toFixed(2)}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600">Total Amount</div>
                <div className="text-2xl font-bold text-purple-700">₹{total.toFixed(2)}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Items</div>
                <div className="text-2xl font-bold text-gray-700">{formData.items.length}</div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any additional notes..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formData.items.length === 0}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              Create Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalesForm;