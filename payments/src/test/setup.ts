import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

declare global {
    namespace NodeJS {
        interface Global {
            signin(id?: string): Array<string>
        }
    }
}

jest.mock('../nats-wrapper');

dotenv.config();

let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = 'ckmb';

    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
});

beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for (const collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.signin = (id?: string) => {
    // Build a JWT payload. { id, email }
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    }

    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!)

    // Build session Object, { jwt: MY_JWT }
    const session = { jwt: token }

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // Take JSON & encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // returns a string thats the cookie with encoded data (express=sess)
    return [`express:sess=${base64}`];
}