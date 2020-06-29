import { randomBytes } from 'crypto';
import nats, { Message } from 'node-nats-streaming';

console.clear();

// Connecting using port-forwarding: kubectl port-forward POD_NAME PORT_ON_LOCAL:PORT_ON_POD
const stan = nats.connect('tickethub', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Listener connected to NATS');

    const options = stan
        .subscriptionOptions()
        .setManualAckMode(true);    // Set the mannual acknowledgement to true
    const subscription = stan.subscribe(
        'ticket:created',
        'order-service-queue-group',
        options
    );

    subscription.on('message', (msg: Message) => {
        const data = msg.getData();
        if (typeof data === 'string') {
            console.log(`Recieved event #${msg.getSequence()}, with data:`, JSON.parse(data));
        }

        msg.ack();
    });
});