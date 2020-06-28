import nats from 'node-nats-streaming';

console.clear();

// Connecting using port-forwarding: kubectl port-forward POD_NAME PORT_ON_LOCAL:PORT_ON_POD
const stan = nats.connect('tickethub', '123', {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Listener connected to NATS');

    const subscription = stan.subscribe('ticket:created');

    subscription.on('message', (msg) => {
        console.log('Message recieved');
    });
});