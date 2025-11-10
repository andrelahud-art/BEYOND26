'use client';

import { motion } from 'framer-motion';
import { Shield, UserCheck, HeartHandshake, Clock } from 'lucide-react';

const reasons = [
  {
    icon: Shield,
    title: 'Discretion First',
    description: 'Your privacy is paramount. Our Shadows are trained in confidentiality and operate with the utmost professionalism.',
  },
  {
    icon: UserCheck,
    title: 'Vetted Professionals',
    description: 'Every Shadow undergoes rigorous KYC, background checks, and continuous training to ensure excellence.',
  },
  {
    icon: HeartHandshake,
    title: 'Insured & Safe',
    description: 'Comprehensive liability insurance and safety protocols give you peace of mind throughout your journey.',
  },
  {
    icon: Clock,
    title: 'Always Available',
    description: '24/7 emergency support and real-time coordination ensure you\'re never alone when you need us.',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export function WhyBeyond26() {
  return (
    <section className="py-20 md:py-32 bg-card/30">
      <div className="container px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Why Beyond26
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            More than a concierge service—a commitment to excellence, safety, and unforgettable experiences.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid gap-8 md:grid-cols-2"
        >
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.title}
                variants={item}
                className="flex gap-4 rounded-2xl border border-border bg-card p-6"
              >
                <div className="shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold">{reason.title}</h3>
                  <p className="text-muted-foreground">{reason.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
