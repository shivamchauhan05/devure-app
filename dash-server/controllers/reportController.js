// controllers/reportController.js
const Invoice = require('../models/Invoice');
const Expense = require('../models/Expense');
const Product = require('../models/Product');

// Get sales report
exports.getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate, groupBy } = req.query;
    let match = { user: req.user.id, status: 'paid' };
    
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
    let match = { user: req.user.id };
    
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
    let invoiceMatch = { user: req.user.id, status: 'paid' };
    let expenseMatch = { user: req.user.id };
    
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
    const { lowStock } = req.query;
    let match = { user: req.user.id };
    
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
    let invoiceMatch = { user: req.user.id };
    let expenseMatch = { user: req.user.id };
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      invoiceMatch.date = { $gte: start, $lte: end };
      expenseMatch.date = { $gte: start, $lte: end };
    }
    
    const [
      invoiceStats,
      expenseStats,
      productStats
    ] = await Promise.all([
      // Invoice statistics
      Invoice.aggregate([
        { $match: invoiceMatch },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$total_amount" },
            invoiceCount: { $sum: 1 },
            paidInvoices: {
              $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] }
            },
            pendingInvoices: {
              $sum: { $cond: [{ $eq: ["$status", "sent"] }, 1, 0] }
            }
          }
        }
      ]),
      // Expense statistics
      Expense.aggregate([
        { $match: expenseMatch },
        {
          $group: {
            _id: null,
            totalExpenses: { $sum: "$amount" },
            expenseCount: { $sum: 1 }
          }
        }
      ]),
      // Product statistics
      Product.aggregate([
        { $match: { user: req.user.id } },
        {
          $group: {
            _id: null,
            totalProducts: { $sum: 1 },
            lowStockItems: {
              $sum: { $cond: [{ $lte: ["$stock", "$min_stock"] }, 1, 0] }
            }
          }
        }
      ])
    ]);
    
    res.json({
      revenue: invoiceStats[0]?.totalRevenue || 0,
      expenses: expenseStats[0]?.totalExpenses || 0,
      invoices: invoiceStats[0]?.invoiceCount || 0,
      paidInvoices: invoiceStats[0]?.paidInvoices || 0,
      pendingInvoices: invoiceStats[0]?.pendingInvoices || 0,
      products: productStats[0]?.totalProducts || 0,
      lowStockItems: productStats[0]?.lowStockItems || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};