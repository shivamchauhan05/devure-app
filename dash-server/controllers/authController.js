// controllers/authController.js
const User = require('../models/User');
const Settings = require('../models/Settings');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: '7d' }
  );
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, business_name } = req.body;
    console.log(name,email,password)
    console.log(req.boby)
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create user
    const user = new User({ name, email, password, business_name });
    const savedUser = await user.save();
    
    // Create default settings for the user
    const settings = new Settings({ user: savedUser._id });
    await settings.save();
    
    // Generate token
    const token = generateToken(savedUser._id);
    
    res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        business_name: savedUser.business_name
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.boby)
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }
    
    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        business_name: user.business_name,
        address:user.address,
        city:user.city,
        phone:user.phone,
        state:user.state,
        zip_code:user.zip_code,
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// upadate current user
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ req.user._id ki jagah req.user.id use karo
    const updateData = req.body;

    console.log('Updating profile for user:', userId);
    console.log('Update data:', updateData);

    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Profile updated successfully:', updatedUser);
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      message: 'Error updating profile', 
      error: error.message 
    });
  }
};