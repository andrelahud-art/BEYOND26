import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/server';
import { getStripe } from '@/lib/stripe/client';

/**
 * POST /api/stripe/checkout
 * Create a Stripe Checkout Session for a booking
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { bookingId } = await request.json();
    if (!bookingId) return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 });

    const supabase = createClient();

    // Fetch booking
    const { data: booking } = await supabase
      .from('bookings')
      .select('*, service_offerings(title), companion_profiles(display_name)')
      .eq('id', bookingId)
      .single();

    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    if (booking.traveler_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const stripe = getStripe();

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${booking.service_offerings?.title || 'Companion service'} with ${booking.companion_profiles?.display_name}`,
              description: `${booking.start_at.substring(0, 10)} • ${booking.group_size} traveler${booking.group_size > 1 ? 's' : ''}`,
            },
            unit_amount: Math.round(booking.total_charged * 100), // cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/traveler/bookings/${bookingId}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/traveler`,
      metadata: {
        bookingId,
        travelerId: user.id,
        companionId: booking.companion_id,
      },
    });

    // Update booking with session ID
    await supabase
      .from('bookings')
      .update({
        stripe_checkout_session_id: session.id,
        payment_status: 'pending',
      })
      .eq('id', bookingId);

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
