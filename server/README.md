# Credit Tracker Backend API

A robust and secure backend API for the Credit Tracker application built with Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication**: Complete registration flow with email OTP verification
- **Secure PIN System**: 4-digit PIN authentication with bcrypt hashing
- **Transaction Management**: Full CRUD operations for financial transactions
- **Analytics**: Monthly data and category breakdowns
- **Notifications**: Smart notification system with read/unread status
- **Email Service**: Beautiful HTML emails using Nodemailer
- **Data Validation**: Comprehensive input validation with express-validator
- **Security**: Rate limiting, CORS, helmet, and JWT authentication
- **MongoDB Integration**: Mongoose ODM with proper indexing

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Gmail account with App Password

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Configure environment variables:**
   Update the `.env` file with your credentials:
   ```env
   MONGODB_URI=mongodb+srv://webconnectslx:expensebySLX@cluster0.oexwtqz.mongodb.net/credit-tracker
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=cpqc jkmz qhue ktut
   ```

3. **Start the server:**
   ```bash
   npm run dev
   ```

## 🔗 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Start registration with email and name |
| POST | `/verify-otp` | Verify email with OTP code |
| POST | `/set-pin` | Set 4-digit PIN and complete registration |
| POST | `/login` | Login with email and PIN |
| POST | `/resend-otp` | Resend OTP code |
| GET | `/me` | Get current user info |

### User Routes (`/api/user`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile` | Get user profile |
| POST | `/savings-plan` | Calculate savings suggestions |
| POST | `/link-account` | Link third-party account |
| DELETE | `/unlink-account/:id` | Unlink account |
| GET | `/stats` | Get user statistics |
| PATCH | `/preferences` | Update user preferences |

### Transaction Routes (`/api/transactions`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all transactions (with filtering) |
| GET | `/:id` | Get single transaction |
| POST | `/` | Create new transaction |
| PUT | `/:id` | Update transaction |
| DELETE | `/:id` | Delete transaction |
| GET | `/analytics/monthly` | Get monthly analytics |
| GET | `/analytics/categories` | Get category breakdown |

### Notification Routes (`/api/notifications`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all notifications |
| PATCH | `/:id/read` | Mark notification as read |
| PATCH | `/mark-all-read` | Mark all as read |
| DELETE | `/:id` | Delete notification |
| POST | `/` | Create notification |
| GET | `/stats` | Get notification statistics |

## 📧 Email Templates

The backend includes beautiful HTML email templates for:

- **OTP Verification**: Secure 6-digit code with expiration
- **Welcome Email**: Onboarding message with feature highlights

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents abuse with configurable limits
- **Input Validation**: Comprehensive validation using express-validator
- **Password Hashing**: bcrypt with salt rounds for PIN security
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet**: Security headers for production

## 📊 Data Models

### User Model
```javascript
{
  fullName: String,
  email: String (unique),
  pin: String (hashed),
  isVerified: Boolean,
  otp: { code, expiresAt, attempts },
  linkedAccounts: Array,
  monthlyBudget: Number,
  savingsGoals: Array,
  preferences: Object
}
```

### Transaction Model
```javascript
{
  userId: ObjectId,
  title: String,
  amount: Number,
  type: 'credit' | 'expense',
  category: String,
  description: String,
  date: Date,
  tags: Array,
  attachments: Array
}
```

### Notification Model
```javascript
{
  userId: ObjectId,
  title: String,
  message: String,
  type: String,
  priority: 'low' | 'medium' | 'high',
  isRead: Boolean,
  actionUrl: String,
  metadata: Object
}
```

## 🚀 Deployment

The backend is ready for deployment on platforms like:
- Heroku
- Railway
- DigitalOcean
- AWS EC2

Make sure to:
1. Set environment variables in production
2. Use a strong JWT secret
3. Configure proper CORS origins
4. Enable MongoDB Atlas IP whitelist

## 🔧 Development

Start both frontend and backend:
```bash
npm run dev:full
```

Or run separately:
```bash
# Backend only
npm run dev:server

# Frontend only
npm run dev
```

## 📝 API Response Format

All API responses follow this consistent format:

```javascript
{
  "success": true|false,
  "message": "Human-readable message",
  "data": {}, // Response data (optional)
  "errors": [], // Validation errors (optional)
  "pagination": {} // Pagination info (optional)
}
```

## 🎯 Next Steps

1. **Update .env**: Add your actual Gmail credentials
2. **Test Registration**: Try the complete user flow
3. **Add Transactions**: Test CRUD operations
4. **Check Notifications**: Verify the notification system
5. **Deploy**: Choose your deployment platform

The backend is designed to be intuitive, secure, and scalable. Every endpoint provides thoughtful responses that make the user experience smooth and magical! ✨