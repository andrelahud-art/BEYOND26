'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Globe, Clock, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  title?: string;
  subtitle?: string;
}

const trustBadges = [
  { icon: Shield, text: 'Discreet' },
  { icon: Globe, text: 'Bilingual' },
  { icon: CheckCircle2, text: 'Insured' },
  { icon: Clock, text: 'GDPR Compliant' },
];

export function Hero({ title, subtitle }: HeroProps) {
  const defaultTitle = 'More than 2026. Beyond Experience.';
  const defaultSubtitle =
    'Shadow Concierge 24/7 for high-end travelers. Invisible when needed, invaluable when it counts.';

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card" />

      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Content */}
      <div className="container relative z-10 px-4 py-20 md:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
              {title || defaultTitle}
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              {subtitle || defaultSubtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button asChild size="lg" className="min-w-[200px]">
              <Link href="/choose-your-shadow">
                Choose Your Shadow <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="min-w-[200px]">
              <Link href="/contact">Book Now</Link>
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4"
          >
            {trustBadges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.text}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-border/50 bg-card/50 p-4 backdrop-blur"
                >
                  <Icon className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">{badge.text}</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
