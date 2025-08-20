const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const connectDB = async () => {
  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('📍 MongoDB URI:', process.env.MONGODB_URI ? 'URI loaded successfully' : 'URI not found');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
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

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Backend is running smoothly',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
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

1. when user click the 