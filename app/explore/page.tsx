import Link from 'next/link';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Explore companions — BEYON26',
  description: 'Find a verified local companion in Ciudad de México.',
};

export default function ExplorePage({
  searchParams,
}: {
  searchParams: { city?: string; date?: string; groupSize?: string };
}) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Phase 1 — under construction
      </p>
      <h1 className="mt-3 text-4xl font-semibold">Explore companions</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Filter by zone, language, and service type. The full marketplace view
        ships in Phase 1. For now, here&apos;s the query you sent us:
      </p>
      <pre className="mt-6 inline-block rounded-2xl bg-card px-4 py-3 text-xs text-muted-foreground">
        city={searchParams.city ?? 'cdmx'} · date={searchParams.date ?? '—'} ·
        groupSize={searchParams.groupSize ?? '1'}
      </pre>
      <div className="mt-10">
        <Link href="/">
          <Button variant="secondary">Back to home</Button>
        </Link>
      </div>
    </main>
  );
}
