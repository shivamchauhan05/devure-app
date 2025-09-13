// middleware/validation/settingsValidation.js
const { body } = require('express-validator');

exports.updateSettingsValidation = [
  body('currency')
    .optional()
    .isLength({ max: 10 })
    .withMessage('Currency must be less than 10 characters')
    .trim()
    .escape(),
  
  body('fiscal_year')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Fiscal year must be less than 50 characters')
    .trim()
    .escape(),
  
  body('tax_id')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Tax ID must be less than 50 characters')
    .trim()
    .escape(),
  
  body('invoice_prefix')
    .optional()
    .isLength({ max: 10 })
    .withMessage('Invoice prefix must be less than 10 characters')
    .trim()
    .escape(),
  
  body('email_notifications')
    .optional()
    .isBoolean()
    .withMessage('Email notifications must be a boolean value'),
  
  body('sms_notifications')
    .optional()
    .isBoolean()
    .withMessage('SMS notifications must be a boolean value'),
  
  body('low_stock_alerts')
    .optional()
    .isBoolean()
    .withMessage('Low stock alerts must be a boolean value'),
  
  body('payment_reminders')
    .optional()
    .isBoolean()
    .withMessage('Payment reminders must be a boolean value'),
  
  body('two_factor_auth')
    .optional()
    .isBoolean()
    .withMessage('Two factor auth must be a boolean value'),
  
  body('session_timeout')
    .optional()
    .isInt({ min: 1, max: 1440 })
    .withMessage('Session timeout must be between 1 and 1440 minutes'),
  
  body('payment_methods.cash')
    .optional()
    .isBoolean()
    .withMessage('Cash payment method must be a boolean value'),
  
  body('payment_methods.upi')
    .optional()
    .isBoolean()
    .withMessage('UPI payment method must be a boolean value'),
  
  body('payment_methods.bank_transfer')
    .optional()
    .isBoolean()
    .withMessage('Bank transfer payment method must be a boolean value'),
  
  body('payment_methods.card')
    .optional()
    .isBoolean()
    .withMessage('Card payment method must be a boolean value')
];