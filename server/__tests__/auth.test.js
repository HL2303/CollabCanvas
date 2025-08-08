// server/__tests__/auth.test.js

// Load environment variables for the test environment
require('dotenv').config({ path: './.env' });

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/users');
const authRoutes = require('../routes/auth');

// --- Test Setup ---
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Connect to a temporary in-memory database before all tests
beforeAll(async () => {
  // For simplicity here, we'll connect to a separate test database in Atlas.
  const testMongoUri = process.env.MONGO_URI.replace('/collab-canvas', '/collab-canvas-test');
  await mongoose.connect(testMongoUri);
});

// Clear the User collection before each test to ensure a clean slate
beforeEach(async () => {
  await User.deleteMany({});
});

// Disconnect from the database after all tests are done
afterAll(async () => {
  await mongoose.connection.close();
});

// --- Test Suite for Auth Routes ---
describe('Auth Routes', () => {
  
  // Test case for successful user registration
  it('should register a new user successfully', async () => {
    const newUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    const res = await request(app)
      .post('/api/auth/register')
      .send(newUser);

    expect(res.statusCode).toEqual(201);
    expect(res.body.msg).toBe('User registered successfully');

    const savedUser = await User.findOne({ email: 'test@example.com' });
    expect(savedUser).not.toBeNull();
    expect(savedUser.username).toBe('testuser');
  });

  // Test case for trying to register a user that already exists
  it('should fail to register a user with a duplicate username', async () => {
    const existingUser = new User({ username: 'existinguser', email: 'existing@example.com', password: 'password123' });
    await existingUser.save();
    
    const duplicateUser = {
      username: 'existinguser',
      email: 'newemail@example.com',
      password: 'password123',
    };

    const res = await request(app)
      .post('/api/auth/register')
      .send(duplicateUser);

    expect(res.statusCode).toEqual(400);
    expect(res.body.msg).toBe('Username already exists');
  });
});
