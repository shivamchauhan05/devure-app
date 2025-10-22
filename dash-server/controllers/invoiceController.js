// controllers/invoiceController.js
const Invoice = require('../models/Invoice');
const Customer = require('../models/Customer');

// Get all invoices for a user
exports.getAllInvoices = async (req, res) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 10 } = req.query;
    let filter = { user: req.user.id };
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const invoices = await Invoice.find(filter)
      .populate('customer', 'name email phone')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Invoice.countDocuments(filter);
    
    res.json({
      invoices,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific invoice
exports.getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    }).populate('customer', 'name email phone address');
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new invoice
exports.createInvoice = async (req, res) => {
  try {
    const { customer, invoice_number, date, due_date, items, total_amount, status } = req.body;
    
    if (!invoice_number || !date || !items || !total_amount) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }
    
    // Validate customer exists and belongs to user
    if (customer) {
      const customerExists = await Customer.findOne({ 
        _id: customer, 
        user: req.user.id 
      });
      
      if (!customerExists) {
        return res.status(400).json({ message: 'Customer not found' });
      }
    }
    
    const invoice = new Invoice({
      user: req.user.id,
      customer: customer || null,
      invoice_number,
      date,
      due_date,
      items,
      total_amount,
      status: status || 'draft'
    });
    
    const savedInvoice = await invoice.save();
    await savedInvoice.populate('customer', 'name email phone');
    
    res.status(201).json(savedInvoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update invoice status
exports.updateInvoiceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status },
      { new: true }
    ).populate('customer', 'name email phone');
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an invoice
exports.updateInvoice = async (req, res) => {
  try {
    const { customer, invoice_number, date, due_date, items, total_amount, status } = req.body;
    
    // Validate customer exists and belongs to user
    if (customer) {
      const customerExists = await Customer.findOne({ 
        _id: customer, 
        user: req.user.id 
      });
      
      if (!customerExists) {
        return res.status(400).json({ message: 'Customer not found' });
      }
    }
    
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { customer, invoice_number, date, due_date, items, total_amount, status },
      { new: true, runValidators: true }
    ).populate('customer', 'name email phone');
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an invoice
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get invoice statistics
/* exports.getInvoiceStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let match = { user: req.user.id };
    
    if (startDate && endDate) {
      match.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
   const stats = await Invoice.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalInvoices: { $sum: 1 },
          totalRevenue: { $sum: "$total_amount" },
          paidInvoices: {
            $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] }
          },
          pendingInvoices: {
            $sum: { $cond: [{ $eq: ["$status", "sent"] }, 1, 0] }
          },
          overdueInvoices: {
            $sum: { $cond: [{ $eq: ["$status", "overdue"] }, 1, 0] }
          }
        }
      }
    ]);
    
    res.json(stats[0] || {
      totalInvoices: 0,
      totalRevenue: 0,
      paidInvoices: 0,
      pendingInvoices: 0,
      overdueInvoices: 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } 
 

} */
exports.getInvoiceStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    console.log(startDate,endDate)
    const mongoose = require('mongoose'); // Make sure to require mongoose
    
    let match = { user: new mongoose.Types.ObjectId(req.user.id) };
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
      }
      
      end.setHours(23, 59, 59, 999);
      match.date = {
        $gte: start,
        $lte: end
      };
    }
    
    const stats = await Invoice.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalInvoices: { $sum: 1 },
          totalRevenue: { $sum: "$total_amount" },
          paidInvoices: {
            $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] }
          },
          pendingInvoices: {
            $sum: { $cond: [{ $eq: ["$status", "sent"] }, 1, 0] }
          },
          overdueInvoices: {
            $sum: { $cond: [{ $eq: ["$status", "overdue"] }, 1, 0] }
          },
          draftInvoices: {
            $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] }
          }
        }
      }
    ]);
    
    // Enhanced response with all statuses
    const result = stats[0] || {
      totalInvoices: 0,
      totalRevenue: 0,
      paidInvoices: 0,
      pendingInvoices: 0,
      overdueInvoices: 0,
      draftInvoices: 0
    };
    
    res.json(result);
    
  } catch (error) {
    console.error('Invoice stats error:', error);
    res.status(500).json({ error: error.message });
  }
};