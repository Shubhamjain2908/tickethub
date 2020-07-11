import { OrderStatus } from '@tickethub/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { stripe } from '../../stripe';

jest.mock('../../stripe');

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


it('returns a 400 when purchasing a cancelled order', async () => {
    const userId = mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        price: 12,
        status: OrderStatus.Cancelled,
        userId,
        version: 0
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            token: 'asldjalsd',
            orderId: order.id
        })
        .expect(400);
});

it('returns a 201 with valida inputs', async () => {
    const userId = mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        price: 12,
        status: OrderStatus.Created,
        userId,
        version: 0
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            token: 'token_visa',    // token will work in test env
            orderId: order.id
        })
        .expect(201);

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    expect(chargeOptions.source).toEqual('token_visa');
    expect(chargeOptions.amount).toEqual(12 * 100);
    expect(chargeOptions.currency).toEqual('usd');
});