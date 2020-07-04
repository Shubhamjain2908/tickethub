import { OrderCancelledEvent, Publisher, Subjects } from '@tickethub/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}