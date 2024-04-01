import request from 'supertest';
import app from '../src/app';
import Todo from '../src/model/todoModel';
import User from '../src/model/userModel';
import jwt from 'jsonwebtoken';
import config from '../src/config/config';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let token: string;
let userId: string;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    // await mongoose.connect(mongoUri);

    const user = new User({
        name: 'test',
        password: 'test'
    });
    await user.save();

    userId = user._id;

    token = jwt.sign({ userId }, config.jwtSecret);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('POST /todo', () => {
    it('should create a new todo', async () => {
        const res = await request(app)
            .post('/user/todos')
            .set('Cookie', [`user_id=${userId}`, `token=${token}`])
            .send({
                title: 'tests',
                description: 'tests'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Todo Created Successfully');
    });

    it('should return "Todo already exists" if todo with same title already exists', async () => {
        // Create a todo with the same title
        await Todo.create({ title: 'test', description: 'existing todo',userId });

        const res = await request(app)
            .post('/user/todos')
            .set('Cookie', [`user_id=${userId}`, `token=${token}`])
            .send({
                title: 'test',
                description: 'new todo'
            });

        expect(res.statusCode).toEqual(409);
        expect(res.body).toHaveProperty('message', 'Todo already exists');
    });

    it('should return validation error if request body is invalid', async () => {
        const res = await request(app)
            .post('/user/todos')
            .set('Cookie', [`user_id=${userId}`, `token=${token}`])
            .send({
                // Invalid request body, missing required fields
            });

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error');
    });

    it('should return "User not found" if user associated with user_id cookie is not found', async () => {
        // Invalidate userId
        userId = mongoose.Types.ObjectId.createFromTime(Date.now()).toString();

        const res = await request(app)
            .post('/user/todos')
            .set('Cookie', [`user_id=${userId}`, `token=${token}`])
            .send({
                title: 'test',
                description: 'test'
            });

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'User not found');
    });

    it('should return internal server error if unexpected error occurs', async () => {
        // Invalidate token
        token = 'invalid_token';

        const res = await request(app)
            .post('/user/todos')
            .set('Cookie', [`user_id=${userId}`, `token=${token}`])
            .send({
                title: 'test',
                description: 'test'
            });

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message',"Token is not valid");
    });
});
