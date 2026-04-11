import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/server';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = createClient();

    // Fetch booking
    const { data: booking } = await supabase
      .from('bookings')
      .select('companion_id, booking_status')
      .eq('id', params.id)
      .single();

    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Verify companion owns this booking
    const { data: companion } = await supabase
      .from('companion_profiles')
      .select('user_id')
      .eq('id', booking.companion_id)
      .single();

    if (!companion || companion.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update booking to confirmed
    const { data: updated, error } = await supabase
      .from('bookings')
      .update({
        booking_status: 'confirmed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    // Log status change
    await supabase
      .from('booking_status_history')
      .insert({
        booking_id: params.id,
        from_status: 'pending',
        to_status: 'confirmed',
        changed_by: user.id,
      });

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
