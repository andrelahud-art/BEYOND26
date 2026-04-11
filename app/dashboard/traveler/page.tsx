import { requireRole } from '@/lib/utils/permissions';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock } from 'lucide-react';

export default async function TravelerDashboardPage() {
  const user = await requireRole('traveler');
  const supabase = createClient();

  const { data: bookings } = await supabase
    .from('bookings')
    .select(
      `
      id,
      booking_status,
      start_at,
      end_at,
      meeting_point_name,
      total_charged,
      companion_profiles(display_name, user_id(avatar_url)),
      service_offerings(title)
    `
    )
    .eq('traveler_id', user.id)
    .order('start_at', { ascending: false })
    .limit(10);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold">Your trips</h1>
        <p className="mt-2 text-muted-foreground">Manage your bookings and companions.</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">
          {bookings?.length || 0} booking{(bookings?.length || 0) !== 1 ? 's' : ''}
        </p>
        <Link href="/explore">
          <Button>Book a new companion</Button>
        </Link>
      </div>

      {!bookings || bookings.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">No bookings yet. Explore companions to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b: any) => (
            <Link key={b.id} href={`/dashboard/traveler/bookings/${b.id}`}>
              <article className="rounded-2xl border border-border bg-card p-5 transition hover:shadow-md cursor-pointer">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">
                      {b.service_offerings?.title} with {b.companion_profiles?.display_name}
                    </h3>
                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(b.start_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(b.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {b.meeting_point_name || 'TBD'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize">
                      {b.booking_status}
                    </div>
                    <p className="mt-2 font-semibold text-primary">${b.total_charged}</p>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
