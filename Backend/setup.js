#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🚀 Setting up News Aggregator Backend...\n');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log('📝 Creating .env file from env.example...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created successfully!');
    console.log('⚠️  Please update the .env file with your actual configuration values.\n');
  } else {
    console.log('❌ env.example file not found. Please create a .env file manually.\n');
  }
} else {
  console.log('✅ .env file already exists.\n');
}

// Check if node_modules exists
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully!\n');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ Dependencies already installed.\n');
}

// Display next steps
console.log('🎉 Backend setup completed!\n');
console.log('Next steps:');
console.log('1. Update your .env file with your MongoDB URI and JWT secret');
console.log('2. Make sure MongoDB is running (local or Atlas)');
console.log('3. Seed admin users: npm run seed');
console.log('4. Start the development server: npm run dev');
console.log('5. The API will be available at http://localhost:5000\n');

console.log('📚 API Documentation:');
console.log('- Health check: GET http://localhost:5000/api/health');
console.log('- Register: POST http://localhost:5000/api/auth/register');
console.log('- Login: POST http://localhost:5000/api/auth/login');
console.log('- Profile: GET http://localhost:5000/api/auth/profile (requires auth)\n');

console.log('🔧 Available scripts:');
console.log('- npm run dev: Start development server with nodemon');
console.log('- npm start: Start production server');
console.log('- npm test: Run API tests');
console.log('- npm seed: Create admin users');
console.log('- npm setup: Run this setup script\n');
