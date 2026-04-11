import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { requireSession } from '@/lib/utils/permissions';
import BookingRequestForm from '@/components/forms/BookingRequestForm';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const supabase = createClient();
  const { data: companion } = await supabase
    .from('companion_profiles')
    .select('display_name')
    .eq('user_id', params.slug)
    .single();

  return {
    title: `Book with ${companion?.display_name || 'Companion'} — BEYON26`,
  };
}

export default async function BookingPage({
  params,
}: {
  params: { slug: string };
}) {
  // Require authentication
  await requireSession();

  const supabase = createClient();

  // Fetch companion profile and offerings
  const { data: companion } = await supabase
    .from('companion_profiles')
    .select(
      `
      id,
      user_id,
      display_name,
      service_offerings(*)
    `
    )
    .eq('user_id', params.slug)
    .eq('approval_status', 'approved')
    .single();

  if (!companion) {
    notFound();
  }

  const offerings = companion.service_offerings || [];

  if (offerings.length === 0) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Book with {companion.display_name}</h1>
        <p className="mt-2 text-muted-foreground">Complete your booking request in 3 steps</p>
      </div>

      <BookingRequestForm companionId={companion.id} offerings={offerings} />
    </main>
  );
}
