import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }
    try {
        await mongoose.connect('mongodb://tickets-mongo-srv:27017/tickets', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Tickets Service: Connected to MongoDB!!!')
    } catch (err) {
        console.error('Mongoose error => ', err);
    }

    app.listen(3000, () => {
        console.log('Tickets Service: Listening on port 3000!')
    });

};

start();