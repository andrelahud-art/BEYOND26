/**
 * Stripe server client (lazy). Only instantiated when a Stripe key is present
 * so that local dev / preview builds without Stripe keys don't crash.
 */
import 'server-only';
import Stripe from 'stripe';

let stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (stripe) return stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('Missing STRIPE_SECRET_KEY');
  }
  stripe = new Stripe(key, {
    apiVersion: '2024-06-20',
    typescript: true,
    appInfo: { name: 'BEYON26', version: '0.1.0' },
  });
  return stripe;
}

export const STRIPE_ENABLED = Boolean(process.env.STRIPE_SECRET_KEY);
