// controllers/reportController.js
const Invoice = require('../models/Invoice');
const Expense = require('../models/Expense');
const Product = require('../models/Product');

// Get sales report
exports.getSalesReport = async (req, res) => {
  try {
    console.log("hello")
    const { startDate, endDate, groupBy } = req.query;
    let match = { user: req.user._id, status: 'paid' };
    
    if (startDate && endDate) {
      match.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    let group;
    if (groupBy === 'day') {
      group = {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        total: { $sum: "$total_amount" },
        count: { $sum: 1 }
      };
    } else if (groupBy === 'month') {
      group = {
        _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
        total: { $sum: "$total_amount" },
        count: { $sum: 1 }
      };
    } else {
      group = {
        _id: null,
        total: { $sum: "$total_amount" },
        count: { $sum: 1 }
      };
    }
    
    const salesReport = await Invoice.aggregate([
      { $match: match },
      { $group: group },
      { $sort: { _id: 1 } }
    ]);
    
    res.json(salesReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get expenses report
exports.getExpensesReport = async (req, res) => {
  try {
    const { startDate, endDate, groupBy } = req.query;
    let match = { user: req.user._id };
    
    if (startDate && endDate) {
      match.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    let group;
    if (groupBy === 'category') {
      group = {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 }
      };
    } else if (groupBy === 'month') {
      group = {
        _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
        total: { $sum: "$amount" },
        count: { $sum: 1 }
      };
    } else {
      group = {
        _id: null,
        total: { $sum: "$amount" },
        count: { $sum: 1 }
      };
    }
    
    const expensesReport = await Expense.aggregate([
      { $match: match },
      { $group: group },
      { $sort: { _id: 1 } }
    ]);
    
    res.json(expensesReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get profit and loss report
exports.getProfitLossReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let invoiceMatch = { user: req.user._id, status: 'paid' };
    let expenseMatch = { user: req.user._id };
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      invoiceMatch.date = { $gte: start, $lte: end };
      expenseMatch.date = { $gte: start, $lte: end };
    }
    
    const [revenue, expenses] = await Promise.all([
      Invoice.aggregate([
        { $match: invoiceMatch },
        { $group: { _id: null, total: { $sum: "$total_amount" } } }
      ]),
      Expense.aggregate([
        { $match: expenseMatch },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ])
    ]);
    
    const totalRevenue = revenue[0]?.total || 0;
    const totalExpenses = expenses[0]?.total || 0;
    const netProfit = totalRevenue - totalExpenses;
    
    res.json({
      revenue: totalRevenue,
      expenses: totalExpenses,
      netProfit,
      profitMargin: totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get inventory report
exports.getInventoryReport = async (req, res) => {
  try {
     console.log("hello");
    const { lowStock } = req.query;
    let match = { user: req.user._id };
    
    if (lowStock === 'true') {
      match.$expr = { $lte: ["$stock", "$min_stock"] };
    }
    
    const inventoryReport = await Product.aggregate([
      
      { $match: match },
      {
        $group: {
          _id: "$category",
          totalValue: { $sum: { $multiply: ["$price", "$stock"] } },
          totalItems: { $sum: 1 },
          lowStockItems: {
            $sum: { $cond: [{ $lte: ["$stock", "$min_stock"] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json(inventoryReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get dashboard overview


exports.getDashboardOverview = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user._id;
    
   
    // Create base match with user
    let invoiceMatch = { user: userId };
    let expenseMatch = { user: userId };
    
    // Better date handling
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // End of day
      
      
      // Try different date fields
      invoiceMatch.$or = [
        { date: { $gte: start, $lte: end } },
        { createdAt: { $gte: start, $lte: end } },
        { invoiceDate: { $gte: start, $lte: end } }
      ].filter(Boolean);
    }
    
    
    const [
      invoiceStats,
      expenseStats,
      productStats,
      allInvoices // Debug: get all invoices to see what exists
    ] = await Promise.all([
      // Invoice aggregation
      Invoice.aggregate([
        { $match: invoiceMatch },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: { $ifNull: ["$total_amount", 0] } },
            invoiceCount: { $sum: 1 },
            paidInvoices: {
              $sum: { 
                $cond: [
                  { $in: ["$status", ["paid", "completed", "success"]] }, 
                  1, 
                  0 
                ]
              }
            },
            pendingInvoices: {
              $sum: { 
                $cond: [
                  { $in: ["$status", ["sent", "pending", "unpaid", "due"]] }, 
                  1, 
                  0 
                ]
              }
            }
          }
        }
      ]),
      
      // Expense aggregation
      Expense.aggregate([
        { $match: expenseMatch },
        {
          $group: {
            _id: null,
            totalExpenses: { $sum: { $ifNull: ["$amount", 0] } },
            expenseCount: { $sum: 1 }
          }
        }
      ]),
      
      // Product aggregation
      Product.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: null,
            totalProducts: { $sum: 1 },
            lowStockItems: {
              $sum: { 
                $cond: [
                  { 
                    $and: [
                      { $ifNull: ["$stock", 0] }, 
                      { $ifNull: ["$min_stock", 0] },
                      { $lte: ["$stock", "$min_stock"] }
                    ]
                  }, 
                  1, 
                  0 
                ]
              }
            },
            outOfStockItems: {
              $sum: { 
                $cond: [
                  { $lte: [{ $ifNull: ["$stock", 0] }, 0] }, 
                  1, 
                  0 
                ]
              }
            },
            totalInventoryValue: {
              $sum: {
                $multiply: [
                  { $ifNull: ["$stock", 0] },
                  { $ifNull: ["$price", 0] }
                ]
              }
            }
          }
        }
      ]),
      
      // Debug: Get all invoices to see what we have
      Invoice.find({ user: userId })
    ]);
    
    
    
    
    const invoiceData = invoiceStats[0] || {};
    const expenseData = expenseStats[0] || {};
    const productData = productStats[0] || {};
    
    const response = {
      revenue: invoiceData.totalRevenue || 0,
      expenses: expenseData.totalExpenses || 0,
      invoices: invoiceData.invoiceCount || 0,
      paidInvoices: invoiceData.paidInvoices || 0,
      pendingInvoices: invoiceData.pendingInvoices || 0,
      products: productData.totalProducts || 0,
      lowStockItems: productData.lowStockItems || 0,
      outOfStockItems: productData.outOfStockItems || 0,
      inventoryValue: productData.totalInventoryValue || 0
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Revenue chart data
exports.getRevenueTrend = async (req, res) => {
  try {
    const { startDate, endDate, period = 'monthly' } = req.query;
    const userId = req.user._id;

    console.log('Revenue Trend Request:', { startDate, endDate, period, user: userId });

    // Default date range - last 12 months
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date();
    start.setMonth(start.getMonth() - 11); // Last 12 months

    let match = { 
      user: userId, 
      status: 'paid',
      date: { $gte: start, $lte: end }
    };

    // Aggregation for monthly revenue trend
    const revenueData = await Invoice.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          revenue: { $sum: "$total_amount" },
          salesCount: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    console.log('Raw Revenue Data:', revenueData);

    // Format data for chart
    const months = [];
    const revenue = [];
    const sales = [];

    // Generate last 12 months labels
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const monthLabel = `${monthNames[date.getMonth()]} ${year.toString().slice(2)}`;
      
      months.push(monthLabel);

      // Find matching revenue data
      const monthData = revenueData.find(item => 
        item._id.year === year && item._id.month === month
      );

      revenue.push(monthData ? monthData.revenue : 0);
      sales.push(monthData ? monthData.salesCount : 0);
    }

    const response = {
      months,
      revenue,
      sales,
      totalRevenue: revenue.reduce((sum, val) => sum + val, 0),
      totalSales: sales.reduce((sum, val) => sum + val, 0)
    };

    console.log('Formatted Revenue Trend:', response);
    res.json(response);

  } catch (error) {
    console.error('Revenue Trend Error:', error);
    res.status(500).json({ error: error.message });
  }
};