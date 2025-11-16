/**
 * USER MODEL (MongoDB Schema)
 * Location: backend/models/User.js
 * 
 * Defines the MongoDB schema for storing user data:
 * - username (unique identifier)
 * - irisEmbedding (128-dimensional vector)
 * - createdAt (registration timestamp)
 */

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  irisEmbedding: {
    type: [Number],
    required: [true, 'Iris embedding is required'],
    validate: {
      validator: function(v) {
        return v && v.length === 128;
      },
      message: 'Iris embedding must be exactly 128 dimensions'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: null
  }
});

// Index for faster queries
UserSchema.index({ username: 1 });

// Instance method to update last login
UserSchema.methods.updateLastLogin = function() {
  this.lastLogin = Date.now();
  return this.save();
};

// Static method to find by username
UserSchema.statics.findByUsername = function(username) {
  return this.findOne({ username: username.toLowerCase() });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
