// middleware/validation/customerValidation.js
const { body, param } = require('express-validator');
const Customer = require('../../models/Customer');

exports.createCustomerValidation = [
  body('name')
    .notEmpty()
    .withMessage('Customer name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Customer name must be between 2 and 100 characters')
    .trim()
    .escape(),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
    .custom(async (email, { req }) => {
      if (email) {
        const customer = await Customer.findOne({ 
          email, 
          user: req.user.id 
        });
        if (customer) {
          throw new Error('Email already exists for another customer');
        }
      }
      return true;
    }),
  
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  
  body('address')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Address must be less than 500 characters')
    .trim()
    .escape()
];

exports.updateCustomerValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid customer ID'),
  
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Customer name must be between 2 and 100 characters')
    .trim()
    .escape(),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
    .custom(async (email, { req }) => {
      if (email) {
        const customer = await Customer.findOne({ 
          email, 
          user: req.user.id,
          _id: { $ne: req.params.id }
        });
        if (customer) {
          throw new Error('Email already exists for another customer');
        }
      }
      return true;
    }),
  
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  
  body('address')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Address must be less than 500 characters')
    .trim()
    .escape()
];

exports.customerIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid customer ID')
];