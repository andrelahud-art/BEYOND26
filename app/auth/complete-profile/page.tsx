import { redirect } from 'next/navigation';
import { requireSession } from '@/lib/utils/permissions';
import { CompleteProfileForm } from './CompleteProfileForm';

export const metadata = {
  title: 'Complete your profile — BEYON26',
};

export default async function CompleteProfilePage() {
  const user = await requireSession();
  if (user.fullName) redirect('/dashboard/traveler');

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">One more thing</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Help us personalise your experience and reach you if needed.
        </p>
      </div>

      <CompleteProfileForm email={user.email} />
    </div>
  );
}
