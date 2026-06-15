import Stripe from 'stripe';
import { Env } from './env.config';

const stripeClient = new Stripe(Env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-02-25.clover"
})

export default stripeClient;
