import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { reportsAPI } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const RevenueChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('12months'); // '6months', '3months'

  useEffect(() => {
    fetchRevenueData();
  }, [timeRange]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Calculate date range based on timeRange
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '3months':
          startDate.setMonth(startDate.getMonth() - 3);
          break;
        case '6months':
          startDate.setMonth(startDate.getMonth() - 6);
          break;
        case '12months':
        default:
          startDate.setMonth(startDate.getMonth() - 12);
          break;
      }

      const params = {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        period: 'monthly'
      };

      const response = await reportsAPI.getRevenueTrend(params);
     // const response = await reportsAPI.getStats();
    
      if (response.data) {
        const data = response.data;
        
        // Format data for chart
        const chartData = {
          labels: data.months,
          datasets: [
            {
              label: 'Revenue',
              data: data.revenue,
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
              tension: 0.4,
              yAxisID: 'y',
            },
            {
              label: 'Sales Count',
              data: data.sales,
              borderColor: 'rgb(16, 185, 129)',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              fill: true,
              tension: 0.4,
              yAxisID: 'y1',
            }
          ]
        };
        
        setChartData(chartData);
      }
    } catch (err) {
      console.error('Error fetching revenue data:', err);
      setError('Failed to load revenue data');
      
      // Fallback to demo data if API fails
      setChartData(getDemoData());
    } finally {
      setLoading(false);
    }
  };

  // Demo data as fallback
  const getDemoData = () => {
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Revenue',
          data: [85000, 75000, 92000, 105000, 98000, 115000, 135000, 145000, 120000, 130000, 145000, 160000],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Sales Count',
          data: [65, 70, 80, 85, 90, 95, 110, 115, 105, 110, 120, 125],
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4,
        }
      ]
    };
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Revenue & Sales Trend (Last ${timeRange.replace('months', ' Months')})`
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.dataset.label === 'Revenue') {
              label += new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR'
              }).format(context.parsed.y);
            } else {
              label += context.parsed.y + ' orders';
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: {
          drawBorder: false
        },
        ticks: {
          callback: function(value) {
            return '₹' + (value / 1000).toFixed(0) + 'K';
          }
        },
        title: {
          display: true,
          text: 'Revenue (₹)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value) {
            return value + ' orders';
          }
        },
        title: {
          display: true,
          text: 'Sales Count'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading revenue data...</span>
        </div>
      </div>
    );
  }

  if (error && !chartData) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-red-600 h-64 flex items-center justify-center">
          <div>
            <p>{error}</p>
            <button 
              onClick={fetchRevenueData}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Chart Header with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">
          Revenue & Sales Trend
        </h3>
        
        <div className="flex items-center space-x-2">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
          </select>
          
          <button 
            onClick={fetchRevenueData}
            className="bg-gray-100 hover:bg-gray-200 rounded-md px-3 py-1 text-sm"
            title="Refresh data"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-120">
        <Line data={chartData} options={options} />
      </div>

      {/* Stats Summary */}
      {chartData && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600">
          <div>
            <strong>Note:</strong> Showing real data from your paid invoices
          </div>
          <div className="text-right">
            {error && <span className="text-orange-600">• Using demo data (API failed)</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueChart;