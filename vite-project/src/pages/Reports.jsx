// pages/Reports.js
import React, { useState, useEffect } from 'react';
import { FiDownload, FiPrinter, FiFilter, FiPieChart, FiBarChart, FiTrendingUp, FiShoppingCart,FiDollarSign,FiFileText,FiPackage,FiAlertTriangle } from 'react-icons/fi';
import { reportsAPI } from '../services/api';

const Reports = () => {
  const [activeReport, setActiveReport] = useState('sales');
  const [timeRange, setTimeRange] = useState('month');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reports = [
    { id: 'sales', label: 'Sales Report', icon: FiTrendingUp },
    { id: 'expenses', label: 'Expense Report', icon: FiBarChart },
    { id: 'profit', label: 'Profit & Loss', icon: FiPieChart },
    { id: 'inventory', label: 'Inventory Report', icon: FiBarChart }
  ];

  const timeRanges = [
    'Today', 'This Week', 'This Month', 'This Quarter', 'This Year', 'Custom'
  ];

  useEffect(() => {
    fetchReportData();
  }, [activeReport, timeRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      const params = { 
        startDate: getStartDateForRange(timeRange),
        endDate: new Date().toISOString().split('T')[0]
      };
      
      switch (activeReport) {
        case 'sales':
          response = await reportsAPI.getSalesReport(params);
          break;
        case 'expenses':
          response = await reportsAPI.getExpensesReport(params);
          break;
        case 'profit':
          response = await reportsAPI.getProfitLossReport(params);
          break;
        case 'inventory':
          response = await reportsAPI.getInventoryReport(params);
          break;
        default:
          response = await reportsAPI.getSalesReport(params);
      }
      
      setReportData(response.data);
    } catch (err) {
      setError('Failed to load report data');
      console.error('Report data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStartDateForRange = (range) => {
    const today = new Date();
    switch (range) {
      case 'Today':
        return today.toISOString().split('T')[0];
      case 'This Week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        return weekStart.toISOString().split('T')[0];
      case 'This Month':
        return new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      case 'This Quarter':
        const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
        return quarterStart.toISOString().split('T')[0];
      case 'This Year':
        return new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
      default:
        return new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()).toISOString().split('T')[0];
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) return <div className="p-6">Loading report...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Business Reports</h1>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
            <FiDownload className="mr-2" />
            Export
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
            <FiPrinter className="mr-2" />
            Print
          </button>
        </div>
      </div>

      {/* Report Selection */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex space-x-2 mb-4 md:mb-0">
              {reports.map(report => {
                const Icon = report.icon;
                return (
                  <button
                    key={report.id}
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${activeReport === report.id ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    onClick={() => setActiveReport(report.id)}
                  >
                    <Icon className="mr-2" />
                    {report.label}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center space-x-4">
              <select 
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                {timeRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
              <button className="flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200">
                <FiFilter className="mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="p-6">
          {activeReport === 'sales' && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Sales Report - {timeRange}</h2>
              
              {reportData ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Sales</p>
                          <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.total || 0)}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                          <FiTrendingUp className="h-6 w-6 text-blue-500" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Number of Orders</p>
                          <p className="text-2xl font-bold text-gray-900">{reportData.count || 0}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                          <FiShoppingCart className="h-6 w-6 text-green-500" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Average Order Value</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {reportData.total && reportData.count ? formatCurrency(reportData.total / reportData.count) : formatCurrency(0)}
                          </p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                          <FiDollarSign className="h-6 w-6 text-purple-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sales Chart Placeholder */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Sales Trend</h3>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Sales chart will be displayed here</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">No sales data available</p>
                </div>
              )}
            </div>
          )}

          {activeReport === 'expenses' && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Expense Report - {timeRange}</h2>
              {reportData ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                          <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.totalExpenses || 0)}</p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-full">
                          <FiDollarSign className="h-6 w-6 text-red-500" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Number of Expenses</p>
                          <p className="text-2xl font-bold text-gray-900">{reportData.expenseCount || 0}</p>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-full">
                          <FiFileText className="h-6 w-6 text-yellow-500" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Average Expense</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {reportData.totalExpenses && reportData.expenseCount ? 
                              formatCurrency(reportData.totalExpenses / reportData.expenseCount) : formatCurrency(0)}
                          </p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                          <FiDollarSign className="h-6 w-6 text-blue-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expense by Category */}
                  {reportData.byCategory && reportData.byCategory.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Expenses by Category</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {reportData.byCategory.map((category, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.category || 'Uncategorized'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(category.total)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.count}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">No expense data available</p>
                </div>
              )}
            </div>
          )}

          {activeReport === 'profit' && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Profit & Loss Statement - {timeRange}</h2>
              {reportData ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Revenue</p>
                          <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.revenue || 0)}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                          <FiTrendingUp className="h-6 w-6 text-green-500" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Expenses</p>
                          <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.expenses || 0)}</p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-full">
                          <FiDollarSign className="h-6 w-6 text-red-500" />
                        </div>
                      </div>
                    </div>
                    
                    <div className={`bg-white rounded-lg shadow p-6 ${(reportData.netProfit || 0) >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Net Profit</p>
                          <p className={`text-2xl font-bold ${(reportData.netProfit || 0) >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                            {formatCurrency(reportData.netProfit || 0)}
                          </p>
                        </div>
                        <div className={`p-3 rounded-full ${(reportData.netProfit || 0) >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                          <FiDollarSign className={`h-6 w-6 ${(reportData.netProfit || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                        </div>
                      </div>
                      {reportData.profitMargin !== undefined && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">
                            Profit Margin: {reportData.profitMargin.toFixed(2)}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Profit Chart Placeholder */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Profit Trend</h3>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Profit chart will be displayed here</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">No profit data available</p>
                </div>
              )}
            </div>
          )}

          {activeReport === 'inventory' && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Inventory Report - {timeRange}</h2>
              {reportData ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Products</p>
                          <p className="text-2xl font-bold text-gray-900">{reportData.totalProducts || 0}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                          <FiPackage className="h-6 w-6 text-blue-500" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Inventory Value</p>
                          <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.totalInventoryValue || 0)}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                          <FiDollarSign className="h-6 w-6 text-green-500" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                          <p className="text-2xl font-bold text-gray-900">{reportData.lowStockItems || 0}</p>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-full">
                          <FiAlertTriangle className="h-6 w-6 text-yellow-500" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                          <p className="text-2xl font-bold text-gray-900">{reportData.outOfStockItems || 0}</p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-full">
                          <FiPackage className="h-6 w-6 text-red-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Inventory by Category */}
                  {reportData.byCategory && reportData.byCategory.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Inventory by Category</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Low Stock</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {reportData.byCategory.map((category, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.category || 'Uncategorized'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(category.total)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.count}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.lowStockItems || 0}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">No inventory data available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;