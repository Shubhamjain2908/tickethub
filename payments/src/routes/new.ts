import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@tickethub/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Order } from '../models/order';
import { stripe } from '../stripe';

const router = express.Router();

router.post(
    '/api/payments',
    requireAuth,
    [
        body('token').not().isEmpty().withMessage('Token is required'),
        body('orderId').not().isEmpty().withMessage('OrderId is required'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { token, orderId } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            throw new NotFoundError();
        }
        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }
        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError('Cannot pay for an cancelled order');
        }

        // Used for Indian Transactions: description & shipping mandatory
        const options = {
            description: 'Software development services',
            shipping: {
                name: 'Shubham Jain',
                address: {
                    line1: '510 Townsend St',
                    postal_code: '98140',
                    city: 'San Francisco',
                    state: 'CA',
                    country: 'US',
                },
            },
        };

        await stripe.charges.create({
            currency: 'usd',
            amount: order.price,
            source: token,
            ...options
        });

        res.status(201).send({ success: true });
    }
);

export { router as createChargeRouter };

