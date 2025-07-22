const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const emailService = require('../utils/emailService');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateRegistration = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Full name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
];

const validateOTP = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('OTP must be exactly 6 digits')
];

const validatePIN = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('pin')
    .isLength({ min: 4, max: 4 })
    .isNumeric()
    .withMessage('PIN must be exactly 4 digits'),
  body('confirmPin')
    .isLength({ min: 4, max: 4 })
    .isNumeric()
    .withMessage('Confirm PIN must be exactly 4 digits')
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('pin')
    .isLength({ min: 4, max: 4 })
    .isNumeric()
    .withMessage('PIN must be exactly 4 digits')
];

// Helper function to generate JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Step 1: Register user and send OTP
router.post('/register', validateRegistration, async (req, res) => {
  try {
    console.log('🚀 Registration attempt:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { fullName, email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    console.log('🔍 Existing user check:', existingUser ? 'User exists' : 'New user');
    
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists'
        });
      }
      
      // User exists but not verified, resend OTP
      const otp = existingUser.generateOTP();
      console.log('🔄 Regenerating OTP for existing user:', otp);
      await existingUser.save();
      console.log('💾 User saved with new OTP');
      
      try {
        await emailService.sendOTP(email, fullName, otp);
        console.log('📧 OTP email sent successfully');
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError);
        return res.status(500).json({
          success: false,
          message: 'Failed to send verification email. Please try again.'
        });
      }
      
      return res.json({
        success: true,
        message: 'OTP sent to your email address',
        step: 'verify_otp'
      });
    }

    // Create new user
    const user = new User({
      fullName,
      email,
      pin: '0000' // Temporary PIN, will be set later
    });

    const otp = user.generateOTP();
    console.log('🆕 Generated OTP for new user:', otp);
    await user.save();
    console.log('💾 New user saved to database');

    // Send OTP email
    try {
      await emailService.sendOTP(email, fullName, otp);
      console.log('📧 OTP email sent successfully');
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      // Delete the user if email fails
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again.'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Registration initiated! Please check your email for the verification code.',
      step: 'verify_otp'
    });

  } catch (error) {
    console.error('❌ Registration error:', error.message);
    console.error('🔍 Full error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
});

// Step 2: Verify OTP
router.post('/verify-otp', validateOTP, async (req, res) => {
  try {
    console.log('🔐 OTP verification attempt:', { email: req.body.email, otp: req.body.otp });
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    console.log('👤 User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('❌ User not found for email:', email);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('🔍 User OTP data:', {
      storedOTP: user.otp?.code,
      providedOTP: otp,
      expiresAt: user.otp?.expiresAt,
      attempts: user.otp?.attempts,
      currentTime: new Date()
    });

    const otpResult = user.verifyOTP(otp);
    console.log('✅ OTP verification result:', otpResult);
    
    if (!otpResult.success) {
      await user.save(); // Save updated attempt count
      console.log('❌ OTP verification failed:', otpResult.message);
      return res.status(400).json({
        success: false,
        message: otpResult.message
      });
    }

    await user.save();
    console.log('✅ User verified and saved');

    res.json({
      success: true,
      message: 'Email verified successfully! Now create your secure PIN.',
      step: 'create_pin'
    });

  } catch (error) {
    console.error('❌ OTP verification error:', error.message);
    console.error('🔍 Full error:', error);
    res.status(500).json({
      success: false,
      message: 'Verification failed. Please try again.'
    });
  }
});

// Step 3: Set PIN and complete registration
router.post('/set-pin', validatePIN, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, pin, confirmPin } = req.body;

    if (pin !== confirmPin) {
      return res.status(400).json({
        success: false,
        message: 'PINs do not match'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Please verify your email first'
      });
    }

    user.pin = pin;
    await user.save();

    // Send welcome email
    await emailService.sendWelcomeEmail(email, user.fullName);

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Account created successfully! Welcome to Credit Tracker! 🎉',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('PIN setup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set PIN. Please try again.'
    });
  }
});

// Login
router.post('/login', validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, pin } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or PIN'
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email first'
      });
    }

    const isValidPin = await user.comparePin(pin);
    if (!isValidPin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or PIN'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful! Welcome back! ✨',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
});

// Resend OTP
router.post('/resend-otp', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'User is already verified'
      });
    }

    const otp = user.generateOTP();
    await user.save();

    await emailService.sendOTP(email, user.fullName, otp);

    res.json({
      success: true,
      message: 'New OTP sent to your email address'
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP. Please try again.'
    });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      createdAt: req.user.createdAt,
      monthlyBudget: req.user.monthlyBudget,
      linkedAccounts: req.user.linkedAccounts,
      preferences: req.user.preferences
    }
  });
});

module.exports = router;