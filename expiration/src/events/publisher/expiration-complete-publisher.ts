import { ExpirationCompleteEvent, Publisher, Subjects } from '@tickethub/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}