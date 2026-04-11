import { requireRole } from '@/lib/utils/permissions';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, MapPin, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';

export default async function CompanionDashboardPage() {
  const user = await requireRole('traveler'); // Note: companions still use traveler role for now
  const supabase = createClient();

  // Get companion profile
  const { data: profile } = await supabase
    .from('companion_profiles')
    .select('id, display_name, trust_score, total_completed, total_reviews')
    .eq('user_id', user.id)
    .single();

  if (!profile) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-8 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-yellow-600" />
          <h2 className="mt-2 text-lg font-semibold text-yellow-900">No companion profile</h2>
          <p className="mt-1 text-sm text-yellow-800">
            Start your application to access the companion dashboard.
          </p>
          <Link href="/apply" className="mt-4 inline-block">
            <Button>Start application</Button>
          </Link>
        </div>
      </main>
    );
  }

  // Fetch pending bookings (awaiting companion response)
  const { data: pendingBookingsData = [] } = await supabase
    .from('bookings')
    .select(
      `
      id,
      booking_status,
      start_at,
      end_at,
      meeting_point_name,
      group_size,
      total_charged,
      users(full_name, avatar_url),
      service_offerings(title)
    `
    )
    .eq('companion_id', profile.id)
    .eq('booking_status', 'pending')
    .order('start_at', { ascending: true });
  const pendingBookings = pendingBookingsData || [];

  // Fetch upcoming sessions (confirmed, not yet started)
  const now = new Date().toISOString();
  const { data: upcomingSessionsData = [] } = await supabase
    .from('bookings')
    .select(
      `
      id,
      booking_status,
      start_at,
      end_at,
      meeting_point_name,
      group_size,
      total_charged,
      users(full_name, avatar_url),
      service_offerings(title)
    `
    )
    .eq('companion_id', profile.id)
    .eq('booking_status', 'confirmed')
    .gte('start_at', now)
    .order('start_at', { ascending: true })
    .limit(10);
  const upcomingSessions = upcomingSessionsData || [];

  // Fetch completed sessions
  const { data: completedSessionsData = [] } = await supabase
    .from('bookings')
    .select(
      `
      id,
      booking_status,
      start_at,
      end_at,
      meeting_point_name,
      group_size,
      total_charged,
      users(full_name, avatar_url),
      service_offerings(title),
      reviews(id, is_published)
    `
    )
    .eq('companion_id', profile.id)
    .eq('booking_status', 'completed')
    .order('start_at', { ascending: false })
    .limit(10);
  const completedSessions = completedSessionsData || [];

  // Calculate total earnings (placeholder)
  const allBookings = pendingBookings
    .concat(upcomingSessions)
    .concat(completedSessions);
  const totalEarnings = (allBookings.reduce((sum, booking: any) => sum + (booking.total_charged || 0), 0) * 0.85).toFixed(2);

  const BookingCard = ({ booking, status }: any) => (
    <Link href={`/dashboard/bookings/${booking.id}`}>
      <Card className="cursor-pointer p-4 transition hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold">{booking.service_offerings?.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Traveler: {booking.users?.full_name}
            </p>

            <div className="mt-3 space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(booking.start_at).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {new Date(booking.start_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {booking.meeting_point_name}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize">
              {status}
            </div>
            <p className="mt-2 font-semibold text-primary">
              ${(booking.total_charged * 0.85).toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">{booking.group_size} people</p>
          </div>
        </div>
      </Card>
    </Link>
  );

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-semibold">Companion dashboard</h1>
        <p className="mt-2 text-muted-foreground">Manage your bookings and earnings</p>
      </div>

      {/* Stats */}
      <div className="mb-10 grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Trust score</p>
          <p className="mt-2 text-3xl font-semibold">{profile.trust_score.toFixed(0)}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Sessions completed</p>
          <p className="mt-2 text-3xl font-semibold">{profile.total_completed}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total earnings</p>
          <p className="mt-2 text-3xl font-semibold">${totalEarnings}</p>
        </Card>
      </div>

      {/* Pending Bookings */}
      {pendingBookings.length > 0 && (
        <div className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              <AlertCircle className="mr-2 inline h-6 w-6 text-yellow-600" />
              Pending requests ({pendingBookings.length})
            </h2>
          </div>

          <div className="space-y-3">
            {pendingBookings.map((booking: any) => (
              <BookingCard key={booking.id} booking={booking} status="Awaiting response" />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Sessions */}
      {upcomingSessions.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">Upcoming sessions ({upcomingSessions.length})</h2>

          <div className="space-y-3">
            {upcomingSessions.map((booking: any) => (
              <BookingCard key={booking.id} booking={booking} status="Confirmed" />
            ))}
          </div>
        </div>
      )}

      {/* Completed Sessions */}
      {completedSessions.length > 0 && (
        <div>
          <h2 className="mb-4 text-2xl font-semibold">
            <CheckCircle className="mr-2 inline h-6 w-6 text-green-600" />
            Completed ({completedSessions.length})
          </h2>

          <div className="space-y-3">
            {completedSessions.map((booking: any) => (
              <div key={booking.id}>
                <BookingCard booking={booking} status="Completed" />
                {booking.reviews && booking.reviews.length > 0 && !booking.reviews[0]?.is_published && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Review pending publication (14-day window)
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {pendingBookings.length === 0 && upcomingSessions.length === 0 && completedSessions.length === 0 && (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">No bookings yet. Check back soon!</p>
          <Link href="/dashboard/companion/availability" className="mt-4 inline-block">
            <Button variant="secondary">Set up availability</Button>
          </Link>
        </div>
      )}
    </main>
  );
}
