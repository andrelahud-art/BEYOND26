import Link from 'next/link';
import { Metadata } from 'next';
import {
  BadgeCheck,
  FileCheck,
  Video,
  UserCheck,
  GraduationCap,
  ShieldCheck,
  LifeBuoy,
  MapPin,
  DollarSign,
  MessagesSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Trust & safety — BEYON26',
  description:
    'How BEYON26 verifies companions, monitors sessions, holds payments, and resolves disputes.',
};

const VERIFICATION = [
  { icon: FileCheck, title: 'Government ID', body: 'Valid state-issued ID; verified against liveness.' },
  { icon: Video, title: 'Liveness + selfie', body: 'Proof of identity tied to the ID holder.' },
  { icon: ShieldCheck, title: 'Background check', body: 'Criminal record review via our provider.' },
  { icon: UserCheck, title: 'Live interview', body: 'Every candidate is interviewed by ops.' },
  { icon: MessagesSquare, title: 'References', body: 'Minimum two personal or professional references.' },
  { icon: GraduationCap, title: 'Training', body: 'Safety protocol, conduct, and SOS flow.' },
];

const RUNTIME = [
  { icon: MapPin, title: 'Approved zones only', body: 'Sessions run inside geo-fenced, pre-approved areas in CDMX.' },
  { icon: ShieldCheck, title: 'Check-in & check-out', body: 'Both parties confirm presence at the meeting point; a safety timer runs the whole session.' },
  { icon: LifeBuoy, title: 'SOS + ops on call', body: 'A panic button routes GPS, session data, and context directly to our ops team.' },
  { icon: DollarSign, title: 'Escrow + dispute window', body: 'Payment is held until 24h after check-out, giving time to report issues.' },
];

export default function TrustPage() {
  return (
    <main className="bg-background">
      <section className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.18em] text-primary">
          Trust model
        </p>
        <h1 className="mt-3 text-5xl font-semibold tracking-tight">
          Safety is not a feature. It is the product.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          BEYON26 is a managed marketplace. Every companion goes through a
          human verification pipeline, every session is monitored by our ops
          team, and every payment is held in escrow until after the dispute
          window. This page documents exactly how.
        </p>
      </section>

      {/* VERIFICATION PIPELINE */}
      <section className="border-y border-border bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-semibold">How we verify companions</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Six stages, all required, none automated to completion. A companion
            cannot accept bookings until every stage is cleared by a human.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {VERIFICATION.map((v, i) => (
              <div
                key={v.title}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  <v.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-3 font-semibold">{v.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RUNTIME SAFETY */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-3xl font-semibold">What happens during a session</h2>
        <div className="mt-8 space-y-4">
          {RUNTIME.map((r) => (
            <div
              key={r.title}
              className="flex gap-4 rounded-2xl border border-border bg-card p-5"
            >
              <r.icon className="h-6 w-6 flex-shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold">{r.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PAYMENTS */}
      <section className="border-y border-border bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-semibold">Payments &amp; escrow</h2>
          <ol className="mt-6 space-y-3 text-sm text-muted-foreground">
            <li>
              <span className="font-semibold text-foreground">1.</span> Traveler
              pays at checkout. Funds are authorised by Stripe.
            </li>
            <li>
              <span className="font-semibold text-foreground">2.</span> Once the
              companion accepts, the payment is held in escrow.
            </li>
            <li>
              <span className="font-semibold text-foreground">3.</span> Both
              parties check in at the meeting point.
            </li>
            <li>
              <span className="font-semibold text-foreground">4.</span> Upon
              check-out, a 24-hour dispute window opens.
            </li>
            <li>
              <span className="font-semibold text-foreground">5.</span> If no
              dispute is filed, the escrow releases and the companion is paid
              (minus the BEYON26 platform fee).
            </li>
            <li>
              <span className="font-semibold text-foreground">6.</span> If a
              dispute is filed, ops reviews the case manually and resolves.
            </li>
          </ol>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-3xl font-semibold">Double-blind reviews</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Travelers and companions write reviews for each other in parallel.
          Neither can see the other&apos;s review until both publish or 14 days
          pass. This removes retaliation and keeps scores honest.
        </p>
      </section>

      <section className="border-t border-border bg-[#05070f] px-6 py-16 text-white">
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Questions about our trust model?</h2>
            <p className="mt-2 text-sm text-blue-100/80">
              Our ops team responds within hours during the event window.
            </p>
          </div>
          <Link href="/how-it-works">
            <Button>See the full flow</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
