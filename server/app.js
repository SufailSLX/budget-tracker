const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const transactionRoutes = require('./routes/transactions');
const notificationRoutes = require('./routes/notifications');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    success: false
  }
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const connectDB = async () => {
  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('📍 MongoDB URI:', process.env.MONGODB_URI ? 'URI loaded successfully' : 'URI not found');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'credit-tracker'
    });
    
    console.log('✅ Connected to MongoDB successfully');
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🌐 Host: ${conn.connection.host}:${conn.connection.port}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('🔍 Full error:', error);
    process.exit(1);
  }
};

// Connect to database
connectDB();
.then(() => {
  console.log('✨ Connected to MongoDB successfully');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Backend is running smoothly',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('❌ Error:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Something went wrong on our end',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🌟 Server running on port ${PORT}`);
  console.log(`🔗 API available at http://localhost:${PORT}/api`);
});

module.exports = app;