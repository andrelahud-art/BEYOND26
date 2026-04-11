import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { threadId, content } = await request.json();

    if (!threadId || !content) {
      return NextResponse.json(
        { error: 'Missing threadId or content' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Verify user is participant in thread
    const { data: thread } = await supabase
      .from('message_threads')
      .select('booking_id')
      .eq('id', threadId)
      .single();

    if (!thread) {
      return NextResponse.json(
        { error: 'Thread not found' },
        { status: 404 }
      );
    }

    // Check if user is in this booking
    const { data: booking } = await supabase
      .from('bookings')
      .select('traveler_id, companion_id')
      .eq('id', thread.booking_id)
      .single();

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    const isTraveler = booking.traveler_id === user.id;
    const isCompanion = booking.companion_id?.toString() === user.id;

    if (!isTraveler && !isCompanion) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Create message
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        thread_id: threadId,
        sender_id: user.id,
        content,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(message);
  } catch (err) {
    console.error('Message error:', err);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
