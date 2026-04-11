import { Metadata } from 'next';
import { requireRole } from '@/lib/utils/permissions';
import CompanionApplicationForm from '@/components/forms/CompanionApplicationForm';

export const metadata: Metadata = {
  title: 'Apply as a companion — BEYON26',
  description: 'Join BEYON26 as a verified local companion in Ciudad de México.',
};

export default async function ApplyPage() {
  // Require authentication but allow traveler role (companions are also authenticated users)
  const user = await requireRole('traveler');

  return (
    <>
      <CompanionApplicationForm />
    </>
  );
}
