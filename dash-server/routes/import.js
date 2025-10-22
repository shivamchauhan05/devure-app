const express = require('express');
const router = express.Router();
const multer = require('multer');
const importController = require('../controllers/importController');
const auth = require('../middleware/auth');

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'), false);
    }
  }
});

// Import routes
router.post('/invoices', auth, upload.single('file'), importController.importInvoices);
router.post('/expenses', auth, upload.single('file'), importController.importExpenses);
router.post('/products', auth, upload.single('file'), importController.importProducts);

// Template download
router.get('/template/:type', auth, importController.downloadTemplate);

module.exports = router;