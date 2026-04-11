import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/server';
import { createBookingSchema } from '@/lib/validation/schemas';

/**
 * POST /api/bookings
 * Create a new booking request (pending state, awaiting companion acceptance)
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const data = createBookingSchema.parse(body);

    const supabase = createClient();

    // Calculate platform fee (15%)
    const platformFeePercent = 0.15;
    const companionPayout = data.basePrice * 0.85;
    const platformFee = data.basePrice * platformFeePercent;
    const totalCharged = data.basePrice + platformFee;

    // Create booking
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        traveler_id: user.id,
        companion_id: data.companionId,
        service_offering_id: data.serviceOfferingId,
        booking_status: 'pending',
        start_at: data.startAt,
        end_at: data.endAt,
        meeting_point_name: data.meetingPointName,
        meeting_point_lat: data.meetingPointLat,
        meeting_point_lng: data.meetingPointLng,
        meeting_point_instructions: data.meetingPointInstructions,
        zone_id: data.zoneId,
        group_size: data.groupSize,
        traveler_notes: data.travelerNotes,
        base_price: data.basePrice,
        platform_fee: platformFee,
        companion_payout: companionPayout,
        total_charged: totalCharged,
        currency: 'USD',
        payment_status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    // Create message thread
    await supabase
      .from('message_threads')
      .insert({ booking_id: booking.id });

    return NextResponse.json(booking, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}

/**
 * GET /api/bookings
 * Get bookings for current user
 */
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = createClient();
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .or(`traveler_id.eq.${user.id},companion_id.in(select id from companion_profiles where user_id = ${user.id})`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
