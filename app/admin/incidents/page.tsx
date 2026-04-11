import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  MessageSquare,
  Search,
} from 'lucide-react';

export default async function IncidentsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/sign-in');

  // Use session client for auth check
  const sessionSupabase = createClient();

  // Check authorization
  const { data: userRecord } = await sessionSupabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!userRecord || !['admin', 'ops'].includes(userRecord.role)) {
    redirect('/');
  }

  // Use service role client to read incidents (bypasses RLS)
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch incidents with related booking info
  const { data: incidents } = await supabase
    .from('incidents')
    .select(
      `
      id,
      booking_id,
      severity,
      category,
      description,
      status,
      created_at,
      updated_at,
      bookings(
        id,
        traveler_id,
        companion_id,
        service_offerings(title),
        users(full_name)
      )
    `
    )
    .order('created_at', { ascending: false })
    .limit(100);

  const severityConfig = {
    low: { color: 'text-blue-600', bgColor: 'bg-blue-50' },
    medium: { color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    high: { color: 'text-orange-600', bgColor: 'bg-orange-50' },
    critical: { color: 'text-red-600', bgColor: 'bg-red-50' },
  };

  const statusConfig = {
    open: { label: 'Open', icon: AlertTriangle, color: 'text-red-600' },
    investigating: { label: 'Investigating', icon: Clock, color: 'text-yellow-600' },
    resolved: { label: 'Resolved', icon: CheckCircle2, color: 'text-green-600' },
    escalated: { label: 'Escalated', icon: AlertTriangle, color: 'text-red-700' },
  };

  const openIncidents = incidents?.filter((i) => i.status === 'open') || [];
  const investigatingIncidents = incidents?.filter((i) => i.status === 'investigating') || [];
  const resolvedIncidents = incidents?.filter((i) => i.status === 'resolved') || [];

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Incidents</h1>
        <p className="mt-2 text-muted-foreground">
          Monitor and manage safety incidents and SOS alerts
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Open</p>
              <p className="mt-1 text-3xl font-semibold">{openIncidents.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Investigating</p>
              <p className="mt-1 text-3xl font-semibold">{investigatingIncidents.length}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Resolved</p>
              <p className="mt-1 text-3xl font-semibold">{resolvedIncidents.length}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="mt-1 text-3xl font-semibold">{incidents?.length || 0}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
      </div>

      {/* Incidents list */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Severity</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Incident</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Booking</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Created</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {incidents && incidents.length > 0 ? (
                incidents.map((incident: any) => {
                  const severity = severityConfig[incident.severity as keyof typeof severityConfig];
                  const status = statusConfig[incident.status as keyof typeof statusConfig];
                  const StatusIcon = status.icon;

                  return (
                    <tr key={incident.id} className="border-b border-border hover:bg-muted/50">
                      <td className="px-6 py-4">
                        <Badge className={severity.bgColor}>
                          <span className={severity.color}>{incident.severity}</span>
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`h-4 w-4 ${status.color}`} />
                          <span className="text-sm font-medium">{status.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium">{incident.category}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {incident.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {incident.bookings ? (
                          <div>
                            <p className="text-sm font-medium">
                              {incident.bookings.service_offerings?.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {incident.bookings.users?.full_name}
                            </p>
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground">No booking</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(incident.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <a href={`/admin/incidents/${incident.id}`} className="block">
                          <Button size="sm" variant="secondary">
                            View
                          </Button>
                        </a>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No incidents reported
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  );
}
