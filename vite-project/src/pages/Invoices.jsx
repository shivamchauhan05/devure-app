// pages/Invoices.js
import React, { useState, useEffect } from 'react';
import { FiPlus, FiFilter, FiDownload, FiPrinter, FiSearch, FiEye, FiEdit, FiTrash2, FiFileText, FiDollarSign, FiX, FiSave } from 'react-icons/fi';
import { invoicesAPI } from '../services/api';
import { Navigate, useNavigate } from 'react-router-dom';

const Invoices = () => {
  const navigate = useNavigate();
  
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [editFormData, setEditFormData] = useState({
    customer_name: '',
    date: '',
    due_date: '',
    total_amount: '',
    status: 'pending'
  });

  const [stats, setStats] = useState({
    totalInvoices: 0,
    paid: 0,
    pending: 0,
    overdue: 0,
    totalAmount: 0
  });

  const filters = [
    { id: 'all', label: 'All Invoices' },
    { id: 'paid', label: 'Paid' },
    { id: 'pending', label: 'Pending' },
    { id: 'overdue', label: 'Overdue' }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' }
  ];

  useEffect(() => {
    fetchInvoices();
    fetchInvoiceStats();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await invoicesAPI.getAll();
      setInvoices(response.data.invoices || response.data);
    } catch (err) {
      setError('Failed to load invoices');
      console.error('Invoices fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoiceStats = async () => {
    try {
      const response = await invoicesAPI.getStats();
      setStats({
        totalInvoices: response.data.totalInvoices || 0,
        paid: response.data.paidInvoices || 0,
        pending: response.data.pendingInvoices || 0,
        overdue: response.data.overdueInvoices || 0,
        totalAmount: response.data.totalRevenue || 0
      });
    } catch (err) {
      console.error('Failed to load invoice stats:', err);
    }
  };

  const handleDeleteInvoice = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await invoicesAPI.delete(id);
        setInvoices(invoices.filter(invoice => invoice._id !== id));
        fetchInvoiceStats(); // Refresh stats
      } catch (err) {
        setError('Failed to delete invoice');
        console.error('Delete invoice error:', err);
      }
    }
  };

  // View Invoice Functions
  const handleViewInvoice = (invoice) => {
    setViewingInvoice(invoice);
  };

  const handleCloseView = () => {
    setViewingInvoice(null);
  };

  // Edit Invoice Functions
  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice._id);
    setEditFormData({
      customer_name: invoice.customer?.name || invoice.customer_name || '',
      date: invoice.date ? new Date(invoice.date).toISOString().split('T')[0] : '',
      due_date: invoice.due_date ? new Date(invoice.due_date).toISOString().split('T')[0] : '',
      total_amount: invoice.total_amount || '',
      status: invoice.status || 'pending'
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'total_amount' ? parseFloat(value) || 0 : value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await invoicesAPI.update(editingInvoice, editFormData);
      setInvoices(invoices.map(invoice => 
        invoice._id === editingInvoice ? { ...response.data, _id: editingInvoice } : invoice
      ));
      setEditingInvoice(null);
      setEditFormData({
        customer_name: '',
        date: '',
        due_date: '',
        total_amount: '',
        status: 'pending'
      });
      fetchInvoiceStats(); // Refresh stats after edit
    } catch (err) {
      setError('Failed to update invoice');
      console.error('Update invoice error:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditingInvoice(null);
    setEditFormData({
      customer_name: '',
      date: '',
      due_date: '',
      total_amount: '',
      status: 'pending'
    });
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await invoicesAPI.updateStatus(id, status);
      setInvoices(invoices.map(invoice => 
        invoice._id === id ? {...invoice, status} : invoice
      ));
      fetchInvoiceStats(); // Refresh stats after status update
    } catch (err) {
      setError('Failed to update invoice status');
      console.error('Update invoice status error:', err);
    }
  };

  const statusClass = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    // Filter by status
    if (activeFilter === 'paid' && invoice.status !== 'paid') return false;
    if (activeFilter === 'pending' && invoice.status !== 'pending') return false;
    if (activeFilter === 'overdue' && invoice.status !== 'overdue') return false;
    
    // Filter by search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const customerName = invoice.customer?.name?.toLowerCase() || invoice.customer_name?.toLowerCase() || '';
      const invoiceNumber = invoice.invoice_number?.toLowerCase() || '';
      
      if (!customerName.includes(searchLower) && !invoiceNumber.includes(searchLower)) {
        return false;
      }
    }
    
    return true;
  });

  const handleInvoice = () => {
    navigate('/AddInvoice');
  };

  if (loading) return <div className="p-6">Loading invoices...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Invoice Management</h1>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
            <FiDownload className="mr-2" />
            Export
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
            <FiPrinter className="mr-2" />
            Print
          </button>
          <button 
            className="flex items-center px-4 py-2 bg-primary border border-transparent rounded-md text-white hover:bg-secondary bg-blue-600"
            onClick={() => handleInvoice()}
          >
            <FiPlus className="mr-2" />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalInvoices}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FiFileText className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-500">All invoices</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paid Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{stats.paid}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FiFileText className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-500">Fully paid</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <FiFileText className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-500">Awaiting payment</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.totalAmount.toLocaleString()}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FiDollarSign className="h-6 w-6 text-purple-500" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-500">All invoices value</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex space-x-2 mb-4 md:mb-0">
              {filters.map(filter => (
                <button
                  key={filter.id}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${activeFilter === filter.id ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search invoices..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice._id}>
                  {/* Invoice ID - Always visible */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invoice.invoice_number}
                  </td>
                  
                  {editingInvoice === invoice._id ? (
                    // Edit Form Row
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          name="customer_name"
                          value={editFormData.customer_name}
                          onChange={handleEditFormChange}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                          required
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="date"
                          name="date"
                          value={editFormData.date}
                          onChange={handleEditFormChange}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                          required
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="date"
                          name="due_date"
                          value={editFormData.due_date}
                          onChange={handleEditFormChange}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          name="total_amount"
                          min="0"
                          step="0.01"
                          value={editFormData.total_amount}
                          onChange={handleEditFormChange}
                          className="w-24 px-2 py-1 border border-gray-300 rounded-md text-sm"
                          required
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          name="status"
                          value={editFormData.status}
                          onChange={handleEditFormChange}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                        >
                          {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={handleEditSubmit}
                          className="text-green-600 hover:text-green-900 mr-3 bg-green-100 px-3 py-1 rounded"
                        >
                          <FiSave className="inline mr-1" /> Save
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          className="text-gray-600 hover:text-gray-900 bg-gray-100 px-3 py-1 rounded"
                        >
                          <FiX className="inline mr-1" /> Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    // Normal Display Row
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.customer?.name || invoice.customer_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(invoice.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{invoice.total_amount?.toLocaleString() || '0'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          className="text-blue-600 hover:text-blue-900 mr-3 bg-blue-100 px-3 py-1 rounded"
                          onClick={() => handleViewInvoice(invoice)}
                        >
                          <FiEye className="inline mr-1" /> View
                        </button>
                        <button 
                          className="text-green-600 hover:text-green-900 mr-3 bg-green-100 px-3 py-1 rounded"
                          onClick={() => handleEditInvoice(invoice)}
                        >
                          <FiEdit className="inline mr-1" /> Edit
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900 bg-red-100 px-3 py-1 rounded"
                          onClick={() => handleDeleteInvoice(invoice._id)}
                        >
                          <FiTrash2 className="inline mr-1" /> Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of{' '}
                <span className="font-medium">{filteredInvoices.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">1</a>
                <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">2</a>
                <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">3</a>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>
                <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">8</a>
                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* View Invoice Modal */}
      {viewingInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Invoice Details</h2>
              <button 
                onClick={handleCloseView}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-700">Invoice Number</h3>
                  <p className="text-gray-900">{viewingInvoice.invoice_number}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Status</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClass(viewingInvoice.status)}`}>
                    {viewingInvoice.status}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Customer</h3>
                  <p className="text-gray-900">{viewingInvoice.customer?.name || viewingInvoice.customer_name}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Date</h3>
                  <p className="text-gray-900">{new Date(viewingInvoice.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Due Date</h3>
                  <p className="text-gray-900">
                    {viewingInvoice.due_date ? new Date(viewingInvoice.due_date).toLocaleDateString() : '-'}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Total Amount</h3>
                  <p className="text-gray-900 font-bold">₹{viewingInvoice.total_amount?.toLocaleString() || '0'}</p>
                </div>
              </div>

              {/* Invoice Items */}
              {viewingInvoice.items && viewingInvoice.items.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-3">Items</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Item</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Quantity</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Price</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Total</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {viewingInvoice.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
                            <td className="px-4 py-2 text-sm text-gray-500">{item.quantity}</td>
                            <td className="px-4 py-2 text-sm text-gray-500">₹{item.price}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">₹{(item.quantity * item.price).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleCloseView}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleEditInvoice(viewingInvoice);
                    handleCloseView();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Edit Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;