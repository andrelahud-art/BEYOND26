import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

// Phase 0: static city data. Phase 1 reads from Supabase.
const CITIES = {
  cdmx: {
    name: 'Ciudad de México',
    tagline: 'Capital cultural y futbolística. Sede principal del World Cup 2026.',
    hero: 'https://images.unsplash.com/photo-1518659526054-190340b15735?auto=format&fit=crop&w=1800&q=80',
    active: true,
    zones: ['Roma Norte', 'Condesa', 'Centro Histórico', 'Polanco', 'Estadio Azteca'],
    companions: 24,
  },
  gdl: {
    name: 'Guadalajara',
    tagline: 'Jalisco — second host city, coming soon.',
    hero: 'https://images.unsplash.com/photo-1568690942063-e4c39d59b4fb?auto=format&fit=crop&w=1800&q=80',
    active: false,
    zones: [],
    companions: 0,
  },
  mty: {
    name: 'Monterrey',
    tagline: 'Northern host city, coming soon.',
    hero: 'https://images.unsplash.com/photo-1597006438013-0fc35af62c4f?auto=format&fit=crop&w=1800&q=80',
    active: false,
    zones: [],
    companions: 0,
  },
} as const;

type CitySlug = keyof typeof CITIES;

export function generateStaticParams() {
  return Object.keys(CITIES).map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const city = CITIES[params.slug as CitySlug];
  if (!city) return {};
  return {
    title: `${city.name} — BEYON26`,
    description: city.tagline,
  };
}

export default function CityPage({ params }: { params: { slug: string } }) {
  const city = CITIES[params.slug as CitySlug];
  if (!city) notFound();

  return (
    <main className="bg-background">
      <section className="relative h-[50vh] min-h-[360px] overflow-hidden border-b border-border">
        <Image
          src={city.hero}
          alt={city.name}
          fill
          unoptimized
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/75" />
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-6 pb-10 text-white">
          <p className="text-xs uppercase tracking-[0.18em] text-blue-300">
            {city.active ? 'Active · World Cup 2026' : 'Coming soon'}
          </p>
          <h1 className="mt-2 text-5xl font-semibold">{city.name}</h1>
          <p className="mt-3 max-w-xl text-white/80">{city.tagline}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        {city.active ? (
          <>
            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-xs uppercase text-muted-foreground">
                  Companions
                </p>
                <p className="mt-1 text-2xl font-semibold">{city.companions}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">
                  Approved zones
                </p>
                <p className="mt-1 text-2xl font-semibold">{city.zones.length}</p>
              </div>
            </div>

            <h2 className="mt-12 text-2xl font-semibold">Approved zones</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {city.zones.map((z) => (
                <span
                  key={z}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm"
                >
                  {z}
                </span>
              ))}
            </div>

            <div className="mt-10">
              <Link href={`/explore?city=${params.slug}`}>
                <Button>Explore companions in {city.name}</Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="rounded-3xl border border-border bg-card p-10 text-center">
            <h2 className="text-2xl font-semibold">Not live yet</h2>
            <p className="mt-2 text-muted-foreground">
              We operate one city at a time. {city.name} will open after we hit
              our CDMX targets.
            </p>
            <Link href="/" className="mt-6 inline-block">
              <Button variant="secondary">Back to home</Button>
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
