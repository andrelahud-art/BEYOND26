import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/server';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = createClient();

    // Update booking to in_progress → completed
    const { data: booking } = await supabase
      .from('bookings')
      .select('booking_status')
      .eq('id', params.id)
      .single();

    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Update session checkout
    await supabase
      .from('safety_sessions')
      .update({
        checkout_at: new Date().toISOString(),
        checkout_method: 'mutual_confirm',
      })
      .eq('booking_id', params.id);

    // Move booking to completed
    const { data: updated } = await supabase
      .from('bookings')
      .update({
        booking_status: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    // Log status change
    await supabase
      .from('booking_status_history')
      .insert({
        booking_id: params.id,
        from_status: 'in_progress',
        to_status: 'completed',
        changed_by: user.id,
      });

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
