const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  cost: {
    type: Number,
    min: 0
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  min_stock: {
    type: Number,
    default: 10,
    min: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
productSchema.index({ user: 1, name: 1 });
productSchema.index({ user: 1, category: 1 });

// Virtual for low stock alert
productSchema.virtual('is_low_stock').get(function() {
  return this.stock <= this.min_stock;
});

module.exports = mongoose.model('Product', productSchema);