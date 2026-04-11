import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import AdminDashboardCharts from '@/components/AdminDashboardCharts';
import {
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Clock,
} from 'lucide-react';

export default async function AdminDashboard() {
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

  // Fetch KPI data
  const { data: bookingsData } = await supabase
    .from('bookings')
    .select('booking_status, total_charged, companion_payout, payment_status');

  const { data: companionsData } = await supabase
    .from('companion_profiles')
    .select('trust_score, avg_rating, approval_status, response_rate');

  const { data: incidentsData } = await supabase
    .from('incidents')
    .select('status, severity, created_at');

  const { data: usersData } = await supabase
    .from('users')
    .select('role, created_at')
    .eq('status', 'active');

  // Calculate KPIs
  const bookings = bookingsData || [];
  const companions = companionsData || [];
  const incidents = incidentsData || [];
  const users = usersData || [];

  // Active bookings
  const activeBookings = bookings.filter(
    (b: any) => b.booking_status === 'in_progress'
  ).length;
  const completedBookings = bookings.filter(
    (b: any) => b.booking_status === 'completed'
  ).length;
  const totalRevenue = bookings
    .filter((b: any) => b.payment_status === 'captured')
    .reduce((sum: number, b: any) => sum + (b.total_charged || 0), 0);

  // Companion metrics
  const approvedCompanions = companions.filter(
    (c: any) => c.approval_status === 'approved'
  ).length;
  const avgTrustScore =
    companions.length > 0
      ? (
          companions.reduce((sum: number, c: any) => sum + (c.trust_score || 0), 0) /
          companions.length
        ).toFixed(2)
      : 0;
  const avgRating =
    companions.length > 0
      ? (
          companions.reduce((sum: number, c: any) => sum + (c.avg_rating || 0), 0) /
          companions.length
        ).toFixed(2)
      : 0;

  // Incident metrics
  const openIncidents = incidents.filter((i: any) => i.status === 'open').length;
  const criticalIncidents = incidents.filter(
    (i: any) => i.severity === 'critical'
  ).length;

  // Traveler & companion counts
  const travelers = users.filter((u: any) => u.role === 'traveler').length;
  const companionUsers = users.filter((u: any) => u.role === 'companion').length;

  // Booking status breakdown
  const bookingStatusData = [
    { name: 'Pending', value: bookings.filter((b: any) => b.booking_status === 'pending').length },
    { name: 'Confirmed', value: bookings.filter((b: any) => b.booking_status === 'confirmed').length },
    { name: 'In Progress', value: activeBookings },
    { name: 'Completed', value: completedBookings },
    { name: 'Cancelled', value: bookings.filter((b: any) => b.booking_status === 'cancelled').length },
  ];

  // Payment status breakdown
  const paymentStatusData = [
    { name: 'Pending', value: bookings.filter((b: any) => b.payment_status === 'pending').length },
    { name: 'Captured', value: bookings.filter((b: any) => b.payment_status === 'captured').length },
    { name: 'Refunded', value: bookings.filter((b: any) => b.payment_status === 'refunded').length },
    { name: 'Failed', value: bookings.filter((b: any) => b.payment_status === 'failed').length },
  ];

  // Incident severity distribution
  const incidentSeverityData = [
    { name: 'Low', value: incidents.filter((i: any) => i.severity === 'low').length },
    { name: 'Medium', value: incidents.filter((i: any) => i.severity === 'medium').length },
    { name: 'High', value: incidents.filter((i: any) => i.severity === 'high').length },
    { name: 'Critical', value: criticalIncidents },
  ];

  // Trust score distribution
  const excellentCompanions = companions.filter((c: any) => c.trust_score >= 90).length;
  const goodCompanions = companions.filter((c: any) => c.trust_score >= 70 && c.trust_score < 90).length;
  const fairCompanions = companions.filter((c: any) => c.trust_score >= 50 && c.trust_score < 70).length;
  const newCompanions = companions.filter((c: any) => c.trust_score < 50).length;

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Marketplace health and operational metrics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="mt-1 text-3xl font-semibold">
                ${(totalRevenue / 100).toFixed(0)}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                From {bookings.length} bookings
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Sessions</p>
              <p className="mt-1 text-3xl font-semibold">{activeBookings}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {completedBookings} completed
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Verified Companions</p>
              <p className="mt-1 text-3xl font-semibold">{approvedCompanions}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Trust score: {avgTrustScore}
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
              <p className="mt-1 text-3xl font-semibold">{avgRating}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Out of 5.00
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Open Incidents</p>
              <p className="mt-1 text-3xl font-semibold">{openIncidents}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {criticalIncidents} critical
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Travelers</p>
              <p className="mt-1 text-3xl font-semibold">{travelers}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {companionUsers} companion profiles
              </p>
            </div>
            <Users className="h-8 w-8 text-indigo-600" />
          </div>
        </Card>
      </div>

      <AdminDashboardCharts
        bookingStatusData={bookingStatusData}
        paymentStatusData={paymentStatusData}
        incidentSeverityData={incidentSeverityData}
        companionCount={companions.length}
        excellentCompanions={excellentCompanions}
        goodCompanions={goodCompanions}
        fairCompanions={fairCompanions}
        newCompanions={newCompanions}
      />
    </main>
  );
}
