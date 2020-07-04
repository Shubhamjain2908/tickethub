import { BadRequestError, NotFoundError, requireAuth, validateRequest } from '@tickethub/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.post('/api/orders',
    requireAuth,
    [
        body('ticketId')
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('TicketId must be provided')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { ticketId } = req.body;

        // Find the ticket the user is trying to order in the database
        const ticket = await Ticket.findById(ticketId)
        if (!ticket) {
            throw new NotFoundError();
        }

        // Make sure that the ticket is not served
        const isReserved = await ticket.isReserved();
        if (isReserved) {
            throw new BadRequestError('Ticket is already reserved');
        }

        // Caclulate an expiration date of this order

        // Build the order & save it to the database

        // Publish an evemt saying that an order was created
        res.send({});
    }
);

export { router as newOrderRouter };

