import { Publisher, Subjects, TicketUpdatedEvent } from '@tickethub/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}