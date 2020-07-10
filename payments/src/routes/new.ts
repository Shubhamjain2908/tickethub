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

        await stripe.charges.create({
            currency: 'usd',
            amount: order.price * 100,
            source: token
        });

        res.status(201).send({});
    }
);

export { router as createChargeRouter };

