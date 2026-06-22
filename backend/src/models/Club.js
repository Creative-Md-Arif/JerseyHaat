const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Club name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Club slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    logo: {
      type: String,
      default: '',
    },
    league: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      default: '#c9a84c',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries

clubSchema.index({ isActive: 1, order: 1 });

module.exports = mongoose.model('Club', clubSchema);
