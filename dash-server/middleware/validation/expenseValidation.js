// middleware/validation/expenseValidation.js
const { body, param, query } = require('express-validator');

exports.createExpenseValidation = [
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isLength({ max: 50 })
    .withMessage('Category must be less than 50 characters')
    .trim()
    .escape(),
  
  body('description')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Description must be less than 200 characters')
    .trim()
    .escape(),
  
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  
  body('date')
    .isISO8601()
    .withMessage('Please provide a valid date'),
  
  body('payment_method')
    .optional()
    .isIn(['cash', 'upi', 'bank_transfer', 'card'])
    .withMessage('Invalid payment method')
];

exports.updateExpenseValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid expense ID'),
  
  body('category')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Category must be less than 50 characters')
    .trim()
    .escape(),
  
  body('description')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Description must be less than 200 characters')
    .trim()
    .escape(),
  
  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date'),
  
  body('payment_method')
    .optional()
    .isIn(['cash', 'upi', 'bank_transfer', 'card'])
    .withMessage('Invalid payment method')
];

exports.expenseIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid expense ID')
];

exports.expenseQueryValidation = [
  query('category')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Invalid category filter'),
  
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid start date'),
  
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid end date')
    .custom((endDate, { req }) => {
      if (endDate && req.query.startDate && new Date(endDate) < new Date(req.query.startDate)) {
        throw new Error('End date cannot be before start date');
      }
      return true;
    })
];