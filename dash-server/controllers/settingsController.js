// controllers/settingsController.js
const Settings = require('../models/Settings');

// Get user settings
exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne({ user: req.user.id });
    
    if (!settings) {
      // Create default settings if not found
      const newSettings = new Settings({ user: req.user.id });
      await newSettings.save();
      return res.json(newSettings);
    }
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user settings
exports.updateSettings = async (req, res) => {
  try {
    const {
      currency,
      fiscal_year,
      tax_id,
      invoice_prefix,
      email_notifications,
      sms_notifications,
      low_stock_alerts,
      payment_reminders,
      two_factor_auth,
      session_timeout,
      payment_methods
    } = req.body;
    
    const settings = await Settings.findOneAndUpdate(
      { user: req.user.id },
      {
        currency,
        fiscal_year,
        tax_id,
        invoice_prefix,
        email_notifications,
        sms_notifications,
        low_stock_alerts,
        payment_reminders,
        two_factor_auth,
        session_timeout,
        payment_methods
      },
      { new: true, runValidators: true, upsert: true }
    );
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update specific settings section
exports.updateSettingsSection = async (req, res) => {
  try {
    const { section } = req.params;
    const updateData = req.body;
    
    const settings = await Settings.findOneAndUpdate(
      { user: req.user.id },
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};