import Link from 'next/link';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { BadgeCheck, Video, UserCheck, GraduationCap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Become a companion — BEYON26',
  description:
    'Apply to join BEYON26 as a verified local companion in Ciudad de México.',
};

const STEPS = [
  {
    icon: BadgeCheck,
    title: 'Government ID + selfie liveness',
    body: 'Upload valid government ID and complete a liveness check.',
  },
  {
    icon: Video,
    title: '60-second intro video',
    body: 'Show us who you are. This is mandatory before review.',
  },
  {
    icon: UserCheck,
    title: 'Live interview with ops',
    body: 'We talk to every companion before approval. No exceptions.',
  },
  {
    icon: GraduationCap,
    title: 'Safety + conduct training',
    body: 'Check-in/check-out flow, SOS protocol, zone compliance.',
  },
];

export default function ApplyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Phase 1 — multi-step onboarding ships next
      </p>
      <h1 className="mt-3 text-4xl font-semibold">Apply as a companion</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        BEYON26 is a curated marketplace. Every companion goes through a
        four-stage verification before activation. We are actively recruiting
        30–50 locals in Ciudad de México for World Cup 2026.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {STEPS.map((s, i) => (
          <div
            key={s.title}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {i + 1}
              </span>
              <s.icon className="h-5 w-5 text-primary" />
            </div>
            <h2 className="mt-4 text-lg font-semibold">{s.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/auth/sign-up">
          <Button>Start application</Button>
        </Link>
        <Link href="/trust">
          <Button variant="secondary">Read trust policy</Button>
        </Link>
      </div>
    </main>
  );
}
