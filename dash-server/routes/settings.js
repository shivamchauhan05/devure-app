// routes/settings.js
const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
  updateSettingsSection
} = require('../controllers/settingsController');
const {
  updateSettingsValidation
} = require('../middleware/validation/settingsValidation');
const handleValidationErrors = require('../middleware/validation/validationErrorHandler');
const auth = require('../middleware/auth');

router.get('/', auth, getSettings);
router.put('/', auth, updateSettingsValidation, handleValidationErrors, updateSettings);
router.patch('/:section', auth, updateSettingsValidation, handleValidationErrors, updateSettingsSection);

module.exports = router;