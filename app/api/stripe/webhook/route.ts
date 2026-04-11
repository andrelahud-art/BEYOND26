import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getStripe } from '@/lib/stripe/client';
import { Readable } from 'stream';

async function getRawBody(readable: Readable): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature') as string;

    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 });
    }

    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    const supabase = createAdminClient();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const bookingId = session.metadata?.bookingId;

        if (bookingId) {
          // Update booking payment status
          await supabase
            .from('bookings')
            .update({
              booking_status: 'confirmed',
              payment_status: 'captured',
              stripe_payment_intent_id: session.payment_intent,
              updated_at: new Date().toISOString(),
            })
            .eq('id', bookingId);

          // Log status change
          await supabase
            .from('booking_status_history')
            .insert({
              booking_id: bookingId,
              from_status: 'pending',
              to_status: 'confirmed',
              reason: 'Payment captured via Stripe',
            });
        }
        break;
      }

      case 'charge.failed': {
        const charge = event.data.object as any;
        // Handle failed payment
        console.log('Charge failed:', charge.id);
        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
