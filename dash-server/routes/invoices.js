// routes/invoices.js
const express = require('express');
const router = express.Router();
const {
  getAllInvoices,
  getInvoice,
  createInvoice,
  updateInvoiceStatus,
  updateInvoice,
  deleteInvoice,
  getInvoiceStats
} = require('../controllers/invoiceController');
const {
  createInvoiceValidation,
  updateInvoiceValidation,
  invoiceIdValidation,
  updateInvoiceStatusValidation,
  invoiceQueryValidation
} = require('../middleware/validation/invoiceValidation');
const handleValidationErrors = require('../middleware/validation/validationErrorHandler');
const auth = require('../middleware/auth');

router.get('/', auth, invoiceQueryValidation, handleValidationErrors, getAllInvoices);
router.get('/:id', auth, invoiceIdValidation, handleValidationErrors, getInvoice);
router.post('/', auth, createInvoiceValidation, handleValidationErrors, createInvoice);
router.patch('/:id/status', auth, updateInvoiceStatusValidation, handleValidationErrors, updateInvoiceStatus);
router.put('/:id', auth, updateInvoiceValidation, handleValidationErrors, updateInvoice);
router.delete('/:id', auth, invoiceIdValidation, handleValidationErrors, deleteInvoice);
router.get('/stats/overview', auth, invoiceQueryValidation, handleValidationErrors, getInvoiceStats);

module.exports = router;