const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    oldPrice: {
      type: Number,
      min: 0,
    },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club',
      required: [true, 'Club is required'],
    },
    type: {
      type: String,
      enum: ['Home', 'Away', 'Third', 'Goalkeeper', 'Training', 'Retro'],
      required: [true, 'Jersey type is required'],
    },
    season: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    sizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL', 'XXL'],
    },
    colors: {
      type: [String],
      default: [],
    },
    badge: {
      type: String,
      enum: ['NEW', 'HOT', 'SALE', 'LIMITED', 'RETRO', ''],
      default: '',
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    salesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
productSchema.index({ slug: 1 });
productSchema.index({ club: 1, isActive: 1 });
productSchema.index({ type: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ badge: 1, isActive: 1 });
productSchema.index({ salesCount: -1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
