import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@tickethub/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Order } from '../models/order';
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
        // Run query to look all orders. FInd an order where the ticket 
        // is the ticket we just found *and* the orders status is *not* cancelled.
        // If we find an order from that menas the ticket *is* reserved
        const existingOrder = await Order.findOne({
            ticket: ticket,
            status: {
                $in: [
                    OrderStatus.Created,
                    OrderStatus.AwaitingPayment,
                    OrderStatus.Complete
                ]
            }
        });
        if (existingOrder) {
            throw new BadRequestError('Ticket is already reserved');
        }

        // Caclulate an expiration date of this order

        // Build the order & save it to the database

        // Publish an evemt saying that an order was created
        res.send({});
    }
);

export { router as newOrderRouter };

