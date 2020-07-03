import mongoose from 'mongoose';

interface TicketAttrs {
    title: string;
    price: number;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
}

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                ret._id = undefined;
            }
        }
    }
);


ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };

