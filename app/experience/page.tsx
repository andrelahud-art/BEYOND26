'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Zap, Target, Shield } from 'lucide-react';
import { analytics } from '@/lib/analytics';

const pillars = [
  {
    icon: Shield,
    title: 'Trust',
    description: 'Built through rigorous vetting, continuous training, and unwavering commitment to your privacy and safety.',
  },
  {
    icon: Heart,
    title: 'Empathy',
    description: 'Understanding your needs before you voice them, adapting to your rhythm, and creating genuine human connections.',
  },
  {
    icon: Target,
    title: 'Precision',
    description: 'Flawless execution of every detail, from reservations to logistics, ensuring seamless experiences.',
  },
  {
    icon: Zap,
    title: 'Technology',
    description: 'AI-powered logistics and real-time coordination that works invisibly behind the scenes.',
  },
];

const timeline = [
  {
    phase: 'Arrival',
    description: 'Your Shadow greets you, handles logistics, and ensures smooth transit to your accommodation.',
  },
  {
    phase: 'Pre-Match',
    description: 'Restaurant reservations confirmed, transportation arranged, local insights shared.',
  },
  {
    phase: 'Match Day',
    description: 'On-site support, real-time problem-solving, and ensuring you focus solely on the experience.',
  },
  {
    phase: 'Evening',
    description: 'Nightlife coordination, safety oversight, and seamless transitions between venues.',
  },
  {
    phase: 'Departure',
    description: 'Final logistics handled, memories captured, and fond farewells.',
  },
];

export default function ExperiencePage() {
  useEffect(() => {
    analytics.viewExperience();
  }, []);

  return (
    <div className="py-20">
      {/* Header */}
      <section className="container px-4 md:px-8 text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            More than Service.<br />It's a Legacy of Presence.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Beyond26 redefines concierge service through the perfect blend of human intuition and technological precision.
          </p>
        </motion.div>
      </section>

      {/* Four Pillars */}
      <section className="container px-4 md:px-8 mb-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Four Pillars of Excellence
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl border border-border bg-card p-8"
              >
                <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{pillar.title}</h3>
                <p className="text-muted-foreground">{pillar.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-20 bg-card/30">
        <div className="container px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Journey with Beyond26
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From the moment you arrive to your fond farewell, we're with you every step of the way.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {timeline.map((phase, index) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-8 pb-12 last:pb-0"
              >
                {/* Timeline line */}
                {index !== timeline.length - 1 && (
                  <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-border" />
                )}

                {/* Timeline dot */}
                <div className="absolute left-0 top-0 h-6 w-6 rounded-full border-4 border-primary bg-background" />

                {/* Content */}
                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="text-xl font-bold mb-2">{phase.phase}</h3>
                  <p className="text-muted-foreground">{phase.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container px-4 md:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Experience the Beyond26 Difference
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join travelers who've discovered what it means to have a true Shadow.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-2xl bg-primary px-8 py-4 text-sm font-medium text-primary-foreground shadow-lg hover:bg-primary/90 transition-all"
          >
            Start Your Journey
          </a>
        </motion.div>
      </section>
    </div>
  );
}
