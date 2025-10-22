// components/SalesChart.js
import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SalesChart = () => {
  const [chartData, setChartData] = useState({ labels: [], amounts: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('last7days');
  const [chartType, setChartType] = useState('daily');
  const [chartView, setChartView] = useState('line'); // 'line' or 'bar'

  // Generate realistic demo data based on actual patterns
  const generateRealisticData = (range, type) => {
    let labels = [];
    let amounts = [];
    const today = new Date();

    if (type === 'daily') {
      const days = range === 'last7days' ? 7 : range === 'last15days' ? 15 : 30;
      
      // Start from today and go backwards
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        
        labels.push(date.toLocaleDateString('en-IN', { 
          day: 'numeric', 
          month: 'short' 
        }));

        // Realistic sales pattern: weekends higher, weekdays lower
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const baseAmount = isWeekend ? 35000 : 25000;
        
        // Add some random variation but maintain trend
        const randomVariation = Math.random() * 15000 - 5000; // -5000 to +10000
        const amount = Math.max(5000, baseAmount + randomVariation); // Minimum 5000
        
        amounts.push(Math.round(amount));
      }
    } else {
      const months = range === 'last3months' ? 3 : range === 'last6months' ? 6 : 12;
      
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date();
        date.setMonth(today.getMonth() - i);
        
        labels.push(date.toLocaleDateString('en-IN', { 
          month: 'short',
          year: 'numeric'
        }));

        // Monthly pattern with growth trend
        const growthFactor = 1 + (i * 0.05); // 5% growth per month
        const baseAmount = 200000;
        const randomVariation = Math.random() * 50000 - 20000; // -20000 to +30000
        const amount = (baseAmount * growthFactor) + randomVariation;
        
        amounts.push(Math.round(amount));
      }
    }

    return { labels, amounts };
  };

  // Calculate trends (up/down arrows)
  const calculateTrends = (amounts) => {
    if (!amounts || amounts.length < 2) return [];
    
    const trends = ['-']; // First point has no previous
    for (let i = 1; i < amounts.length; i++) {
      if (amounts[i] > amounts[i-1]) {
        trends.push('up');
      } else if (amounts[i] < amounts[i-1]) {
        trends.push('down');
      } else {
        trends.push('same');
      }
    }
    return trends;
  };

  // Fetch sales data
  const fetchSalesData = async (range = 'last7days', type = 'daily') => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, use demo data. Replace with actual API call when ready
      const demoData = generateRealisticData(range, type);
      setChartData(demoData);
      
      // Simulate API delay
      setTimeout(() => {
        setLoading(false);
      }, 1000);

    } catch (err) {
      console.error('Sales data fetch error:', err);
      setError('Failed to load data');
      setLoading(false);
    }
  };

  // Handle date range change
  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
    fetchSalesData(newRange, chartType);
  };

  // Handle chart type change
  const handleChartTypeChange = (newType) => {
    setChartType(newType);
    const defaultRange = newType === 'daily' ? 'last7days' : 'last3months';
    setDateRange(defaultRange);
    fetchSalesData(defaultRange, newType);
  };

  useEffect(() => {
    fetchSalesData(dateRange, chartType);
  }, []);

  const { labels, amounts } = chartData;
  const trends = calculateTrends(amounts);
  const hasData = labels && labels.length > 0 && amounts && amounts.length > 0;

  // Line Chart Data
  const lineData = {
    labels: hasData ? labels : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: chartType === 'daily' ? 'Daily Sales' : 'Monthly Revenue',
        data: hasData ? amounts : Array(7).fill(0),
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(79, 70, 229)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ]
  };

  // Bar Chart Data with gradient colors
  const barData = {
    labels: hasData ? labels : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: chartType === 'daily' ? 'Daily Sales' : 'Monthly Revenue',
        data: hasData ? amounts : Array(7).fill(0),
        backgroundColor: hasData ? amounts.map((amount, index) => {
          if (index === 0) return 'rgba(79, 70, 229, 0.7)';
          const trend = trends[index];
          if (trend === 'up') return 'rgba(34, 197, 94, 0.7)'; // Green for up
          if (trend === 'down') return 'rgba(239, 68, 68, 0.7)'; // Red for down
          return 'rgba(79, 70, 229, 0.7)'; // Purple for same
        }) : 'rgba(79, 70, 229, 0.7)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  };

  // Common chart options
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: hasData 
          ? `${chartType === 'daily' ? 'Daily Sales' : 'Monthly Revenue'} Trend` 
          : `${chartType === 'daily' ? 'Daily Sales' : 'Monthly Revenue'} Trend`,
        font: {
          size: 16,
          weight: 'bold',
          family: "'Inter', sans-serif"
        },
        padding: 20,
        color: '#1f2937'
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: 12,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            const index = context.dataIndex;
            const trend = trends[index];
            
            let trendText = '';
            if (trend === 'up') trendText = ' ↗';
            else if (trend === 'down') trendText = ' ↘';
            
            return `Sales: ₹${value.toLocaleString('en-IN')}${trendText}`;
          },
          labelColor: function(context) {
            const index = context.dataIndex;
            const trend = trends[index];
            
            let color = 'rgb(79, 70, 229)';
            if (trend === 'up') color = 'rgb(34, 197, 94)';
            else if (trend === 'down') color = 'rgb(239, 68, 68)';
            
            return {
              borderColor: color,
              backgroundColor: color,
              borderWidth: 2
            };
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: function(value) {
            if (value >= 100000) return '₹' + (value/100000).toFixed(1) + 'L';
            if (value >= 1000) return '₹' + (value/1000).toFixed(0) + 'K';
            return '₹' + value;
          },
          font: {
            size: 11,
            family: "'Inter', sans-serif"
          },
          color: '#6b7280'
        },
        title: {
          display: true,
          text: 'Sales Amount (₹)',
          font: {
            size: 12,
            weight: '600',
            family: "'Inter', sans-serif"
          },
          color: '#374151'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11,
            family: "'Inter', sans-serif"
          },
          color: '#6b7280'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  // Calculate statistics
  const totalSales = hasData ? amounts.reduce((sum, amount) => sum + amount, 0) : 0;
  const averageSales = hasData ? totalSales / amounts.length : 0;
  const highestSales = hasData ? Math.max(...amounts) : 0;
  const lowestSales = hasData ? Math.min(...amounts) : 0;
  
  // Calculate growth from first to last period
  const salesGrowth = hasData && amounts.length > 1 
    ? ((amounts[amounts.length - 1] - amounts[0]) / amounts[0]) * 100 
    : 0;

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-32 bg-gray-100 rounded animate-pulse"></div>
          </div>
          <div className="flex space-x-3">
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <div className="text-gray-500">Loading sales data...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {chartType === 'daily' ? 'Daily Sales' : 'Monthly Revenue'} Analytics
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Real-time sales performance and trends
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Chart View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setChartView('line')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                chartView === 'line' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📈 Line
            </button>
            <button
              onClick={() => setChartView('bar')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                chartView === 'bar' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📊 Bar
            </button>
          </div>

          {/* Chart Type */}
          <select 
            value={chartType}
            onChange={(e) => handleChartTypeChange(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="daily">Daily Sales</option>
            <option value="monthly">Monthly Revenue</option>
          </select>

          {/* Date Range */}
          <select 
            value={dateRange}
            onChange={(e) => handleDateRangeChange(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {chartType === 'daily' ? (
              <>
                <option value="last7days">Last 7 Days</option>
                <option value="last15days">Last 15 Days</option>
                <option value="last30days">Last 30 Days</option>
              </>
            ) : (
              <>
                <option value="last3months">Last 3 Months</option>
                <option value="last6months">Last 6 Months</option>
                <option value="last12months">Last 12 Months</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      {hasData && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Sales</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">
                  ₹{totalSales.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="text-blue-600 text-2xl">💰</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Average</p>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  ₹{averageSales.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="text-green-600 text-2xl">📊</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Highest</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">
                  ₹{highestSales.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="text-purple-600 text-2xl">🚀</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Growth</p>
                <p className={`text-2xl font-bold mt-1 ${
                  salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {salesGrowth >= 0 ? '+' : ''}{salesGrowth.toFixed(1)}%
                </p>
              </div>
              <div className={`text-2xl ${
                salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {salesGrowth >= 0 ? '📈' : '📉'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="h-80 w-full">
        {chartView === 'line' ? (
          <Line data={lineData} options={commonOptions} />
        ) : (
          <Bar data={barData} options={commonOptions} />
        )}
      </div>

      {/* Trend Indicators */}
      {hasData && chartView === 'bar' && (
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <span>Daily Trend Indicators:</span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Up</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Down</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-indigo-500 rounded"></div>
                <span>Same</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Last Updated */}
      <div className="mt-4 text-right">
        <span className="text-xs text-gray-500">
          Updated: {new Date().toLocaleString('en-IN')}
        </span>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="text-red-700 text-sm">{error}</div>
        </div>
      )}
    </div>
  );
};

export default SalesChart;