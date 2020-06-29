import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';


console.clear();

// Connecting using port-forwarding: kubectl port-forward POD_NAME PORT_ON_LOCAL:PORT_ON_POD
const stan = nats.connect('tickethub', 'abc', {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Publisher connected to NATS');

    const publisher = new TicketCreatedPublisher(stan);
    publisher.publish({
        id: '123',
        title: 'concert',
        price: 20
    });
});