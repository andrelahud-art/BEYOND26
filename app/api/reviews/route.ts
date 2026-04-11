import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/server';
import { submitReviewSchema } from '@/lib/validation/schemas';

/**
 * POST /api/reviews
 * Submit a review for a completed booking
 * Reviews are hidden until companion also reviews (14-day window)
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const data = submitReviewSchema.parse(body);

    const supabase = createClient();

    // Fetch booking
    const { data: booking } = await supabase
      .from('bookings')
      .select('id, traveler_id, companion_id, booking_status')
      .eq('id', data.bookingId)
      .single();

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Only travelers can submit reviews
    if (booking.traveler_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Booking must be completed or disputed
    if (!['completed', 'disputed'].includes(booking.booking_status)) {
      return NextResponse.json(
        { error: 'Booking must be completed to review' },
        { status: 400 }
      );
    }

    // Check if already reviewed
    const { data: existing } = await supabase
      .from('reviews')
      .select('id')
      .eq('booking_id', data.bookingId)
      .eq('reviewer_id', user.id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'You have already reviewed this booking' },
        { status: 400 }
      );
    }

    // Calculate auto-publish date (14 days from now)
    const autoPublishAt = new Date();
    autoPublishAt.setDate(autoPublishAt.getDate() + 14);

    // Get companion user ID to store in reviewee_id
    const { data: companionProfile } = await supabase
      .from('companion_profiles')
      .select('user_id')
      .eq('id', booking.companion_id)
      .single();

    if (!companionProfile) {
      return NextResponse.json(
        { error: 'Companion not found' },
        { status: 404 }
      );
    }

    // Create review
    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        booking_id: data.bookingId,
        reviewer_id: user.id,
        reviewee_id: companionProfile.user_id,
        reviewer_role: 'traveler',
        score_overall: data.scoreOverall,
        score_communication: data.scoreCommunication || null,
        score_punctuality: data.scorePunctuality || null,
        score_safety: data.scoreSafety || null,
        score_knowledge: data.scoreKnowledge || null,
        score_value: data.scoreValue || null,
        would_repeat: data.wouldRepeat || false,
        comment: data.comment || null,
        is_published: false,
        auto_publish_at: autoPublishAt.toISOString(),
        moderation_status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(review, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
