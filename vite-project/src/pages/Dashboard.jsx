import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiTrendingDown, FiShoppingCart, FiUsers } from 'react-icons/fi';
import StatCard from '../components/StatCard';
import RecentTransactions from '../components/RecentTransactions';
import InventoryAlerts from '../components/InventoryAlerts';
import RevenueChart from '../components/RevenueChart';
import SalesMap from '../components/SalesMap';
import { reportsAPI, invoicesAPI } from '../services/api';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    revenue: { current: 0, target: 150000, growth: 0 },
    expenses: { current: 0, budget: 50000, growth: 0 },
    profit: { current: 0, target: 100000, growth: 0 },
    customers: { current: 0, target: 1500, growth: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard overview data
        const response = await reportsAPI.getDashboardOverview();
        const data = response.data;
        
        // Calculate growth percentages (you might want to store previous values in your database)
        const revenueGrowth = data.revenue > 0 ? 12.5 : 0; // Example growth calculation
        const expenseGrowth = data.expenses > 0 ? -3.2 : 0; // Example growth calculation
        
        // Update dashboard data
        setDashboardData({
          revenue: { 
            current: data.revenue, 
            target: 150000, 
            growth: revenueGrowth
          },
          expenses: { 
            current: data.expenses, 
            budget: 50000, 
            growth: expenseGrowth
          },
          profit: { 
            current: data.revenue - data.expenses, 
            target: 100000, 
            growth: 8.7 // Example growth
          },
          customers: { 
            current: data.customers || 0, 
            target: 1500, 
            growth: 5.2 // Example growth
          }
        });

      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard data error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Business Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Revenue"
          value={`₹${dashboardData.revenue.current.toLocaleString()}`}
          change={dashboardData.revenue.growth}
          icon={<FiTrendingUp className="h-6 w-6 text-green-500" />}
          target={`Target: ₹${dashboardData.revenue.target.toLocaleString()}`}
        />
        <StatCard
          title="Expenses"
          value={`₹${dashboardData.expenses.current.toLocaleString()}`}
          change={dashboardData.expenses.growth}
          icon={<FiTrendingDown className="h-6 w-6 text-red-500" />}
          target={`Budget: ₹${dashboardData.expenses.budget.toLocaleString()}`}
        />
        <StatCard
          title="Profit"
          value={`₹${dashboardData.profit.current.toLocaleString()}`}
          change={dashboardData.profit.growth}
          icon={<FiTrendingUp className="h-6 w-6 text-green-500" />}
          target={`Target: ₹${dashboardData.profit.target.toLocaleString()}`}
        />
        <StatCard
          title="Customers"
          value={dashboardData.customers.current.toLocaleString()}
          change={dashboardData.customers.growth}
          icon={<FiUsers className="h-6 w-6 text-blue-500" />}
          target={`Goal: ${dashboardData.customers.target.toLocaleString()}`}
        />
      </div>
      
      {/* Revenue Chart */}
      <div className="mb-8">
        <RevenueChart />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesMap />
        </div>
        <div className="space-y-6">
          <RecentTransactions />
          <InventoryAlerts />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;