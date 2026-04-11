import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle2, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import IncidentActionsClient from '@/components/IncidentActionsClient';

export default async function IncidentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/sign-in');

  const supabase = createClient();

  // Check authorization
  const { data: userRecord } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!userRecord || !['admin', 'ops'].includes(userRecord.role)) {
    redirect('/');
  }

  // Fetch incident with related data
  const { data: incident } = await supabase
    .from('incidents')
    .select(
      `
      id,
      booking_id,
      reported_by,
      severity,
      category,
      description,
      evidence_urls,
      status,
      resolution,
      resolved_at,
      created_at,
      updated_at,
      bookings(
        id,
        traveler_id,
        companion_id,
        booking_status,
        service_offerings(title),
        users(full_name)
      ),
      users(full_name)
    `
    )
    .eq('id', params.id)
    .single();

  if (!incident) {
    notFound();
  }

  const severityConfig = {
    low: { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Low' },
    medium: { color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Medium' },
    high: { color: 'text-orange-600', bg: 'bg-orange-50', label: 'High' },
    critical: { color: 'text-red-600', bg: 'bg-red-50', label: 'Critical' },
  };

  const statusConfig = {
    open: { label: 'Open', icon: AlertTriangle, color: 'text-red-600' },
    investigating: { label: 'Investigating', icon: Clock, color: 'text-yellow-600' },
    resolved: { label: 'Resolved', icon: CheckCircle2, color: 'text-green-600' },
    escalated: { label: 'Escalated', icon: AlertTriangle, color: 'text-red-700' },
  };

  const severity = severityConfig[incident.severity as keyof typeof severityConfig];
  const status = statusConfig[incident.status as keyof typeof statusConfig];
  const StatusIcon = status.icon;

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      {/* Back button */}
      <div className="mb-6">
        <Link href="/admin/incidents">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to incidents
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-semibold">{incident.category}</h1>
            <p className="mt-2 text-muted-foreground">Incident #{incident.id.slice(0, 8)}</p>
          </div>
          <div className="flex gap-2">
            <Badge className={severity.bg}>
              <span className={severity.color}>{severity.label}</span>
            </Badge>
            <Badge variant="secondary">
              <span className={status.color}>{status.label}</span>
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          {/* Description */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Description</h2>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {incident.description}
            </p>
          </Card>

          {/* Evidence */}
          {incident.evidence_urls && incident.evidence_urls.length > 0 && (
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Evidence</h2>
              <div className="space-y-2">
                {incident.evidence_urls.map((url: string, idx: number) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline block break-all"
                  >
                    {url}
                  </a>
                ))}
              </div>
            </Card>
          )}

          {/* Resolution */}
          {incident.resolution && (
            <Card className="p-6 border-green-200 bg-green-50">
              <h2 className="mb-4 text-lg font-semibold text-green-900">Resolution</h2>
              <p className="text-sm text-green-800 whitespace-pre-wrap">
                {incident.resolution}
              </p>
              {incident.resolved_at && (
                <p className="mt-4 text-xs text-green-700">
                  Resolved on {new Date(incident.resolved_at).toLocaleString()}
                </p>
              )}
            </Card>
          )}

          {/* Actions for open incidents */}
          {incident.status !== 'resolved' && (
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Actions</h2>
              <IncidentActionsClient
                incidentId={incident.id}
                currentStatus={incident.status}
              />
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Booking info */}
          {incident.bookings && (
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Booking</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Service</p>
                  <p className="font-medium">{incident.bookings?.[0]?.service_offerings?.[0]?.title}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Traveler</p>
                  <p className="font-medium">{incident.bookings?.[0]?.users?.[0]?.full_name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{incident.bookings?.[0]?.booking_status}</p>
                </div>
                <a href={`/dashboard/bookings/${incident.booking_id}`} className="block pt-2">
                  <Button size="sm" className="w-full" variant="secondary">
                    View booking
                  </Button>
                </a>
              </div>
            </Card>
          )}

          {/* Timeline */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Timeline</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Created</p>
                <p className="font-medium">{new Date(incident.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Last updated</p>
                <p className="font-medium">{new Date(incident.updated_at).toLocaleString()}</p>
              </div>
              {incident.resolved_at && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Resolved</p>
                  <p className="font-medium">
                    {new Date(incident.resolved_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Reporter */}
          {incident.users?.[0]?.full_name && (
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Reported by</h2>
              <p className="text-sm font-medium">{incident.users[0].full_name}</p>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
