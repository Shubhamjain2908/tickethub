import { TicketUpdatedEvent } from '@tickethub/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated-listener';

const setup = async () => {
    // create an instance of the listener
    const listener = new TicketUpdatedListener(natsWrapper.client);

    // Create & save a ticket
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        price: 100,
        title: 'concert'
    });
    await ticket.save();

    // create a fake data event
    const data: TicketUpdatedEvent['data'] = {
        version: ticket.version + 1,
        id: ticket.id,
        price: 10,
        title: 'new concert',
        userId: new mongoose.Types.ObjectId().toHexString()
    }

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, ticket, data, msg };
}

it('finds, updates & saves a ticket', async () => {
    const { listener, ticket, data, msg } = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure ticket was created!
    const updatedTicket = await Ticket.findById(ticket.id);
    // const ticket = await Ticket.findById(data.id);

    expect(updatedTicket).toBeDefined();
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure ack funciton is called
    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
    const { listener, ticket, data, msg } = await setup();

    data.version = 10;

    try {
        await listener.onMessage(data, msg);
    } catch (error) {

    }

    expect(msg.ack).not.toHaveBeenCalled();
});