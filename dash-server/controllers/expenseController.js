// controllers/expenseController.js
const Expense = require('../models/Expense');

// Get all expenses for a user
exports.getAllExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate, page = 1, limit = 10 } = req.query;
    let filter = { user: req.user._id };
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const expenses = await Expense.find(filter)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Expense.countDocuments(filter);
    
    res.json({
      expenses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific expense
exports.getExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({ 
      _id: req.params._id, 
      user: req.user._id 
    });
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new expense
exports.createExpense = async (req, res) => {
  try {
    const { category, description, amount, date, payment_method } = req.body;
    
    if (!category || !amount || !date) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }
    
    const expense = new Expense({
      user: req.user._id,
      category,
      description: description || '',
      amount,
      date,
      payment_method: payment_method || 'cash'
    });
    
    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an expense
exports.updateExpense = async (req, res) => {
  try {
    const { category, description, amount, date, payment_method } = req.body;
    
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params._id, user: req.user._id },
      { category, description, amount, date, payment_method },
      { new: true, runValidators: true }
    );
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    console.log(expense)
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get expense statistics
exports.getExpenseStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const mongoose = require('mongoose');
    
    console.log('Expense Stats Request:', { startDate, endDate, user: req.user._id });
    
    // Build match criteria
    let match = { user: new mongoose.Types.ObjectId(req.user.id) }; // Use _id instead of id
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // End of day
      
      match.date = {
        $gte: start,
        $lte: end
      };
    }
    
    console.log('Match Criteria:', JSON.stringify(match, null, 2));
    
    // First check if any expenses exist
    const expenseCount = await Expense.countDocuments(match);
    console.log('Expenses found:', expenseCount);
    
    if (expenseCount === 0) {
      return res.json({
        totalExpenses: 0,
        expenseCount: 0,
        byCategory: []
      });
    }
    
    // Simple and correct aggregation
    const stats = await Expense.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: "$amount" },
          expenseCount: { $sum: 1 },
          categories: { 
            $push: { 
              category: "$category", 
              amount: "$amount" 
            } 
          }
        }
      },
      {
        $unwind: "$categories"
      },
      {
        $group: {
          _id: "$categories.category",
          total: { $sum: "$categories.amount" },
          count: { $sum: 1 },
          overallTotal: { $first: "$totalExpenses" },
          overallCount: { $first: "$expenseCount" }
        }
      },
      {
        $group: {
          _id: null,
          totalExpenses: { $first: "$overallTotal" },
          expenseCount: { $first: "$overallCount" },
          byCategory: {
            $push: {
              category: "$_id",
              total: "$total",
              count: "$count"
            }
          }
        }
      }
    ]);
    
    console.log('Aggregation Result:', stats);
    
    const result = stats[0] || {
      totalExpenses: 0,
      expenseCount: 0,
      byCategory: []
    };
    
    res.json(result);
    
  } catch (error) {
    console.error('Error in getExpenseStats:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get expense categories
exports.getExpenseCategories = async (req, res) => {
  try {
    const categories = await Expense.distinct('category', { user: req.user._id });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};