# Admin Setup and Testing Guide

## Overview
This guide explains how to set up and test the admin functionality in the Multi-language News Aggregator Website.

## Features Implemented

### 1. Database Integration
- ✅ User registration now saves data to MongoDB database
- ✅ Proper user model with admin roles and permissions
- ✅ Password hashing and security features

### 2. Admin Authentication
- ✅ Admin login page with role verification
- ✅ Admin dashboard with user management
- ✅ Role-based access control

### 3. Frontend Updates
- ✅ Updated registration form with first/last name fields
- ✅ Admin login option in register page
- ✅ Admin dashboard link in navbar for admin users
- ✅ Token-based authentication with backend API

## Setup Instructions

### 1. Backend Setup
```bash
cd Backend
npm install
```

### 2. Database Setup
Make sure MongoDB is running on your system, then create admin users:
```bash
node seed-admin.js
```

This will create:
- **Super Admin**: admin@newsaggregator.com / Admin123!@#
- **Regular Admin**: moderator@newsaggregator.com / Moderator123!

### 3. Start Backend Server
```bash
npm start
```
Server will run on http://localhost:5000

### 4. Frontend Setup
```bash
# In the root directory
npm install
npm run dev
```
Frontend will run on http://localhost:5173

## Testing the Complete Flow

### 1. Test User Registration
1. Go to http://localhost:5173/#register
2. Fill in the registration form with:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Password: password123
3. Click "Register"
4. Verify user is created in database and logged in

### 2. Test Admin Login
1. Go to http://localhost:5173/#admin-login
2. Login with admin credentials:
   - Email: admin@newsaggregator.com
   - Password: Admin123!@#
3. Verify admin dashboard loads with user statistics

### 3. Test Regular User Login
1. Go to http://localhost:5173/#login
2. Login with regular user credentials
3. Verify user can access normal features but not admin dashboard

### 4. Test Admin Dashboard
1. Login as admin
2. Navigate to admin dashboard
3. Verify you can see:
   - User statistics
   - Recent users list
   - Admin controls

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification
- `POST /api/auth/logout` - User logout

### Admin (Protected)
- `GET /api/admin/stats` - User statistics
- `GET /api/admin/users` - List users
- `PUT /api/admin/users/:id/role` - Update user role
- `PUT /api/admin/users/:id/status` - Update user status

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt
2. **JWT Tokens**: Secure token-based authentication
3. **Role-based Access**: Admin routes protected by middleware
4. **Input Validation**: All inputs validated on both frontend and backend
5. **Rate Limiting**: API endpoints protected against abuse

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure backend is running on port 5000
2. **Database Connection**: Ensure MongoDB is running
3. **Token Issues**: Clear localStorage and try logging in again
4. **Admin Access**: Make sure you're using the correct admin credentials

### Reset Admin Users
If you need to reset admin users:
```bash
cd Backend
node seed-admin.js
```

## File Structure

```
src/
├── pages/
│   ├── AdminLogin.jsx      # Admin login page
│   ├── AdminDashboard.jsx  # Admin dashboard
│   ├── Register.jsx        # Updated registration
│   └── Login.jsx           # User login
├── services/
│   └── authClient.js       # Backend API integration
├── components/
│   └── Navbar.jsx          # Updated with admin links
└── context/
    └── AppContext.jsx      # Updated with token verification

Backend/
├── models/
│   └── User.js             # User model with roles
├── routes/
│   ├── auth.js             # Authentication routes
│   └── admin.js            # Admin routes
├── middleware/
│   └── auth.js             # Authentication middleware
└── seed-admin.js           # Admin user creation script
```

## Next Steps

1. **Email Verification**: Add email verification for new users
2. **Password Reset**: Implement password reset functionality
3. **User Management**: Add more admin features for user management
4. **Audit Logs**: Add logging for admin actions
5. **Two-Factor Authentication**: Add 2FA for admin accounts
