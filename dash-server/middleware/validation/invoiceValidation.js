// middleware/validation/invoiceValidation.js
const { body, param, query } = require('express-validator');
const Customer = require('../../models/Customer');

exports.createInvoiceValidation = [
  body('invoice_number')
    .notEmpty()
    .withMessage('Invoice number is required')
    .isLength({ max: 50 })
    .withMessage('Invoice number must be less than 50 characters')
    .trim()
    .escape(),
  
  body('date')
    .isISO8601()
    .withMessage('Please provide a valid date'),
  
  body('due_date')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid due date')
    .custom((dueDate, { req }) => {
      if (dueDate && new Date(dueDate) < new Date(req.body.date)) {
        throw new Error('Due date cannot be before invoice date');
      }
      return true;
    }),
  
  body('customer')
    .optional()
    .isMongoId()
    .withMessage('Invalid customer ID')
    .custom(async (customerId, { req }) => {
      if (customerId) {
        const customer = await Customer.findOne({ 
          _id: customerId, 
          user: req.user.id 
        });
        if (!customer) {
          throw new Error('Customer not found');
        }
      }
      return true;
    }),
  
  body('items')
    .isArray({ min: 1 })
    .withMessage('Invoice must have at least one item'),
  
  body('items.*.description')
    .notEmpty()
    .withMessage('Item description is required')
    .isLength({ max: 200 })
    .withMessage('Item description must be less than 200 characters')
    .trim()
    .escape(),
  
  body('items.*.quantity')
    .isFloat({ min: 0.01 })
    .withMessage('Quantity must be a positive number'),
  
  body('items.*.price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('items.*.total')
    .isFloat({ min: 0 })
    .withMessage('Total must be a positive number'),
  
  body('total_amount')
    .isFloat({ min: 0 })
    .withMessage('Total amount must be a positive number'),
  
  body('status')
    .optional()
    .isIn(['draft', 'sent', 'paid', 'overdue'])
    .withMessage('Invalid status')
];

exports.updateInvoiceValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid invoice ID'),
  
  body('invoice_number')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Invoice number must be less than 50 characters')
    .trim()
    .escape(),
  
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date'),
  
  body('due_date')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid due date')
    .custom((dueDate, { req }) => {
      if (dueDate && req.body.date && new Date(dueDate) < new Date(req.body.date)) {
        throw new Error('Due date cannot be before invoice date');
      }
      return true;
    }),
  
  body('customer')
    .optional()
    .isMongoId()
    .withMessage('Invalid customer ID')
    .custom(async (customerId, { req }) => {
      if (customerId) {
        const customer = await Customer.findOne({ 
          _id: customerId, 
          user: req.user.id 
        });
        if (!customer) {
          throw new Error('Customer not found');
        }
      }
      return true;
    }),
  
  body('items')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Invoice must have at least one item'),
  
  body('items.*.description')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Item description must be less than 200 characters')
    .trim()
    .escape(),
  
  body('items.*.quantity')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Quantity must be a positive number'),
  
  body('items.*.price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('items.*.total')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Total must be a positive number'),
  
  body('total_amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Total amount must be a positive number'),
  
  body('status')
    .optional()
    .isIn(['draft', 'sent', 'paid', 'overdue'])
    .withMessage('Invalid status')
];

exports.invoiceIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid invoice ID')
];

exports.updateInvoiceStatusValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid invoice ID'),
  
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['draft', 'sent', 'paid', 'overdue'])
    .withMessage('Invalid status')
];

exports.invoiceQueryValidation = [
  query('status')
    .optional()
    .isIn(['all', 'draft', 'sent', 'paid', 'overdue'])
    .withMessage('Invalid status filter'),
  
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