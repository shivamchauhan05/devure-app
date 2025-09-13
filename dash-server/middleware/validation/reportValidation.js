// middleware/validation/reportValidation.js
const { query } = require('express-validator');

exports.reportQueryValidation = [
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
    }),
  
  query('groupBy')
    .optional()
    .isIn(['day', 'month', 'category'])
    .withMessage('Group by must be day, month, or category')
];

exports.dashboardQueryValidation = [
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