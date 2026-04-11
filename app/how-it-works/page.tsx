import Link from 'next/link';
import { Metadata } from 'next';
import {
  Search,
  UserCheck,
  CreditCard,
  MapPin,
  ShieldCheck,
  Star,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'How it works — BEYON26',
  description:
    'The BEYON26 booking flow: search, request, match, pay, meet, session, review.',
};

const STEPS = [
  {
    icon: Search,
    title: '1. Tell us what you need',
    body: 'Search by city, date, service type, language, and zone. We show only verified companions with real availability.',
  },
  {
    icon: UserCheck,
    title: '2. Request a booking',
    body: 'Pick a companion and an offering (2h walking tour, 4h matchday, 8h full-day, or live translator). Our ops team may hand-match you during the first 100 bookings.',
  },
  {
    icon: CreditCard,
    title: '3. Pay into escrow',
    body: 'Checkout is powered by Stripe. Funds are held — not released — until after your session and the dispute window.',
  },
  {
    icon: MapPin,
    title: '4. Meet at an approved point',
    body: 'You receive meeting-point details, instructions, and an intro to your companion. All meeting points are inside pre-approved zones.',
  },
  {
    icon: ShieldCheck,
    title: '5. Run the session',
    body: 'Both parties check in. Our ops team monitors the safety timer and is on call for SOS, anomalies, or overtime.',
  },
  {
    icon: Star,
    title: '6. Check out, review, release',
    body: 'A mutual check-out stops the timer. A 24h dispute window opens. Reviews are double-blind. If no issues, the companion is paid.',
  },
];

export default function HowItWorksPage() {
  return (
    <main className="bg-background">
      <section className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.18em] text-primary">
          How it works
        </p>
        <h1 className="mt-3 text-5xl font-semibold tracking-tight">
          Six steps. Zero mysteries.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Every step is human-supervised. During the first 100 bookings, a real
          ops team hand-matches, monitors, and resolves issues. Automation comes
          after we understand the patterns.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16">
        <ol className="space-y-5">
          {STEPS.map((step) => (
            <li
              key={step.title}
              className="flex items-start gap-5 rounded-3xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{step.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-border bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-semibold">Ready to explore CDMX?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            24 verified companions are currently active for World Cup 2026.
            Search now and lock in a matchday partner.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/explore">
              <Button>
                Explore companions <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/trust">
              <Button variant="secondary">Read trust model</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
