import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import ReviewForm from '@/components/ReviewForm';

export default async function BookingReviewPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/sign-in');

  const supabase = createClient();

  // Fetch booking
  const { data: booking } = await supabase
    .from('bookings')
    .select(
      `
      id,
      traveler_id,
      companion_id,
      booking_status,
      service_offerings(title),
      companion_profiles(display_name, user_id),
      users(full_name)
    `
    )
    .eq('id', params.id)
    .single();

  if (!booking) {
    notFound();
  }

  // Only travelers can review
  if (booking.traveler_id !== user.id) {
    redirect('/');
  }

  // Must be completed or disputed
  if (!['completed', 'disputed'].includes(booking.booking_status)) {
    notFound();
  }

  // Check if already reviewed
  const { data: existingReview } = await supabase
    .from('reviews')
    .select('id')
    .eq('booking_id', booking.id)
    .eq('reviewer_id', user.id)
    .single();

  if (existingReview) {
    // Redirect to view existing review
    redirect(`/dashboard/bookings/${booking.id}`);
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Leave a review</h1>
        <p className="mt-2 text-muted-foreground">
          Share your experience with {booking.companion_profiles?.display_name}
        </p>
      </div>

      <Card className="p-8">
        <div className="mb-6 flex items-center gap-4 rounded-lg bg-muted/50 p-4">
          <div>
            <p className="font-medium">{booking.service_offerings?.title}</p>
            <p className="text-sm text-muted-foreground">
              With {booking.companion_profiles?.display_name}
            </p>
          </div>
        </div>

        <ReviewForm
          bookingId={booking.id}
          companionId={booking.companion_id}
        />
      </Card>

      <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> Your review will be hidden until the companion
          also leaves a review, then both will be published together. This
          ensures fair and honest feedback from both sides.
        </p>
      </div>
    </main>
  );
}
