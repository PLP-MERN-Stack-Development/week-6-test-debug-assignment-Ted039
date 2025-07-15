const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/app');
const User = require('../../src/models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('POST /api/users/signup', () => {
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/users/signup')
      .send({
        name: 'Test User',
        email: 'user@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe('user@example.com');
  });

  it('should prevent duplicate email signup', async () => {
    await User.create({ name: 'Already Exists', email: 'dupe@example.com', password: '12345' });

    const res = await request(app)
      .post('/api/users/signup')
      .send({
        name: 'New User',
        email: 'dupe@example.com',
        password: 'newpass'
      });

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('error');
  });

  it('should validate missing email', async () => {
    const res = await request(app)
      .post('/api/users/signup')
      .send({ name: 'No Email', password: 'pass' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

describe('POST /api/users/login', () => {
  beforeEach(async () => {
    await request(app)
      .post('/api/users/signup')
      .send({ name: 'Login User', email: 'login@example.com', password: 'password123' });
  });

  it('should return token on successful login', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'login@example.com', password: 'password123' });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should reject invalid credentials', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'login@example.com', password: 'wrongpass' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});
