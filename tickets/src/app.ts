import { currentUser, errorHandler, NotFoundError } from '@tickethub/common';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import 'express-async-errors';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';


const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test'    // Must be on https connection except on test env
    })
);
app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);

app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };

