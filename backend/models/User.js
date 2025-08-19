const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  pin: {
    type: String,
    required: [true, 'PIN is required'],
    minlength: [4, 'PIN must be exactly 4 digits'],
    maxlength: [4, 'PIN must be exactly 4 digits'],
    match: [/^\d{4}$/, 'PIN must contain only numbers']
  }
}, {
  timestamps: true
});

// Hash PIN before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('pin')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.pin = await bcrypt.hash(this.pin, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare PIN method
userSchema.methods.comparePin = async function(candidatePin) {
  return bcrypt.compare(candidatePin, this.pin);
};

module.exports = mongoose.model('User', userSchema);