import { requireRole } from '@/lib/utils/permissions';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  FileCheck,
  Video,
  Users,
  BookOpen,
} from 'lucide-react';

export default async function AdminApplicationsPage() {
  const user = await requireRole(['admin', 'ops']);

  // Use service role client to bypass RLS and read all pending applications
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch pending companion applications
  const { data: applicationsData } = await supabase
    .from('companion_profiles')
    .select(
      `
      id,
      user_id,
      display_name,
      bio,
      city_id,
      approval_status,
      created_at,
      users(full_name, email, avatar_url),
      cities(name),
      companion_verifications(
        government_id_status,
        selfie_liveness_status,
        background_check_status,
        interview_status,
        references_status,
        training_completed
      )
    `
    )
    .in('approval_status', ['pending_review', 'interview_scheduled'])
    .order('created_at', { ascending: true });
  const applications = applicationsData || [];

  const VerificationStep = ({
    label,
    status,
  }: {
    label: string;
    status: string;
  }) => {
    const isComplete = status === 'verified' || status === 'completed' || status === 'clear';
    const isPending = status === 'pending';
    const isFailed = status === 'rejected' || status === 'failed' || status === 'insufficient';

    return (
      <div className="flex items-center gap-3">
        <div
          className={`h-5 w-5 rounded-full ${
            isComplete
              ? 'bg-green-500'
              : isFailed
                ? 'bg-red-500'
                : isPending
                  ? 'bg-yellow-500'
                  : 'bg-gray-300'
          }`}
        />
        <span className="text-sm">{label}</span>
        <span className="text-xs text-muted-foreground capitalize">{status}</span>
      </div>
    );
  };

  const ApplicationCard = ({ app }: any) => {
    const verification = app.companion_verifications?.[0];

    return (
      <Card className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center gap-3">
              <img
                src={app.users?.avatar_url || 'https://via.placeholder.com/48'}
                alt={app.display_name}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold">{app.display_name}</h3>
                <p className="text-xs text-muted-foreground">
                  {app.users?.full_name} ({app.users?.email})
                </p>
              </div>
            </div>

            {/* Bio */}
            <p className="mt-3 text-sm text-muted-foreground">{app.bio}</p>

            {/* Verification checklist */}
            <div className="mt-4 space-y-2">
              <p className="text-sm font-semibold">Verification status:</p>
              <div className="space-y-2 rounded bg-muted/30 p-3">
                <VerificationStep
                  label="Government ID"
                  status={verification?.government_id_status || 'pending'}
                />
                <VerificationStep
                  label="Selfie liveness"
                  status={verification?.selfie_liveness_status || 'pending'}
                />
                <VerificationStep
                  label="Background check"
                  status={verification?.background_check_status || 'pending'}
                />
                <VerificationStep
                  label="Interview"
                  status={verification?.interview_status || 'not_scheduled'}
                />
                <VerificationStep
                  label="References"
                  status={verification?.references_status || 'pending'}
                />
                <VerificationStep
                  label="Training"
                  status={verification?.training_completed ? 'completed' : 'pending'}
                />
              </div>
            </div>

            {/* Metadata */}
            <div className="mt-4 flex gap-6 text-sm text-muted-foreground">
              <div>
                <p className="text-xs font-medium">City</p>
                <p>{app.cities?.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium">Applied</p>
                <p>{new Date(app.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs font-medium">Status</p>
                <p className="capitalize">{app.approval_status.replace('_', ' ')}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Link href={`/admin/applications/${app.id}`}>
              <Button size="sm" variant="secondary" className="w-full">
                Review details
              </Button>
            </Link>

            {app.approval_status === 'pending_review' && (
              <>
                <Link href={`/admin/applications/${app.id}/interview`}>
                  <Button size="sm" className="w-full">
                    Schedule interview
                  </Button>
                </Link>
              </>
            )}

            {app.approval_status === 'interview_scheduled' && (
              <>
                <Link href={`/admin/applications/${app.id}/approve`}>
                  <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                    Approve
                  </Button>
                </Link>
                <Link href={`/admin/applications/${app.id}/reject`}>
                  <Button size="sm" variant="secondary" className="w-full">
                    Reject
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-semibold">Companion applications</h1>
        <p className="mt-2 text-muted-foreground">
          Review and manage pending companion applications
        </p>
      </div>

      {/* Stats */}
      <div className="mb-10 grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending review</p>
              <p className="mt-1 text-2xl font-semibold">
                {applications.filter((a) => a.approval_status === 'pending_review').length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Interview scheduled</p>
              <p className="mt-1 text-2xl font-semibold">
                {applications.filter((a) => a.approval_status === 'interview_scheduled').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Docs uploaded</p>
              <p className="mt-1 text-2xl font-semibold">
                {
                  applications.filter(
                    (a) =>
                      a.companion_verifications?.[0]?.government_id_status === 'verified' ||
                      a.companion_verifications?.[0]?.government_id_status === 'pending'
                  ).length
                }
              </p>
            </div>
            <FileCheck className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Interviews complete</p>
              <p className="mt-1 text-2xl font-semibold">
                {
                  applications.filter(
                    (a) =>
                      a.companion_verifications?.[0]?.interview_status === 'completed'
                  ).length
                }
              </p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Applications */}
      {applications.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No pending applications</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </main>
  );
}
