import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  BadgeCheck,
  Globe2,
  LifeBuoy,
  Sparkles,
  ArrowRight,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BRAND } from '@/lib/utils/constants';
import { HeroSearch } from '@/components/marketplace/HeroSearch';

/**
 * BEYON26 landing — Phase 0 version.
 *
 * Supply-first framing: we sell verification, presence, and safety, not
 * "tours". The hero prioritises the search surface; the page explains the
 * managed nature of the marketplace; CTAs are routed to real Phase 0 stubs.
 */

const CITIES = [
  {
    slug: 'cdmx',
    name: 'Ciudad de México',
    status: 'Live · World Cup 2026',
    image:
      'https://images.unsplash.com/photo-1518659526054-190340b15735?auto=format&fit=crop&w=1400&q=80',
    companions: 24,
    active: true,
  },
  {
    slug: 'gdl',
    name: 'Guadalajara',
    status: 'Coming soon',
    image:
      'https://images.unsplash.com/photo-1568690942063-e4c39d59b4fb?auto=format&fit=crop&w=1400&q=80',
    companions: 0,
    active: false,
  },
  {
    slug: 'mty',
    name: 'Monterrey',
    status: 'Coming soon',
    image:
      'https://images.unsplash.com/photo-1597006438013-0fc35af62c4f?auto=format&fit=crop&w=1400&q=80',
    companions: 0,
    active: false,
  },
];

const FEATURED = [
  {
    name: 'Sofía M.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80',
    role: 'Matchday specialist · Estadio Azteca',
    languages: 'ES · EN',
    rating: 4.9,
    from: 60,
  },
  {
    name: 'Valentina R.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80',
    role: 'Polanco & Chapultepec guide',
    languages: 'ES · EN · FR',
    rating: 5.0,
    from: 70,
  },
  {
    name: 'Diego H.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    role: 'Roma + Condesa walking tour',
    languages: 'ES · EN · PT',
    rating: 4.8,
    from: 35,
  },
  {
    name: 'Mateo V.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80',
    role: 'Live interpreter ES/EN/PT/JA',
    languages: 'ES · EN · PT · JA',
    rating: 4.7,
    from: 40,
  },
];

const TRUST_PILLARS = [
  {
    icon: BadgeCheck,
    title: 'Human-verified supply',
    body: 'Every companion is ID-verified, background-checked, interviewed, and trained. No open sign-ups.',
  },
  {
    icon: ShieldCheck,
    title: 'Safety sessions',
    body: 'Check-in, check-out, SOS, meeting-point geofencing and ops-side monitoring on every booking.',
  },
  {
    icon: Globe2,
    title: 'Pre-matched for you',
    body: 'Zone + language + service-type + trust score. Our ops team curates, so you don\'t gamble.',
  },
  {
    icon: LifeBuoy,
    title: 'Escrow + 24h window',
    body: 'Payments held until after the session. Disputes resolved manually before release.',
  },
];

export default function HomePage() {
  return (
    <main className="bg-background text-foreground">
      {/* ----- HERO ----- */}
      <section className="relative overflow-hidden border-b border-border bg-[#05070f] px-6 pb-28 pt-28 text-white sm:px-10">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?auto=format&fit=crop&w=1800&q=80"
            alt=""
            fill
            unoptimized
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-[#05070f]" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-200 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Managed marketplace · World Cup 2026
          </span>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.05] sm:text-6xl md:text-7xl">
            A verified local,
            <br />
            by your side.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-blue-50/85">
            {BRAND.tagline}. Book a vetted companion for matchday, city walks, or
            live translation — backed by real humans monitoring every session.
          </p>

          <div className="mt-10 max-w-3xl">
            <HeroSearch />
          </div>

          <p className="mt-4 text-xs text-blue-100/70">
            24 verified companions currently active in Ciudad de México.
          </p>
        </div>
      </section>

      {/* ----- CITIES ----- */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-semibold sm:text-4xl">One city. Done right.</h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              We operate one venue at a time, one window at a time. Supply first,
              demand second.
            </p>
          </div>
          <Link
            href="/explore"
            className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline sm:inline-flex"
          >
            Explore CDMX <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {CITIES.map((city) => (
            <article
              key={city.slug}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card"
            >
              <Image
                src={city.image}
                alt={city.name}
                width={1200}
                height={900}
                unoptimized
                className={`h-64 w-full object-cover transition duration-500 ${
                  city.active ? 'group-hover:scale-105' : 'grayscale'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-0 p-5 text-white">
                <p className="text-xs uppercase tracking-[0.18em] text-blue-300">
                  {city.status}
                </p>
                <h3 className="mt-1 text-2xl font-semibold">{city.name}</h3>
                <p className="mt-1 text-sm text-white/75">
                  {city.active
                    ? `${city.companions} verified companions`
                    : 'Join the waitlist'}
                </p>
                {city.active ? (
                  <Link
                    href={`/cities/${city.slug}`}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-200 hover:text-white"
                  >
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <span className="mt-3 inline-block rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs">
                    Waitlist
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ----- FEATURED COMPANIONS ----- */}
      <section className="border-y border-border bg-slate-50 px-6 py-20 sm:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold sm:text-4xl">
                Meet a few of our companions
              </h2>
              <p className="mt-2 max-w-xl text-muted-foreground">
                Interviewed, trained, and monitored. Not a gig economy.
              </p>
            </div>
            <Link
              href="/explore"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              See all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED.map((p) => (
              <article
                key={p.name}
                className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
              >
                <Image
                  src={p.image}
                  alt={p.name}
                  width={600}
                  height={600}
                  unoptimized
                  className="h-56 w-full object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{p.name}</h3>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      {p.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{p.role}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{p.languages}</p>
                  <p className="mt-3 text-sm font-semibold text-primary">
                    From ${p.from}/hr
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ----- TRUST PILLARS ----- */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10">
        <div className="text-center">
          <h2 className="text-3xl font-semibold sm:text-4xl">Safety is the product</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            BEYON26 is a managed marketplace. Curation, verification, and live
            monitoring aren't features — they are the architecture.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {TRUST_PILLARS.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <p.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/trust">
            <Button variant="secondary">Read our full trust model</Button>
          </Link>
        </div>
      </section>

      {/* ----- APPLY CTA ----- */}
      <section className="border-t border-border bg-[#05070f] px-6 py-20 text-white sm:px-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold sm:text-4xl">
              Are you a local in Ciudad de México?
            </h2>
            <p className="mt-3 max-w-xl text-blue-100/80">
              We are recruiting 30–50 companions for World Cup 2026. Apply now —
              selection is human, not algorithmic.
            </p>
          </div>
          <Link href="/apply">
            <Button size="lg">Apply as a companion</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
