import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/server';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = createClient();

    // Verify companion owns this booking
    const { data: booking } = await supabase
      .from('bookings')
      .select('companion_id, booking_status')
      .eq('id', params.id)
      .single();

    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });

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
