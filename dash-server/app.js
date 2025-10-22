const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();

// Connect to database
connectDB();

// Route imports
const authRoutes = require('./routes/auth.js');
const customerRoutes = require('./routes/customers');
const invoiceRoutes = require('./routes/invoices');
const expenseRoutes = require('./routes/expenses');
const inventoryRoutes = require('./routes/inventory');
const reportRoutes = require('./routes/reports');
const settingsRoutes = require('./routes/settings');
const exportRoutes = require('./routes/export');
const importRoutes = require('./routes/import');


const app = express();

// Middleware
 
app.use(cors())

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/import', importRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Vyapar API is running' });
});



// Handle 404 errors
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// Error handling middleware

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});