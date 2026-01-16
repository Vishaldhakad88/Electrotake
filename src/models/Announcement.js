const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    message: {
      type: String,
      required: true
    },

    target: {
      type: String,
      enum: ['user', 'vendor', 'both'],
      required: true
    },

    priority: {
      type: String,
      enum: ['normal', 'high'],
      default: 'normal'
    },

    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },

    startAt: {
      type: Date,
      default: Date.now
    },

    endAt: {
      type: Date,
      default: null
    },

    dismissible: {
      type: Boolean,
      default: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Announcement', AnnouncementSchema);
