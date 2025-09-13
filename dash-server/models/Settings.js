const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  fiscal_year: {
    type: String,
    default: 'April-March'
  },
  tax_id: {
    type: String,
    trim: true
  },
  invoice_prefix: {
    type: String,
    default: 'INV'
  },
  email_notifications: {
    type: Boolean,
    default: true
  },
  sms_notifications: {
    type: Boolean,
    default: false
  },
  low_stock_alerts: {
    type: Boolean,
    default: true
  },
  payment_reminders: {
    type: Boolean,
    default: true
  },
  two_factor_auth: {
    type: Boolean,
    default: false
  },
  session_timeout: {
    type: Number,
    default: 30
  },
  payment_methods: {
    cash: { type: Boolean, default: true },
    upi: { type: Boolean, default: true },
    bank_transfer: { type: Boolean, default: true },
    card: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);