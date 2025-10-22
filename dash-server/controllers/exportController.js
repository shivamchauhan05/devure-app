const Invoice = require('../models/Invoice');
const Expense = require('../models/Expense');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

// Helper function to format dates
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN');
};

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

// Export Sales Report
exports.exportSales = async (req, res) => {
  try {
    const { startDate, endDate, format = 'csv' } = req.query;
    const userId = req.user._id;

    let match = { user: userId };
    if (startDate && endDate) {
      match.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const invoices = await Invoice.find(match)
      .populate('customer', 'name email')
      .sort({ date: -1 });

    const salesData = invoices.map(invoice => ({
      'Invoice Number': invoice.invoice_number,
      'Date': formatDate(invoice.date),
      'Customer': invoice.customer?.name || 'N/A',
      'Total Amount': invoice.total_amount,
      'Status': invoice.status,
      'Items Count': invoice.items.length
    }));

    switch (format) {
      case 'csv':
        return exportCSV(res, salesData, 'sales-report');
      case 'pdf':
        return exportPDF(res, salesData, 'Sales Report', 'sales-report');
      case 'excel':
        return exportExcel(res, salesData, 'Sales Report', 'sales-report');
      default:
        return exportCSV(res, salesData, 'sales-report');
    }
  } catch (error) {
    console.error('Export Sales Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Export Expenses Report
exports.exportExpenses = async (req, res) => {
  try {
    const { startDate, endDate, format = 'csv' } = req.query;
    const userId = req.user._id;

    let match = { user: userId };
    if (startDate && endDate) {
      match.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const expenses = await Expense.find(match).sort({ date: -1 });

    const expensesData = expenses.map(expense => ({
      'Date': formatDate(expense.date),
      'Category': expense.category,
      'Description': expense.description || '',
      'Amount': expense.amount,
      'Payment Method': expense.payment_method,
      'Created At': formatDate(expense.createdAt)
    }));

    switch (format) {
      case 'csv':
        return exportCSV(res, expensesData, 'expenses-report');
      case 'pdf':
        return exportPDF(res, expensesData, 'Expenses Report', 'expenses-report');
      case 'excel':
        return exportExcel(res, expensesData, 'Expenses Report', 'expenses-report');
      default:
        return exportCSV(res, expensesData, 'expenses-report');
    }
  } catch (error) {
    console.error('Export Expenses Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Export Inventory Report
exports.exportInventory = async (req, res) => {
  try {
    const { format = 'csv' } = req.query;
    const userId = req.user._id;

    const products = await Product.find({ user: userId }).sort({ name: 1 });

    const inventoryData = products.map(product => ({
      'Product Name': product.name,
      'Category': product.category,
      'Stock': product.stock,
      'Price': product.price,
      'Min Stock': product.min_stock,
      'Status': product.stock <= 0 ? 'Out of Stock' : 
                product.stock <= product.min_stock ? 'Low Stock' : 'In Stock',
      'Total Value': product.stock * product.price
    }));

    switch (format) {
      case 'csv':
        return exportCSV(res, inventoryData, 'inventory-report');
      case 'pdf':
        return exportPDF(res, inventoryData, 'Inventory Report', 'inventory-report');
      case 'excel':
        return exportExcel(res, inventoryData, 'Inventory Report', 'inventory-report');
      default:
        return exportCSV(res, inventoryData, 'inventory-report');
    }
  } catch (error) {
    console.error('Export Inventory Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Export Profit & Loss Report
exports.exportProfitLoss = async (req, res) => {
  try {
    const { startDate, endDate, format = 'csv' } = req.query;
    const userId = req.user._id;

    let match = { user: userId };
    if (startDate && endDate) {
      match.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Get revenue from paid invoices
    const revenueData = await Invoice.aggregate([
      { $match: { ...match, status: 'paid' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total_amount' }
        }
      }
    ]);

    // Get total expenses
    const expenseData = await Expense.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: '$amount' }
        }
      }
    ]);

    const revenue = revenueData[0]?.totalRevenue || 0;
    const expenses = expenseData[0]?.totalExpenses || 0;
    const netProfit = revenue - expenses;
    const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

    const profitLossData = [
      { 'Description': 'Total Revenue', 'Amount': revenue },
      { 'Description': 'Total Expenses', 'Amount': expenses },
      { 'Description': 'Net Profit/Loss', 'Amount': netProfit },
      { 'Description': 'Profit Margin (%)', 'Amount': profitMargin.toFixed(2) + '%' }
    ];

    switch (format) {
      case 'csv':
        return exportCSV(res, profitLossData, 'profit-loss-report');
      case 'pdf':
        return exportPDF(res, profitLossData, 'Profit & Loss Report', 'profit-loss-report');
      case 'excel':
        return exportExcel(res, profitLossData, 'Profit & Loss Report', 'profit-loss-report');
      default:
        return exportCSV(res, profitLossData, 'profit-loss-report');
    }
  } catch (error) {
    console.error('Export Profit Loss Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// CSV Export Helper
const exportCSV = (res, data, filename) => {
  if (!data || data.length === 0) {
    return res.status(404).json({ error: 'No data to export' });
  }

  const headers = Object.keys(data[0]);
  let csv = headers.join(',') + '\n';

  data.forEach(row => {
    const values = headers.map(header => {
      let value = row[header] || '';
      // Handle values that might contain commas
      if (typeof value === 'string' && value.includes(',')) {
        value = `"${value}"`;
      }
      return value;
    });
    csv += values.join(',') + '\n';
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}-${Date.now()}.csv`);
  res.send(csv);
};

// PDF Export Helper
const exportPDF = (res, data, title, filename) => {
  const doc = new PDFDocument();
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}-${Date.now()}.pdf`);

  doc.pipe(res);

  // Title
  doc.fontSize(20).text(title, 50, 50);
  doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, 50, 80);
  doc.moveDown(2);

  // Table headers
  if (data.length > 0) {
    const headers = Object.keys(data[0]);
    let yPosition = 120;

    // Headers
    doc.fontSize(10).font('Helvetica-Bold');
    headers.forEach((header, index) => {
      doc.text(header, 50 + (index * 120), yPosition);
    });

    // Data rows
    doc.font('Helvetica');
    data.forEach((row, rowIndex) => {
      yPosition = 140 + (rowIndex * 20);
      headers.forEach((header, colIndex) => {
        const value = row[header] || '';
        doc.fontSize(8).text(String(value), 50 + (colIndex * 120), yPosition);
      });
    });
  } else {
    doc.text('No data available', 50, 120);
  }

  doc.end();
};

// Excel Export Helper
const exportExcel = async (res, data, title, filename) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(title);

  if (data.length > 0) {
    // Add headers
    const headers = Object.keys(data[0]);
    worksheet.addRow(headers);

    // Style headers
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6E6FA' }
    };

    // Add data
    data.forEach(row => {
      const rowData = headers.map(header => row[header] || '');
      worksheet.addRow(rowData);
    });

    // Auto-fit columns
    worksheet.columns = headers.map(header => ({
      width: 15
    }));
  } else {
    worksheet.addRow(['No data available']);
  }

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}-${Date.now()}.xlsx`);

  await workbook.xlsx.write(res);
  res.end();
};