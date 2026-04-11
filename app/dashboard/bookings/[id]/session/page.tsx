import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Clock, MapPin } from 'lucide-react';
import SessionCheckIn from '@/components/SessionCheckIn';
import SessionCheckOut from '@/components/SessionCheckOut';

export default async function SessionPage({
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
      start_at,
      end_at,
      meeting_point_name,
      service_offerings(title, duration_minutes)
    `
    )
    .eq('id', params.id)
    .single();

  if (!booking) {
    notFound();
  }

  // Fetch companion info to check access
  let companionUserId: string | null = null;
  if (booking.companion_id) {
    const { data: profile } = await supabase
      .from('companion_profiles')
      .select('user_id')
      .eq('id', booking.companion_id)
      .single();
    companionUserId = profile?.user_id || null;
  }

  const isTraveler = booking.traveler_id === user.id;
  const isCompanion = companionUserId === user.id;

  if (!isTraveler && !isCompanion) {
    redirect('/');
  }

  // Fetch safety session
  const { data: session } = await supabase
    .from('safety_sessions')
    .select('*')
    .eq('booking_id', booking.id)
    .single();

  const now = new Date();
  const startTime = new Date(booking.start_at);
  const endTime = new Date(booking.end_at);

  const isSessionActive = now >= startTime && now <= endTime;
  const isSessionCompleted = now > endTime;
  const isCheckedIn = session?.checkin_at !== null;
  const isCheckedOut = session?.checkout_at !== null;

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">{booking.service_offerings?.title}</h1>
        <p className="mt-2 text-muted-foreground">Session management</p>
      </div>

      {/* Timeline */}
      <Card className="mb-8 p-6">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isCheckedIn ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
              {isCheckedIn ? '✓' : '1'}
            </div>
            <div className="flex-1">
              <p className="font-medium">Check-in</p>
              <p className="text-sm text-muted-foreground">
                {isCheckedIn
                  ? `Checked in: ${new Date(session.checkin_at).toLocaleTimeString()}`
                  : `Starts: ${startTime.toLocaleTimeString()}`}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isCheckedOut ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
              {isCheckedOut ? '✓' : '2'}
            </div>
            <div className="flex-1">
              <p className="font-medium">Check-out</p>
              <p className="text-sm text-muted-foreground">
                {isCheckedOut
                  ? `Checked out: ${new Date(session.checkout_at).toLocaleTimeString()}`
                  : `Ends: ${endTime.toLocaleTimeString()}`}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Status message */}
      {isSessionCompleted && !isCheckedOut && (
        <div className="mb-8 flex gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-yellow-600" />
          <div>
            <p className="font-medium text-yellow-900">Session ended</p>
            <p className="text-sm text-yellow-800">Please check out to complete the session.</p>
          </div>
        </div>
      )}

      {/* Check-in section */}
      {!isCheckedIn && !isSessionCompleted && (
        <SessionCheckIn
          bookingId={booking.id}
          startTime={booking.start_at}
          meetingPoint={booking.meeting_point_name}
        />
      )}

      {/* Active session */}
      {isCheckedIn && !isCheckedOut && (
        <Card className="p-6">
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
            <h2 className="mt-3 text-xl font-semibold">Session in progress</h2>
            <p className="mt-1 text-muted-foreground">
              Duration: {booking.service_offerings?.duration_minutes ? `${booking.service_offerings.duration_minutes / 60} hours` : 'TBD'}
            </p>

            {isSessionCompleted && (
              <div className="mt-6">
                <SessionCheckOut bookingId={booking.id} />
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Completed session */}
      {isCheckedOut && (
        <Card className="p-6 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
          <h2 className="mt-3 text-xl font-semibold">Session completed</h2>
          <p className="mt-1 text-muted-foreground">
            Checked out at {new Date(session.checkout_at).toLocaleTimeString()}
          </p>

          {isTraveler && !session.review_submitted && (
            <a href={`/dashboard/bookings/${booking.id}/review`} className="mt-6 inline-block">
              <Button>Leave a review</Button>
            </a>
          )}
        </Card>
      )}

      {/* Location */}
      <div className="mt-8 rounded-lg border border-border p-4">
        <div className="flex gap-2">
          <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <div>
            <p className="font-medium">Meeting point</p>
            <p className="text-muted-foreground">{booking.meeting_point_name}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
