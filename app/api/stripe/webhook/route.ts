import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient as createServiceClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 * POST /api/stripe/webhook
 * Handle Stripe webhook events (payment completion, etc)
 */
export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      return NextResponse.json(
        { error: 'Webhook verification failed' },
        { status: 400 }
      );
    }

    // Use service role client for webhook (bypasses RLS)
    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId;

      if (!bookingId) {
        return NextResponse.json(
          { error: 'Missing bookingId in metadata' },
          { status: 400 }
        );
      }

      // Update booking to confirmed and payment captured
      const { data: booking, error: fetchError } = await supabase
        .from('bookings')
        .select('id, booking_status, start_at, end_at')
        .eq('id', bookingId)
        .single();

      if (fetchError || !booking) {
        console.error('Booking not found:', bookingId);
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
      }

      // Update booking status and payment status
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          booking_status: 'confirmed',
          payment_status: 'captured',
          updated_at: new Date().toISOString(),
        })
        .eq('id', bookingId);

      if (updateError) throw updateError;

      // Create safety session for confirmed booking
      await supabase
        .from('safety_sessions')
        .insert({
          booking_id: bookingId,
          status: 'pending_checkin',
          created_at: new Date().toISOString(),
        });

      // Log status change
      await supabase
        .from('booking_status_history')
        .insert({
          booking_id: bookingId,
          from_status: 'pending',
          to_status: 'confirmed',
          changed_by: 'stripe_webhook',
        });

      console.log(`Booking ${bookingId} confirmed via Stripe payment`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
