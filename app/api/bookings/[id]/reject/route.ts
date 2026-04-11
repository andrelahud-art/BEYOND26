import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const supabase = createClient();

    // Verify companion ownership
    const { data: booking } = await supabase
      .from('bookings')
      .select('companion_id')
      .eq('id', params.id)
      .single();

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Check if user is the companion
    const { data: companion } = await supabase
      .from('companion_profiles')
      .select('user_id')
      .eq('id', booking.companion_id)
      .single();

    if (!companion || companion.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Cancel the booking
    const { data: updated, error: updateError } = await supabase
      .from('bookings')
      .update({
        booking_status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Log status change
    await supabase
      .from('booking_status_history')
      .insert({
        booking_id: params.id,
        from_status: 'pending',
        to_status: 'cancelled',
        reason: body.reason || 'Companion declined',
        changed_by: user.id,
      });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('Decline error:', err);
    return NextResponse.json({ error: 'Failed to decline booking' }, { status: 400 });
  }
}
