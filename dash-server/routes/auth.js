// routes/auth.js
const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getCurrentUser,
  updateProfile
} = require('../controllers/authController');
const {
  registerValidation,
  loginValidation
} = require('../middleware/validation/authValidation');
const handleValidationErrors = require('../middleware/validation/validationErrorHandler');
const auth = require('../middleware/auth');

router.post('/register', registerValidation, handleValidationErrors, register);
router.post('/login', loginValidation, handleValidationErrors, login);
router.get('/user', auth, getCurrentUser);
router.put('/profile',auth,updateProfile)

module.exports = router;