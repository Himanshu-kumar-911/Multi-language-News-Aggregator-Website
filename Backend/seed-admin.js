#!/usr/bin/env node

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

// Load environment variables
dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/news-aggregator', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: 'superadmin' });
    if (existingSuperAdmin) {
      console.log('⚠️  Super admin already exists:', existingSuperAdmin.email);
      console.log('   Username:', existingSuperAdmin.username);
      console.log('   Role:', existingSuperAdmin.role);
      process.exit(0);
    }

    // Create super admin user
    const superAdminData = {
      username: 'superadmin',
      email: 'admin@newsaggregator.com',
      password: 'Admin123!@#',
      firstName: 'Super',
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

    const superAdmin = new User(superAdminData);
    await superAdmin.save();

    console.log('🎉 Super admin created successfully!');
    console.log('📧 Email:', superAdmin.email);
    console.log('👤 Username:', superAdmin.username);
    console.log('🔑 Password:', superAdminData.password);
    console.log('👑 Role:', superAdmin.role);
    console.log('🔐 Permissions:', superAdmin.permissions.join(', '));
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');

    // Create regular admin user
    const adminData = {
      username: 'admin',
      email: 'moderator@newsaggregator.com',
      password: 'Moderator123!',
      firstName: 'Regular',
      lastName: 'Admin',
      preferredLanguage: 'en',
      role: 'admin',
      permissions: [
        'manage_news',
        'moderate_content',
        'view_analytics'
      ],
      isEmailVerified: true,
      accountStatus: 'active'
    };

    const admin = new User(adminData);
    await admin.save();

    console.log('\n🎉 Regular admin created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('👤 Username:', admin.username);
    console.log('🔑 Password:', adminData.password);
    console.log('👑 Role:', admin.role);
    console.log('🔐 Permissions:', admin.permissions.join(', '));

    console.log('\n✅ Database seeding completed!');
    console.log('\nYou can now:');
    console.log('1. Login with super admin credentials');
    console.log('2. Create more admin users through the API');
    console.log('3. Manage user roles and permissions');

  } catch (error) {
    console.error('❌ Error creating admin users:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

// Run the seeding function
createAdminUser();
