// routes/expenses.js
const express = require('express');
const router = express.Router();
const {
  getAllExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats,
  getExpenseCategories,

} = require('../controllers/expenseController');
const {
  createExpenseValidation,
  updateExpenseValidation,
  expenseIdValidation,
  expenseQueryValidation
} = require('../middleware/validation/expenseValidation');
const handleValidationErrors = require('../middleware/validation/validationErrorHandler');
const auth = require('../middleware/auth');

router.get('/', auth, expenseQueryValidation, handleValidationErrors, getAllExpenses);
router.get('/:id', auth, expenseIdValidation, handleValidationErrors, getExpense);
router.post('/', auth, createExpenseValidation, handleValidationErrors, createExpense);
router.put('/:id', auth, updateExpenseValidation, handleValidationErrors, updateExpense);
router.delete('/:id', auth, expenseIdValidation, handleValidationErrors, deleteExpense);
router.get('/stats/overview', auth, expenseQueryValidation, handleValidationErrors, getExpenseStats);
router.get('/categories/list', auth, getExpenseCategories);
module.exports = router;