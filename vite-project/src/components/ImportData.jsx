import React, { useState } from 'react';
import { FiUpload, FiDownload, FiFile, FiCheck, FiX, FiAlertTriangle } from 'react-icons/fi';
import { importAPI } from '../services/api';

const ImportData = () => {
  const [importing, setImporting] = useState(false);
  const [importType, setImportType] = useState('invoices');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if file is Excel
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      setError('Please upload an Excel file (.xlsx or .xls)');
      return;
    }

    try {
      setImporting(true);
      setError('');
      setMessage('');
      setResults(null);

      let response;
      switch (importType) {
        case 'invoices':
          response = await importAPI.importInvoices(file);
          break;
        case 'expenses':
          response = await importAPI.importExpenses(file);
          break;
        case 'products':
          response = await importAPI.importProducts(file);
          break;
        default:
          throw new Error('Invalid import type');
      }

      setMessage(response.data.message);
      setResults(response.data.details);

      // Reset file input
      event.target.value = '';

    } catch (err) {
      console.error('Import error:', err);
      setError(err.response?.data?.error || 'Failed to import file. Please try again.');
    } finally {
      setImporting(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await importAPI.downloadTemplate(importType);
      
      // Create blob and download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${importType}-template.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error('Download template error:', err);
      setError('Failed to download template');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Import Data from Excel</h2>
      
      {/* Import Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Data Type to Import
        </label>
        <select
          value={importType}
          onChange={(e) => setImportType(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="invoices">Invoices</option>
          <option value="expenses">Expenses</option>
          <option value="products">Products</option>
        </select>
      </div>

      {/* Template Download */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-blue-900">Download Template</h3>
            <p className="text-sm text-blue-700">
              Use our template to ensure proper formatting
            </p>
          </div>
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FiDownload className="mr-2" />
            Download Template
          </button>
        </div>
      </div>

      {/* File Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <FiFile className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <label htmlFor="file-upload" className="cursor-pointer">
            <span className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              <FiUpload className="mr-2" />
              {importing ? 'Importing...' : 'Select Excel File'}
            </span>
            <input 
              id="file-upload" 
              name="file-upload" 
              type="file" 
              className="sr-only" 
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              disabled={importing}
            />
          </label>
          <p className="text-xs text-gray-500 mt-2">
            Supports .xlsx, .xls files. Max 10MB
          </p>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Import Results</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-green-600">
              <FiCheck className="mr-2" />
              Successful: {results.success}
            </div>
            <div className="flex items-center text-red-600">
              <FiX className="mr-2" />
              Failed: {results.errors}
            </div>
          </div>
          
          {results.errorsList.length > 0 && (
            <div className="mt-3">
              <h4 className="font-medium text-red-700 mb-1">Errors:</h4>
              <ul className="text-sm text-red-600 space-y-1">
                {results.errorsList.slice(0, 5).map((error, index) => (
                  <li key={index} className="flex items-start">
                    <FiAlertTriangle className="mr-2 mt-0.5 flex-shrink-0" />
                    {error}
                  </li>
                ))}
                {results.errorsList.length > 5 && (
                  <li>... and {results.errorsList.length - 5} more errors</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Success Message */}
      {message && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center">
            <FiCheck className="h-5 w-5 text-green-400 mr-2" />
            <p className="text-green-700">{message}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center">
            <FiAlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-medium text-yellow-900 mb-2">Excel Format Instructions</h3>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• First row should contain column headers</li>
          <li>• Use the template for proper column names</li>
          <li>• Dates should be in YYYY-MM-DD format</li>
          <li>• Amounts should be numbers only (no currency symbols)</li>
          <li>• Required fields must be filled</li>
        </ul>
      </div>
    </div>
  );
};

export default ImportData;