'use client';

import { motion } from 'framer-motion';
import { Sparkles, Crown, Users } from 'lucide-react';

const values = [
  {
    icon: Sparkles,
    title: 'Beyond Service.',
    description: 'Elite human assistance powered by AI logistics for seamless experiences.',
  },
  {
    icon: Crown,
    title: 'Beyond Luxury.',
    description: 'Precision hospitality with zero friction, designed for discerning travelers.',
  },
  {
    icon: Users,
    title: 'Beyond You.',
    description: 'Three unique archetypes. Your pace, your style, your perfect Shadow.',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function ValueTriptych() {
  return (
    <section className="py-20 md:py-32">
      <div className="container px-4 md:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid gap-8 md:grid-cols-3"
        >
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                variants={item}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
