import request from 'supertest';
import app from '../src/app';
import User from '../src/model/userModel';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcrypt';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    // await mongoose.connect(mongoUri);
});

afterAll(async () => {
    // await mongoose.disconnect();
    await mongoServer.stop();
    await mongoose.connection.close();
});

beforeEach(async () => {
    // Clear the users collection before each test
    await User.deleteMany({});
});

// describe('POST /auth/signup', () => {
//     it('should create a new user', async () => {
//         const res = await request(app)
//             .post('/auth/signup')
//             .send({
//                 name: 'test',
//                 password: 'test'
//             });
//         expect(res.statusCode).toEqual(200);
//         expect(res.body).toHaveProperty('message', 'User Registered succesfully');
//     });
// });
describe('POST /auth/signup', () => {
    it('should create a new user', async () => {
        // First, let's create a user with the name 'test' to simulate an existing user
        await User.create({
            name: 'test',
            password: 'test'
        });

        // Attempt to signup with the same credentials
        const res = await request(app)
            .post('/auth/signup')
            .send({
                name: 'test',
                password: 'test'
            });

        // Expect a status code of 409 for conflict
        expect(res.statusCode).toEqual(409);
        expect(res.body).toHaveProperty('message', 'User already exists');
    });
});

describe('POST /auth/login', () => {
    it('should login a user', async () => {
        // Create a user with hashed password for testing
        const hashedPassword = await bcrypt.hash('test', 10);
        await User.create({
            name: 'test',
            password: hashedPassword
        });

        // Send a login request with correct credentials
        const res = await request(app)
            .post('/auth/login')
            .send({
                name: 'test',
                password: 'test' // Sending the plain password for testing
            });

        // Assert the response
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Login Successful');
        expect(res.headers['set-cookie']).toBeDefined(); // Ensure cookies are set
        // Additional assertions for the presence of user_id cookie or JWT token in cookies if needed
    });
});
