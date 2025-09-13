// routes/reports.js
const express = require('express');
const router = express.Router();
const {
  getSalesReport,
  getExpensesReport,
  getProfitLossReport,
  getInventoryReport,
  getDashboardOverview
} = require('../controllers/reportController');
const {
  reportQueryValidation,
  dashboardQueryValidation
} = require('../middleware/validation/reportValidation');
const handleValidationErrors = require('../middleware/validation/validationErrorHandler');
const auth = require('../middleware/auth');

router.get('/sales', auth, reportQueryValidation, handleValidationErrors, getSalesReport);
router.get('/expenses', auth, reportQueryValidation, handleValidationErrors, getExpensesReport);
router.get('/profit-loss', auth, reportQueryValidation, handleValidationErrors, getProfitLossReport);
router.get('/inventory', auth, getInventoryReport);
router.get('/dashboard', auth, dashboardQueryValidation, handleValidationErrors, getDashboardOverview);

module.exports = router;