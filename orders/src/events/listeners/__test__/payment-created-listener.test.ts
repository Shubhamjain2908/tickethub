import { PaymentCreatedEvent } from '@tickethub/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order, OrderStatus } from '../../../models/order';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { PaymentCreatedListener } from '../payment-created-listener';

const setup = async () => {
    const listener = new PaymentCreatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });
    await ticket.save();

    const order = Order.build({
        expiresAt: new Date(),
        status: OrderStatus.Created,
        userId: 'asdasd',
        ticket: ticket
    });
    await order.save();

    const data: PaymentCreatedEvent['data'] = {
        id: 'asdas',
        orderId: order.id,
        stripeId: 'adsasd'
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, order, data, msg };
};


it('updates the order status to complete', async () => {
    const { listener, order, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Complete);
});

it('ack the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});