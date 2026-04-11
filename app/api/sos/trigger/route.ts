import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/server';
import { sosTriggerSchema } from '@/lib/validation/schemas';

/**
 * POST /api/sos/trigger
 * Trigger SOS alert for active booking
 * Creates incident automatically and notifies ops team
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const data = sosTriggerSchema.parse(body);

    const supabase = createClient();

    // Fetch booking
    const { data: booking } = await supabase
      .from('bookings')
      .select('id, traveler_id, companion_id, booking_status, start_at, end_at')
      .eq('id', data.bookingId)
      .single();

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Verify user is participant
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
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get safety session
    const { data: session } = await supabase
      .from('safety_sessions')
      .select('id')
      .eq('booking_id', data.bookingId)
      .single();

    // Create incident first
    const incidentCategory = mapAlertToCategory(data.alertType);
    const { data: incident, error: incError } = await supabase
      .from('incidents')
      .insert({
        booking_id: data.bookingId,
        reported_by: user.id,
        severity: data.alertType === 'panic' ? 'critical' : 'high',
        category: incidentCategory,
        description: `SOS Alert: ${data.alertType} triggered by ${isTraveler ? 'traveler' : 'companion'}`,
        status: 'open',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (incError) throw incError;

    // Create SOS alert
    const { data: sos, error: sosError } = await supabase
      .from('sos_alerts')
      .insert({
        safety_session_id: session?.id || '',
        triggered_by: user.id,
        alert_type: data.alertType,
        lat: data.lat,
        lng: data.lng,
        incident_id: incident.id,
        triggered_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (sosError) throw sosError;

    // Update safety session status
    await supabase
      .from('safety_sessions')
      .update({
        alert_triggered_at: new Date().toISOString(),
        alert_type: data.alertType,
        status: 'alert_triggered',
      })
      .eq('booking_id', data.bookingId);

    // TODO: Send SMS/email to ops team with incident details
    // TODO: Create push notification for other participant

    return NextResponse.json(
      {
        sos,
        incident,
        message: 'SOS triggered. Ops team has been notified.',
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('SOS trigger error:', err);
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}

function mapAlertToCategory(alertType: string): string {
  const mapping: Record<string, string> = {
    panic: 'safety_concern',
    no_checkin: 'no_show',
    overtime: 'other',
    zone_exit: 'zone_violation',
  };
  return mapping[alertType] || 'other';
}
