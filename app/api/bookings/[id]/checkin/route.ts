import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/server';
import { checkInSchema } from '@/lib/validation/schemas';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const data = checkInSchema.parse(body);

    const supabase = createClient();

    // Get or create safety session
    const { data: session } = await supabase
      .from('safety_sessions')
      .select('*')
      .eq('booking_id', params.id)
      .single();

    if (!session) {
      // Create safety session
      const { data: newSession } = await supabase
        .from('safety_sessions')
        .insert({
          booking_id: params.id,
          checkin_at: new Date().toISOString(),
          checkin_method: data.method,
          checkin_lat: data.lat,
          checkin_lng: data.lng,
        })
        .select()
        .single();

      return NextResponse.json(newSession);
    }

    // Update with check-in
    const { data: updated } = await supabase
      .from('safety_sessions')
      .update({
        checkin_at: new Date().toISOString(),
        checkin_method: data.method,
        checkin_lat: data.lat,
        checkin_lng: data.lng,
      })
      .eq('booking_id', params.id)
      .select()
      .single();

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
