const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
const auth = require('../middleware/auth');

// Export routes
router.get('/sales', auth, exportController.exportSales);
router.get('/expenses', auth, exportController.exportExpenses);
router.get('/inventory', auth, exportController.exportInventory);
router.get('/profit-loss', auth, exportController.exportProfitLoss);

module.exports = router;