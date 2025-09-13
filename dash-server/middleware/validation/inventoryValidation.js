// middleware/validation/inventoryValidation.js
const { body, param, query } = require('express-validator');

exports.createProductValidation = [
  body('name')
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 100 })
    .withMessage('Product name must be less than 100 characters')
    .trim()
    .escape(),
  
  body('category')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Category must be less than 50 characters')
    .trim()
    .escape(),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('cost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Cost must be a positive number'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  
  body('min_stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Minimum stock must be a non-negative integer')
];

exports.updateProductValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid product ID'),
  
  body('name')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Product name must be less than 100 characters')
    .trim()
    .escape(),
  
  body('category')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Category must be less than 50 characters')
    .trim()
    .escape(),
  
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('cost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Cost must be a positive number'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  
  body('min_stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Minimum stock must be a non-negative integer')
];

exports.productIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid product ID')
];

exports.updateStockValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid product ID'),
  
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
];

exports.inventoryQueryValidation = [
  query('category')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Invalid category filter'),
  
  query('lowStock')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('Low stock filter must be true or false')
];