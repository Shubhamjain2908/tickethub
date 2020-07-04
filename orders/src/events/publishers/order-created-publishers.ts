import { OrderCreatedEvent, Publisher, Subjects } from '@tickethub/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}