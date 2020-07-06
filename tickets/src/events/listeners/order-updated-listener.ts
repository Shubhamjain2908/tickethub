import { Listener, OrderCancelledEvent, Subjects } from '@tickethub/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';

export class OrderUpdatedListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        // const ticket = await Ticket.findByEvent(data);

        // if (!ticket) {
        //     throw new Error('Ticket not found');
        // }

        // const { title, price } = data;
        // ticket.set({ title, price });
        // await ticket.save();

        msg.ack();
    }
}