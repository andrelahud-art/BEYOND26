import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  User,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import BookingActionsClient from '@/components/BookingActionsClient';

export default async function BookingDetailPage({
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
      *,
      service_offerings(title, description, base_price, duration_minutes),
      users!traveler_id(id, full_name, avatar_url),
      companion_profiles(id, display_name, user_id),
      users:companion_profiles(user_id)
    `
    )
    .eq('id', params.id)
    .single();

  if (!booking) {
    notFound();
  }

  // Fetch companion profile if it exists
  let companionUserId: string | null = null;
  if (booking.companion_id) {
    const { data: profile } = await supabase
      .from('companion_profiles')
      .select('user_id')
      .eq('id', booking.companion_id)
      .single();
    companionUserId = profile?.user_id || null;
  }

  // Check authorization
  const isTraveler = booking.traveler_id === user.id;
  const isCompanion = companionUserId === user.id;

  if (!isTraveler && !isCompanion) {
    redirect('/');
  }

  const statusConfig = {
    pending: {
      label: 'Awaiting response',
      icon: AlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    confirmed: {
      label: 'Confirmed',
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    in_progress: {
      label: 'In progress',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    completed: {
      label: 'Completed',
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    cancelled: {
      label: 'Cancelled',
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    disputed: {
      label: 'Disputed',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  };

  const status = statusConfig[booking.booking_status as keyof typeof statusConfig];
  const StatusIcon = status.icon;

  const durationLabel = (mins: number) => {
    if (mins === 120) return '2 hours';
    if (mins === 240) return '4 hours';
    if (mins === 480) return 'Full day';
    return `${mins / 60} hours`;
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${status.bgColor}`}>
          <StatusIcon className={`h-4 w-4 ${status.color}`} />
          <span className={`text-sm font-semibold ${status.color}`}>{status.label}</span>
        </div>

        <h1 className="mt-4 text-3xl font-semibold">{booking.service_offerings?.title}</h1>
        <p className="mt-1 text-muted-foreground">Booking #{booking.id.slice(0, 8)}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          {/* Details */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Booking details</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Date</p>
                <div className="mt-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{new Date(booking.start_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground">Time</p>
                <div className="mt-1 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">
                    {new Date(booking.start_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground">Duration</p>
                <p className="mt-1 font-medium">
                  {durationLabel(booking.service_offerings?.duration_minutes || 240)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground">Group size</p>
                <p className="mt-1 font-medium">{booking.group_size} people</p>
              </div>

              <div className="md:col-span-2">
                <p className="text-xs font-medium text-muted-foreground">Meeting point</p>
                <div className="mt-1 flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{booking.meeting_point_name}</p>
                    {booking.meeting_point_instructions && (
                      <p className="text-sm text-muted-foreground">
                        {booking.meeting_point_instructions}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {booking.traveler_notes && (
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-xs font-medium text-muted-foreground">Traveler notes</p>
                <p className="mt-1 text-sm">{booking.traveler_notes}</p>
              </div>
            )}
          </Card>

          {/* Pricing */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Pricing breakdown</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Service price</span>
                <span>${(booking.service_offerings?.base_price || 0).toFixed(2)} × {booking.group_size}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${((booking.service_offerings?.base_price || 0) * booking.group_size).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform fee (15%)</span>
                <span>${booking.platform_fee?.toFixed(2) || '0.00'}</span>
              </div>

              <div className="flex justify-between border-t border-border pt-2 font-semibold">
                <span>Total</span>
                <span className="text-primary">${booking.total_charged?.toFixed(2) || '0.00'}</span>
              </div>
            </div>

            {booking.payment_status && (
              <div className="mt-4 rounded bg-blue-50 p-3">
                <p className="text-xs font-medium text-blue-900">
                  Payment status: <span className="capitalize">{booking.payment_status}</span>
                </p>
              </div>
            )}
          </Card>

          {/* Actions for companion */}
          {isCompanion && booking.booking_status === 'pending' && (
            <BookingActionsClient bookingId={booking.id} />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Companion info (for travelers) */}
          {isTraveler && (
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Companion</h2>
              <div className="flex items-center gap-3">
                <img
                  src={booking.users?.avatar_url || 'https://via.placeholder.com/48'}
                  alt={booking.companion_profiles?.display_name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{booking.companion_profiles?.display_name}</p>
                  <a
                    href={`/explore/${booking.companion_profiles?.user_id}`}
                    className="text-xs text-primary hover:underline"
                  >
                    View profile
                  </a>
                </div>
              </div>
            </Card>
          )}

          {/* Traveler info (for companions) */}
          {isCompanion && (
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Traveler</h2>
              <div className="flex items-center gap-3">
                <img
                  src={booking.users?.avatar_url || 'https://via.placeholder.com/48'}
                  alt={booking.users?.full_name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{booking.users?.full_name}</p>
                  <p className="text-xs text-muted-foreground">{booking.users?.email}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Messages */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Messages</h2>
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </div>
            <a href={`/dashboard/bookings/${booking.id}/messages`} className="mt-3 block">
              <Button className="w-full" variant="secondary">
                Open chat
              </Button>
            </a>
          </Card>

          {/* Session management */}
          {booking.booking_status === 'confirmed' && (
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Session</h2>
              <div className="space-y-2">
                {new Date(booking.start_at) <= new Date() &&
                  new Date(booking.end_at) >= new Date() && (
                    <a href={`/dashboard/bookings/${booking.id}/session`} className="block">
                      <Button className="w-full">Start session</Button>
                    </a>
                  )}
                {new Date(booking.end_at) < new Date() && (
                  <a href={`/dashboard/bookings/${booking.id}/checkout`} className="block">
                    <Button className="w-full">Check out</Button>
                  </a>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
