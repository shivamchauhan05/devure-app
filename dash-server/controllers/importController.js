const XLSX = require('xlsx');
const Invoice = require('../models/Invoice');
const Expense = require('../models/Expense');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

// Helper function to format dates
const parseExcelDate = (excelDate) => {
  if (!excelDate) return new Date();
  
  // Excel dates are numbers, regular dates are strings/objects
  if (typeof excelDate === 'number') {
    // Excel date (number of days since 1900-01-01)
    const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
    return isNaN(date.getTime()) ? new Date() : date;
  }
  
  // Try parsing as regular date
  const date = new Date(excelDate);
  return isNaN(date.getTime()) ? new Date() : date;
};

// Import Invoices from Excel
// Import Invoices from Excel - UPDATED VERSION
exports.importInvoices = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    console.log('Excel Data:', data);

    const results = {
      success: 0,
      errors: 0,
      errorsList: []
    };

    // Process each row
    for (let i = 0; i < data.length; i++) {
      try {
        const row = data[i];
        
        // CUSTOMER FIX: Find customer by name and get ObjectId
        const customerName = row['Customer'] || row['Customer Name'] || 'Unknown Customer';
        
        // Find customer in database
        let customer = await Customer.findOne({ 
          name: customerName, 
          user: req.user._id 
        });

        // If customer doesn't exist, create a new one
        if (!customer) {
          customer = new Customer({
            user: req.user._id,
            name: customerName,
            email: row['Customer Email'] || '',
            phone: row['Customer Phone'] || '',
            address: {
              street: row['Customer Address'] || '',
              city: row['Customer City'] || '',
              state: row['Customer State'] || '',
              zip: row['Customer Zip'] || '',
              country: row['Customer Country'] || ''
            }
          });
          await customer.save();
        }

        // Map Excel columns to your Invoice model
        const invoiceData = {
          user: req.user._id,
          invoice_number: row['Invoice Number'] || `INV-${Date.now()}-${i}`,
          customer: customer._id, // Use the ObjectId of the customer
          total_amount: parseFloat(row['Total Amount'] || row['Amount'] || 0),
          status: row['Status'] || 'sent',
          date: parseExcelDate(row['Date'] || row['Invoice Date']),
          due_date: parseExcelDate(row['Due Date'] || row['Date']),
          items: []
        };

        // Handle items if provided in Excel
        if (row['Items'] || row['Description']) {
          invoiceData.items = [{
            description: row['Items'] || row['Description'] || 'Product/Service',
            quantity: parseInt(row['Quantity'] || 1),
            price: parseFloat(row['Price'] || row['Unit Price'] || invoiceData.total_amount),
            total: parseFloat(row['Total'] || invoiceData.total_amount)
          }];
        }

        // Validate required fields
        if (!invoiceData.total_amount) {
          throw new Error('Missing required field: Total Amount');
        }

        const invoice = new Invoice(invoiceData);
        await invoice.save();
        results.success++;

      } catch (error) {
        results.errors++;
        results.errorsList.push(`Row ${i + 2}: ${error.message}`);
      }
    }

    res.json({
      message: `Import completed: ${results.success} successful, ${results.errors} failed`,
      details: results
    });

  } catch (error) {
    console.error('Import Invoices Error:', error);
    res.status(500).json({ error: error.message });
  }
};
// Import Expenses from Excel
exports.importExpenses = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const results = {
      success: 0,
      errors: 0,
      errorsList: []
    };

    for (let i = 0; i < data.length; i++) {
      try {
        const row = data[i];
        
        const expenseData = {
          user: req.user._id,
          category: row['Category'] || 'Other',
          description: row['Description'] || row['Note'] || 'Expense',
          amount: parseFloat(row['Amount'] || row['Cost'] || 0),
          date: parseExcelDate(row['Date'] || row['Expense Date']),
          payment_method: (row['Payment Method'] || 'cash').toLowerCase().replace(' ', '_')
        };

        // Validate
        if (!expenseData.amount || expenseData.amount <= 0) {
          throw new Error('Invalid amount');
        }

        const expense = new Expense(expenseData);
        await expense.save();
        results.success++;

      } catch (error) {
        results.errors++;
        results.errorsList.push(`Row ${i + 2}: ${error.message}`);
      }
    }

    res.json({
      message: `Import completed: ${results.success} successful, ${results.errors} failed`,
      details: results
    });

  } catch (error) {
    console.error('Import Expenses Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Import Products from Excel
exports.importProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const results = {
      success: 0,
      errors: 0,
      errorsList: []
    };

    for (let i = 0; i < data.length; i++) {
      try {
        const row = data[i];
        
        const productData = {
          user: req.user._id,
          name: row['Product Name'] || row['Name'] || `Product ${i + 1}`,
          category: row['Category'] || 'Other',
          price: parseFloat(row['Price'] || row['Cost'] || 0),
          stock: parseInt(row['Stock'] || row['Quantity'] || 0),
          min_stock: parseInt(row['Min Stock'] || row['Minimum Stock'] || 5),
          description: row['Description'] || ''
        };

        // Validate
        if (!productData.name) {
          throw new Error('Product name is required');
        }

        const product = new Product(productData);
        await product.save();
        results.success++;

      } catch (error) {
        results.errors++;
        results.errorsList.push(`Row ${i + 2}: ${error.message}`);
      }
    }

    res.json({
      message: `Import completed: ${results.success} successful, ${results.errors} failed`,
      details: results
    });

  } catch (error) {
    console.error('Import Products Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Download Template Excel File
exports.downloadTemplate = async (req, res) => {
  try {
    const { type } = req.params;
    
    let headers = [];
    let sampleData = [];

    switch (type) {
      case 'invoices':
        headers = ['Customer Name', 'Total Amount', 'Status', 'Date', 'Due Date', 'Items', 'Quantity', 'Price'];
        sampleData = [
          ['John Doe', 5000, 'paid', '2024-01-15', '2024-01-30', 'Product A', 2, 2500],
          ['Jane Smith', 3000, 'sent', '2024-01-16', '2024-01-31', 'Product B', 1, 3000]
        ];
        break;
      
      case 'expenses':
        headers = ['Category', 'Description', 'Amount', 'Date', 'Payment Method'];
        sampleData = [
          ['Office Supplies', 'Printer Paper', 1500, '2024-01-15', 'cash'],
          ['Marketing', 'Facebook Ads', 5000, '2024-01-16', 'bank_transfer']
        ];
        break;
      
      case 'products':
        headers = ['Product Name', 'Category', 'Price', 'Stock', 'Min Stock', 'Description'];
        sampleData = [
          ['Laptop', 'Electronics', 50000, 10, 2, 'Gaming Laptop'],
          ['Mouse', 'Electronics', 500, 25, 5, 'Wireless Mouse']
        ];
        break;
      
      default:
        return res.status(400).json({ error: 'Invalid template type' });
    }

    // Create workbook
    const workbook = XLSX.utils.book_new();
    const worksheetData = [headers, ...sampleData];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    
    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${type}-template.xlsx`);
    res.send(buffer);

  } catch (error) {
    console.error('Download Template Error:', error);
    res.status(500).json({ error: error.message });
  }
};