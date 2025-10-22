# Admin Setup Instructions

## Your Admin Credentials
- **Email**: himanshu@gmail.com
- **Password**: himanshu@123
- **Role**: Super Admin

## Step 1: Start the Backend Server
```bash
cd Backend
npm install
npm start
```

## Step 2: Create Admin User in Database
```bash
# In the Backend directory, run:
node seed-himanshu-admin.js
```

This will create your admin user in the database with the credentials above.

## Step 3: Start the Frontend
```bash
# In the root directory:
npm install
npm run dev
```

## Step 4: Test Admin Login
1. Go to: http://localhost:5173/#admin-login
2. Enter:
   - Email: himanshu@gmail.com
   - Password: himanshu@123
3. Click "Sign in as Admin"
4. You should be redirected to the admin dashboard

## Step 5: Access Admin Dashboard
After successful login, you'll see:
- User statistics from your database
- List of all users
- Admin controls
- Your user information displayed

## Troubleshooting

### If Backend Won't Start:
- Make sure MongoDB is running
- Check if port 5000 is available
- Run `npm install` in Backend directory

### If Admin Login Fails:
- Make sure you ran the seed script: `node seed-himanshu-admin.js`
- Check browser console for errors
- Verify backend is running on port 5000

### If Database Connection Fails:
- Ensure MongoDB is running
- Check MongoDB connection string in Backend/.env file
- Default connection: mongodb://localhost:27017/news-aggregator

## What You'll See in Admin Dashboard:
- **Total Users**: Count of all users in database
- **Active Users**: Count of active users
- **Admin Users**: Count of admin/superadmin users
- **Recent Users Table**: List of users with their details
- **Your Info**: Your email and role displayed

The admin dashboard will show real data from your MongoDB database!
