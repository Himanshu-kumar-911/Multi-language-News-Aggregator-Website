# News Aggregator Backend API

A Node.js/Express backend API for the Multi-language News Aggregator application with MongoDB integration and JWT authentication.

## Features

- 🔐 JWT-based authentication (register, login, logout)
- 👤 User profile management
- 🗄️ MongoDB database integration
- 🛡️ Security middleware (Helmet, CORS, Rate limiting)
- ✅ Input validation
- 🌐 Multi-language support
- 📰 News API endpoints (placeholder for integration)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp env.example .env
   ```

4. Configure your `.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/news-aggregator
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in your .env file).

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /register` - Register a new user
- `POST /login` - Login user
- `POST /logout` - Logout user
- `GET /profile` - Get current user profile (requires authentication)
- `PUT /profile` - Update user profile (requires authentication)
- `GET /verify` - Verify JWT token (requires authentication)

### News Routes (`/api/news`)

- `GET /` - Get all news articles
- `GET /category/:category` - Get news by category
- `GET /search?q=query` - Search news articles

### Admin Routes (`/api/admin`) - Requires Admin Authentication

- `GET /users` - Get all users with pagination and filtering
- `GET /users/:id` - Get specific user details
- `PUT /users/:id/role` - Update user role and permissions
- `PUT /users/:id/status` - Update user account status
- `DELETE /users/:id` - Delete user (super admin only)
- `GET /stats` - Get user statistics
- `GET /admins` - Get all admin users
- `POST /users/:id/unlock` - Unlock locked user account

### Health Check

- `GET /api/health` - API health status

## API Usage Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "preferredLanguage": "en"
  }'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "john@example.com",
    "password": "password123"
  }'
```

### Get User Profile (with authentication)
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "superadmin",
    "password": "Admin123!@#"
  }'
```

### Get All Users (Admin only)
```bash
curl -X GET "http://localhost:5000/api/admin/users?page=1&limit=10" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

### Update User Role (Admin only)
```bash
curl -X PUT http://localhost:5000/api/admin/users/USER_ID/role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{
    "role": "admin",
    "permissions": ["manage_news", "moderate_content"]
  }'
```

## Database Schema

### User Model
- `username` - Unique username
- `email` - Unique email address
- `password` - Hashed password
- `firstName` - User's first name
- `lastName` - User's last name
- `preferredLanguage` - User's preferred language
- `favoriteCategories` - Array of favorite news categories
- `isEmailVerified` - Email verification status
- `lastLogin` - Last login timestamp
- `accountStatus` - Account status (active, suspended, deleted)
- `role` - User role (user, admin, superadmin)
- `permissions` - Array of specific permissions
- `lastActive` - Last activity timestamp
- `loginAttempts` - Number of failed login attempts
- `lockUntil` - Account lock expiration timestamp
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting (100 requests per 15 minutes per IP)
- CORS protection
- Helmet security headers
- Input validation and sanitization
- SQL injection protection (MongoDB)
- Account locking after failed login attempts
- Role-based access control (RBAC)
- Permission-based authorization

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/news-aggregator` |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional validation errors
}
```

## Development Notes

- The news endpoints currently return mock data
- To integrate with real news APIs, update the `/routes/news.js` file
- Add more validation rules as needed
- Consider adding email verification for production use
- Implement password reset functionality if needed

## License

MIT
