import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
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

  const COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#dc2626'];

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

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Booking Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bookingStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {bookingStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Payment Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Incident Severity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={incidentSeverityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {incidentSeverityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Trust Score Distribution</h3>
          <div className="space-y-3">
            {[
              { range: '90-100 (Excellent)', count: companions.filter((c: any) => c.trust_score >= 90).length },
              { range: '70-89 (Good)', count: companions.filter((c: any) => c.trust_score >= 70 && c.trust_score < 90).length },
              { range: '50-69 (Fair)', count: companions.filter((c: any) => c.trust_score >= 50 && c.trust_score < 70).length },
              { range: '0-49 (Low)', count: companions.filter((c: any) => c.trust_score < 50).length },
            ].map((item) => (
              <div key={item.range}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.range}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${companions.length > 0 ? (item.count / companions.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}
