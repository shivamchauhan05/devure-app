// routes/inventory.js
const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  getInventoryStats,
  getProductCategories
} = require('../controllers/inventoryController');
const {
  createProductValidation,
  updateProductValidation,
  productIdValidation,
  updateStockValidation,
  inventoryQueryValidation
} = require('../middleware/validation/inventoryValidation');
const handleValidationErrors = require('../middleware/validation/validationErrorHandler');
const auth = require('../middleware/auth');

router.get('/', auth, inventoryQueryValidation, handleValidationErrors, getAllProducts);
router.get('/:id', auth, productIdValidation, handleValidationErrors, getProduct);
router.post('/', auth, createProductValidation, handleValidationErrors, createProduct);
router.put('/:id', auth, updateProductValidation, handleValidationErrors, updateProduct);
router.delete('/:id', auth, productIdValidation, handleValidationErrors, deleteProduct);
router.patch('/:id/stock', auth, updateStockValidation, handleValidationErrors, updateProductStock);
router.get('/stats/overview', auth, getInventoryStats);
router.get('/categories/list', auth, getProductCategories);

module.exports = router;