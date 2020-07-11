import mongoose from 'mongoose';

// Build 
interface PaymentAttrs {
    orderId: string;
    stripeId: string;
}

// Payment object Has 
interface PaymentDoc extends mongoose.Document {
    orderId: string;
    stripeId: string;
}

// List of properties that model itself contained (take PaymentAtts & returns PaymentDoc)
interface PaymentModel extends mongoose.Model<PaymentDoc> {
    build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true
        },
        stripeId: {
            type: String,
            required: true
        },
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

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
    return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', paymentSchema);

export { Payment };

