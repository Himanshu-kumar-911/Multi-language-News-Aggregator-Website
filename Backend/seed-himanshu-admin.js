#!/usr/bin/env node

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

// Load environment variables
dotenv.config();

const createHimanshuAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/news-aggregator', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'himanshu@gmail.com' });
    if (existingUser) {
      console.log('⚠️  User already exists with this email:', existingUser.email);
      console.log('   Current role:', existingUser.role);
      
      // Update existing user to admin role
      existingUser.role = 'superadmin';
      existingUser.permissions = [
        'manage_users',
        'manage_news',
        'manage_categories',
        'view_analytics',
        'manage_settings',
        'moderate_content'
      ];
      existingUser.accountStatus = 'active';
      existingUser.isEmailVerified = true;
      
      // Update password
      const salt = await bcrypt.genSalt(12);
      existingUser.password = await bcrypt.hash('himanshu@123', salt);
      
      await existingUser.save();
      
      console.log('🎉 User updated to super admin successfully!');
      console.log('📧 Email:', existingUser.email);
      console.log('👤 Username:', existingUser.username);
      console.log('🔑 Password: himanshu@123');
      console.log('👑 Role:', existingUser.role);
      console.log('🔐 Permissions:', existingUser.permissions.join(', '));
      
      process.exit(0);
    }

    // Create new super admin user with your credentials
    const himanshuAdminData = {
      username: 'himanshu',
      email: 'himanshu@gmail.com',
      password: 'himanshu@123',
      firstName: 'Himanshu',
      lastName: 'Admin',
      preferredLanguage: 'en',
      role: 'superadmin',
      permissions: [
        'manage_users',
        'manage_news',
        'manage_categories',
        'view_analytics',
        'manage_settings',
        'moderate_content'
      ],
      isEmailVerified: true,
      accountStatus: 'active'
    };

    const himanshuAdmin = new User(himanshuAdminData);
    await himanshuAdmin.save();

    console.log('🎉 Himanshu admin created successfully!');
    console.log('📧 Email:', himanshuAdmin.email);
    console.log('👤 Username:', himanshuAdmin.username);
    console.log('🔑 Password: himanshu@123');
    console.log('👑 Role:', himanshuAdmin.role);
    console.log('🔐 Permissions:', himanshuAdmin.permissions.join(', '));

    console.log('\n✅ Database seeding completed!');
    console.log('\nYou can now:');
    console.log('1. Login with: himanshu@gmail.com / himanshu@123');
    console.log('2. Access admin dashboard at: http://localhost:5173/#admin-dashboard');
    console.log('3. Manage users and view statistics');

  } catch (error) {
    console.error('❌ Error creating Himanshu admin user:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

// Run the seeding function
createHimanshuAdminUser();
