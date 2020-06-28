import nats from 'node-nats-streaming';

console.clear();

// Connecting using port-forwarding: kubectl port-forward POD_NAME PORT_ON_LOCAL:PORT_ON_POD
const stan = nats.connect('tickethub', 'abc', {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Publisher connected to NATS');

    // NATS only recieves raw JSON data
    const data = JSON.stringify({
        id: '123',
        title: 'concert',
        price: 20
    });

    stan.publish('ticket:created', data, () => {
        console.log('Created Event published');
    });
});