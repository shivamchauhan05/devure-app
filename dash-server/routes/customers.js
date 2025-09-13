// routes/customers.js
const express = require('express');
const router = express.Router();
const {
  getAllCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customerController');
const {
  createCustomerValidation,
  updateCustomerValidation,
  customerIdValidation
} = require('../middleware/validation/customerValidation');
const handleValidationErrors = require('../middleware/validation/validationErrorHandler');
const auth = require('../middleware/auth');

router.get('/', auth, getAllCustomers);
router.get('/:id', auth, customerIdValidation, handleValidationErrors, getCustomer);
router.post('/', auth, createCustomerValidation, handleValidationErrors, createCustomer);
router.put('/:id', auth, updateCustomerValidation, handleValidationErrors, updateCustomer);
router.delete('/:id', auth, customerIdValidation, handleValidationErrors, deleteCustomer);

module.exports = router;