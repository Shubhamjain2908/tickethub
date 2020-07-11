import { PaymentCreatedEvent, Publisher, Subjects } from '@tickethub/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}