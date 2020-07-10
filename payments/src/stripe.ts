import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_ENV!, {
    apiVersion: '2020-03-02'
});
