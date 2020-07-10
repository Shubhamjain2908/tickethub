import { OrderStatus } from '@tickethub/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';

it('returns a 404 when purchasing an order that does not exist', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'asldjalsd',
            orderId: mongoose.Types.ObjectId().toHexString()
        })
        .expect(404);
});

it('returns a 401 when purchasing an order that does not belong to the user', async () => {
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        price: 12,
        status: OrderStatus.Created,
        userId: mongoose.Types.ObjectId().toHexString(),
        version: 0
    });
    await order.save();
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'asldjalsd',
            orderId: order.id
        })
        .expect(401);
});