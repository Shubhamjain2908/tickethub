import { Listener, OrderCreatedEvent, Subjects } from '@tickethub/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const { id, ticket: { id: ticketId } } = data;
        // Find the ticket that the order is reserving
        const ticket = await Ticket.findById(ticketId);

        // If no ticket, throw error
        if (!ticket) {
            throw new Error('Ticket not found');
        }

        // Mark the ticket as being reserved by setting its orderId property
        ticket.set({ orderId: id });

        // Save the ticket
        await ticket.save();

        // ack the message
        msg.ack();
    }
}