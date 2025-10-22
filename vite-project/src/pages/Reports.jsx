// pages/Reports.js
import React, { useState, useEffect } from 'react';
import { FiDownload, FiUpload, FiPrinter, FiFilter, FiPieChart, FiBarChart, FiTrendingUp, FiShoppingCart, FiDollarSign, FiFileText, FiPackage, FiAlertTriangle, FiCalendar, FiRefreshCw } from 'react-icons/fi';
import { reportsAPI } from '../services/api';
import ExportDropdown from '../components/ExportDropdown';
import { Link } from 'react-router-dom';

const Reports = () => {
  const [activeReport, setActiveReport] = useState('sales');
  const [timeRange, setTimeRange] = useState('This Month');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
   // ✅ COMPLETE FILTERS STATE
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    paymentMethod: ''
  });

  // ✅ FILTERS HANDLE KARNE KA FUNCTION (Agar chahiye toh)
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // ✅ FILTERS CLEAR KARNE KA FUNCTION
  const clearFilters = () => {
    setFilters({
      category: '',
      status: '',
      paymentMethod: ''
    });
  };

  const reports = [
    { id: 'sales', label: 'Sales Report', icon: FiTrendingUp },
    { id: 'expenses', label: 'Expense Report', icon: FiBarChart },
    { id: 'profit', label: 'Profit & Loss', icon: FiPieChart },
    { id: 'inventory', label: 'Inventory Report', icon: FiPackage }
  ];

  const timeRanges = [
    'Today', 'This Week', 'This Month', 'This Quarter', 'This Year'
  ];

  useEffect(() => {
    fetchReportData();
  }, [activeReport, timeRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = { 
        period: timeRange.toLowerCase().replace(' ', '_'),
        startDate: getStartDateForRange(timeRange),
        endDate: new Date().toISOString().split('T')[0]
      };
      
      let response;
      switch (activeReport) {
        case 'sales':
          response = await reportsAPI.getSalesReport(params);
          console.log(response)
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
      
      console.log(`${activeReport} API Response:`, response.data);
      
      // Transform API response to match our component structure
      const transformedData = transformReportData(response.data, activeReport);
      setReportData(transformedData);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to load report data. Please try again.');
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

  // Transform API data to match component expectations for ALL report types
  const transformReportData = (apiData, reportType) => {
    
    if (!apiData || (Array.isArray(apiData) && apiData.length === 0)) {
      return getEmptyReportData(reportType);
    }

    switch (reportType) {
      case 'sales':
        // Handle both array and object responses
        if (Array.isArray(apiData)) {
          const total = apiData.reduce((sum, item) => sum + (item.amount || item.total || 0), 0);
          const count = apiData.length;
          return {
            total,
            count,
            averageOrderValue: count > 0 ? total / count : 0,
            growth: 0,
            topProducts: apiData.slice(0, 5).map((item, index) => ({
              name: item.productName || item.name || `Product ${index + 1}`,
              quantity: item.quantity || item.soldQuantity || 1,
              revenue: item.amount || item.total || 0
            })),
            salesByCategory: groupByCategory(apiData)
          };
        } else {
          return {
            total: apiData.totalSales || apiData.total || apiData.revenue || 0,
            count: apiData.totalOrders || apiData.count || apiData.ordersCount || 0,
            averageOrderValue: apiData.averageOrderValue || (apiData.totalSales / apiData.totalOrders) || 0,
            growth: apiData.growth || apiData.percentageChange || 0,
            topProducts: apiData.topProducts || apiData.bestSellers || [],
            salesByCategory: apiData.salesByCategory || apiData.categoryWise || []
          };
        }

      case 'expenses':
        // Handle both array and object responses
        if (Array.isArray(apiData)) {
          const totalExpenses = apiData.reduce((sum, item) => sum + (item.amount || item.total || 0), 0);
          const expenseCount = apiData.length;
          return {
            totalExpenses,
            expenseCount,
            averageExpense: expenseCount > 0 ? totalExpenses / expenseCount : 0,
            byCategory: groupByCategory(apiData),
            recentExpenses: apiData.slice(0, 10).map(item => ({
              date: item.date || item.createdAt,
              description: item.description || item.note || 'Expense',
              category: item.category || 'Uncategorized',
              amount: item.amount || item.total || 0
            }))
          };
        } else {
          return {
            totalExpenses: apiData.totalExpenses || apiData.total || 0,
            expenseCount: apiData.totalExpensesCount || apiData.count || 0,
            averageExpense: apiData.averageExpense || (apiData.totalExpenses / apiData.totalExpensesCount) || 0,
            byCategory: apiData.expensesByCategory || apiData.categoryWise || [],
            recentExpenses: apiData.recentExpenses || apiData.latestExpenses || []
          };
        }

      case 'profit':
        // Handle both array and object responses
        if (Array.isArray(apiData)) {
          const revenue = apiData.reduce((sum, item) => sum + (item.revenue || item.income || 0), 0);
          const expenses = apiData.reduce((sum, item) => sum + (item.expenses || item.cost || 0), 0);
          const netProfit = revenue - expenses;
          const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
          
          return {
            revenue,
            expenses,
            netProfit,
            profitMargin,
            breakdown: {
              income: { 'Total Revenue': revenue },
              expenses: { 'Total Expenses': expenses }
            }
          };
        } else {
          return {
            revenue: apiData.revenue || apiData.totalRevenue || 0,
            expenses: apiData.expenses || apiData.totalExpenses || 0,
            netProfit: apiData.netProfit || (apiData.revenue - apiData.expenses) || 0,
            profitMargin: apiData.profitMargin || apiData.margin || 0,
            breakdown: apiData.breakdown || {
              income: apiData.income || {},
              expenses: apiData.expensesBreakdown || {}
            }
          };
        }

      case 'inventory':
        // Handle array response (like we saw in your example)
        if (Array.isArray(apiData)) {
          const totalProducts = apiData.reduce((sum, category) => sum + (category.totalItems || 0), 0);
          const totalInventoryValue = apiData.reduce((sum, category) => sum + (category.totalValue || 0), 0);
          const lowStockItems = apiData.reduce((sum, category) => sum + (category.lowStockItems || 0), 0);
          
          return {
            totalProducts,
            totalInventoryValue,
            lowStockItems,
            outOfStockItems: apiData.reduce((sum, category) => sum + (category.outOfStockItems || 0), 0),
            byCategory: apiData.map(category => ({
              category: category.id || category.category || category.name || 'Uncategorized',
              totalValue: category.totalValue || 0,
              count: category.totalItems || 0,
              lowStockItems: category.lowStockItems || 0,
              outOfStockItems: category.outOfStockItems || 0
            })),
            lowStockAlert: generateLowStockAlerts(apiData)
          };
        } else {
          return {
            totalProducts: apiData.totalProducts || apiData.totalItems || 0,
            totalInventoryValue: apiData.totalValue || apiData.inventoryValue || 0,
            lowStockItems: apiData.lowStockCount || apiData.lowStock || 0,
            outOfStockItems: apiData.outOfStockCount || apiData.outOfStock || 0,
            byCategory: apiData.inventoryByCategory || apiData.categoryWise || [],
            lowStockAlert: apiData.lowStockAlerts || apiData.alerts || []
          };
        }

      default:
        return apiData;
    }
  };

  // Helper function to group items by category
  const groupByCategory = (items) => {
    const categoryMap = {};
    
    items.forEach(item => {
      const category = item.category || 'Uncategorized';
      if (!categoryMap[category]) {
        categoryMap[category] = {
          category,
          total: 0,
          count: 0
        };
      }
      categoryMap[category].total += item.amount || item.total || 0;
      categoryMap[category].count += 1;
    });
    
    return Object.values(categoryMap);
  };

  // Helper function to generate low stock alerts from category data
  const generateLowStockAlerts = (categories) => {
    const alerts = [];
    
    categories.forEach(category => {
      if (category.lowStockItems > 0) {
        alerts.push({
          name: `${category.id || category.category} - Low Stock Items`,
          currentStock: category.lowStockItems,
          minimumStock: category.lowStockItems + 5 // Mock minimum stock
        });
      }
    });
    
    return alerts.slice(0, 5); // Return top 5 alerts
  };

  // Helper function to get empty state data for each report type
  const getEmptyReportData = (reportType) => {
    switch (reportType) {
      case 'sales':
        return {
          total: 0,
          count: 0,
          averageOrderValue: 0,
          growth: 0,
          topProducts: [],
          salesByCategory: []
        };
      case 'expenses':
        return {
          totalExpenses: 0,
          expenseCount: 0,
          averageExpense: 0,
          byCategory: [],
          recentExpenses: []
        };
      case 'profit':
        return {
          revenue: 0,
          expenses: 0,
          netProfit: 0,
          profitMargin: 0,
          breakdown: {
            income: {},
            expenses: {}
          }
        };
      case 'inventory':
        return {
          totalProducts: 0,
          totalInventoryValue: 0,
          lowStockItems: 0,
          outOfStockItems: 0,
          byCategory: [],
          lowStockAlert: []
        };
      default:
        return null;
    }
  };

  const handleExport = () => {
    if (!reportData) return;
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeReport}_report_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-IN').format(number || 0);
  };

  const renderSalesReport = () => (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Sales Report - {timeRange}</h2>
      
      {reportData ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sales</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.total)}</p>
                  {reportData.growth !== undefined && reportData.growth !== 0 && (
                    <p className={`text-xs mt-1 ${reportData.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {reportData.growth >= 0 ? '↑' : '↓'} {Math.abs(reportData.growth)}% from previous period
                    </p>
                  )}
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
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(reportData.count)}</p>
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
                    {formatCurrency(reportData.averageOrderValue)}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <FiDollarSign className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Top Products */}
          {reportData.topProducts && reportData.topProducts.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Top Selling Products</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity Sold</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reportData.topProducts.slice(0, 5).map((product, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {product.name || product.productName || `Product ${index + 1}`}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatNumber(product.quantity || product.soldQuantity || 0)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatCurrency(product.revenue || product.totalSales || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sales by Category */}
          {reportData.salesByCategory && reportData.salesByCategory.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Sales by Category</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {reportData.salesByCategory.slice(0, 4).map((category, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-600">
                      {category.category || category.name || 'Category'}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(category.total || category.amount || 0)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {category.count ? `${category.count} orders` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">No sales data available</p>
        </div>
      )}
    </div>
  );

  const renderExpensesReport = () => (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Expense Report - {timeRange}</h2>
      {reportData ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.totalExpenses)}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(reportData.expenseCount)}</p>
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
                    {formatCurrency(reportData.averageExpense)}
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
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Expenses by Category</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Count</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reportData.byCategory.map((category, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {category.category || category.name || 'Uncategorized'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatCurrency(category.total || category.amount || 0)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatNumber(category.count || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recent Expenses */}
          {reportData.recentExpenses && reportData.recentExpenses.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Expenses</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reportData.recentExpenses.slice(0, 5).map((expense, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {expense.date ? new Date(expense.date).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{expense.description}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{expense.category}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(expense.amount)}</td>
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
  );

  const renderProfitReport = () => (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Profit & Loss Statement - {timeRange}</h2>
      {reportData ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.revenue)}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.expenses)}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <FiDollarSign className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </div>
            
            <div className={`rounded-lg shadow p-6 ${
              reportData.netProfit >= 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Net Profit</p>
                  <p className={`text-2xl font-bold ${
                    reportData.netProfit >= 0 ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {formatCurrency(reportData.netProfit)}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${
                  reportData.netProfit >= 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <FiDollarSign className={`h-6 w-6 ${
                    reportData.netProfit >= 0 ? 'text-green-500' : 'text-red-500'
                  }`} />
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

          {/* Detailed Breakdown */}
          {reportData.breakdown && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Income</h4>
                  {Object.entries(reportData.breakdown.income || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b">
                      <span className="text-sm text-gray-600">{key}</span>
                      <span className="text-sm font-medium text-green-600">{formatCurrency(value)}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Expenses</h4>
                  {Object.entries(reportData.breakdown.expenses || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b">
                      <span className="text-sm text-gray-600">{key}</span>
                      <span className="text-sm font-medium text-red-600">{formatCurrency(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">No profit data available</p>
        </div>
      )}
    </div>
  );

  const renderInventoryReport = () => (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Inventory Report - {timeRange}</h2>
      {reportData ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(reportData.totalProducts)}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.totalInventoryValue)}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(reportData.lowStockItems)}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(reportData.outOfStockItems)}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <FiPackage className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Inventory by Category */}
          {reportData.byCategory && reportData.byCategory.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Inventory by Category</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Low Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Out of Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reportData.byCategory.map((category, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{category.category}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(category.totalValue)}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{formatNumber(category.count)}</td>
                        <td className="px-6 py-4 text-sm text-yellow-600">{formatNumber(category.lowStockItems)}</td>
                        <td className="px-6 py-4 text-sm text-red-600">{formatNumber(category.outOfStockItems)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Low Stock Alert */}
          {reportData.lowStockAlert && reportData.lowStockAlert.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Low Stock Alert</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Minimum Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reportData.lowStockAlert.slice(0, 5).map((product, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{formatNumber(product.currentStock)}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{formatNumber(product.minimumStock)}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.currentStock === 0 
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {product.currentStock === 0 ? 'Out of Stock' : 'Low Stock'}
                          </span>
                        </td>
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
  );

  if (loading) return (
    <div className="p-6 flex flex-col items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-gray-600">Loading report data...</p>
    </div>
  );

  if (error) return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex items-center">
          <FiAlertTriangle className="h-5 w-5 text-red-400 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
        <button 
          onClick={fetchReportData}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Business Reports</h1>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <button 
            onClick={fetchReportData}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
         <div className="flex items-center space-x-2 mt-4 md:mt-0">
  <ExportDropdown 
    activeReport={activeReport}
    timeRange={timeRange}
    filters={filters}
    getStartDateForRange={getStartDateForRange}
  />
  <div className="flex items-center space-x-2 mt-4 md:mt-0">
  <Link
    to="/import"
    className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
  >
    <FiUpload className="mr-2" />
    Import Data
  </Link>
  
  {/* ... existing buttons ... */}
</div>
  <button 
    onClick={handlePrint}
    className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
  >
    <FiPrinter className="mr-2" />
    Print
  </button>
</div>
        </div>
      </div>

      {/* Report Selection */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex space-x-2 mb-4 md:mb-0 overflow-x-auto">
              {reports.map(report => {
                const Icon = report.icon;
                return (
                  <button
                    key={report.id}
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                      activeReport === report.id 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
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
                disabled={loading}
              >
                {timeRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="p-6">
          {activeReport === 'sales' && renderSalesReport()}
          {activeReport === 'expenses' && renderExpensesReport()}
          {activeReport === 'profit' && renderProfitReport()}
          {activeReport === 'inventory' && renderInventoryReport()}
        </div>
      </div>
    </div>
  );
};

export default Reports;


/*<button 
            onClick={handleExport}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
            disabled={!reportData}
          >
            <FiDownload className="mr-2" />
            Export
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
          >
            <FiPrinter className="mr-2" />
            Print
          </button> */