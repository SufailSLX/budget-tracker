# Expense Tracker Backend

A robust backend API for the Expense Tracker application built with Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication**: Registration and login with PIN-based authentication
- **Transaction Management**: Full CRUD operations for financial transactions
- **MongoDB Integration**: Mongoose ODM with proper indexing
- **Data Validation**: Comprehensive input validation with express-validator
- **Security**: JWT authentication and bcrypt password hashing

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB database (local or cloud)

## 🛠️ Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Make sure you have `MONGODB_URI` in your `.env` file in the root directory:
   ```env
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret-key
   PORT=5000
   ```

4. **Start the server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔗 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user with name, email, and PIN |
| POST | `/login` | Login with email and PIN |

### Transaction Routes (`/api/transactions`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all transactions (with pagination and filtering) |
| POST | `/` | Create new transaction |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check server and database status |

## 📊 Data Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  pin: String (hashed),
  timestamps: true
}
```

### Transaction Model
```javascript
{
  userId: ObjectId,
  title: String,
  amount: Number,
  type: 'credit' | 'debit',
  category: String,
  description: String,
  date: Date,
  timestamps: true
}
```

## 🔧 Development

The backend server will run on `http://localhost:5000` by default.

You can test the API endpoints using tools like Postman or curl.

## 📝 API Response Format

All API responses follow this consistent format:

```javascript
{
  "success": true|false,
  "message": "Human-readable message",
  "data": {}, // Response data (optional)
  "errors": [] // Validation errors (optional)
}
```