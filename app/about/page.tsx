'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Users, Award, Heart } from 'lucide-react';
import { analytics } from '@/lib/analytics';

const stats = [
  { label: 'Languages Supported', value: '4+' },
  { label: 'Vetted Shadows', value: '50+' },
  { label: 'Host Cities', value: '3' },
  { label: 'Customer Satisfaction', value: '99%' },
];

const values = [
  {
    icon: Globe,
    title: 'Global Standards, Local Expertise',
    description: 'We combine international hospitality standards with deep local knowledge and cultural awareness.',
  },
  {
    icon: Users,
    title: 'Human-First Approach',
    description: 'Technology enables us, but humanity defines us. Every Shadow is carefully selected and trained.',
  },
  {
    icon: Award,
    title: 'Excellence in Execution',
    description: 'From background checks to continuous training, we maintain the highest standards in the industry.',
  },
  {
    icon: Heart,
    title: 'Empathy & Discretion',
    description: 'We understand that privacy and personal boundaries are paramount to our high-profile clients.',
  },
];

export default function AboutPage() {
  useEffect(() => {
    analytics.viewAbout();
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
            Beyond Service.<br />Beyond Expectations.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Born in Mexico for the 2026 global stage, we merge human precision, AI logistics, and world-class hospitality.
          </p>
        </motion.div>
      </section>

      {/* Mission Statement */}
      <section className="container px-4 md:px-8 mb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our mission is to redefine how people experience major events—through presence, empathy, and flawless execution. We believe that every traveler deserves a Shadow: someone who anticipates needs, solves problems invisibly, and ensures that your focus remains on creating memories, not managing logistics.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-card/30">
        <div className="container px-4 md:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container px-4 md:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Values
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The principles that guide every interaction, every decision, and every Shadow experience.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 rounded-2xl border border-border bg-card p-6"
              >
                <div className="shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Team Note */}
      <section className="container px-4 md:px-8 py-20 text-center bg-card/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Built by Travelers, for Travelers
          </h2>
          <p className="text-lg text-muted-foreground mb-4">
            Our founding team combines decades of experience in luxury hospitality, event management, and technology. We've been the travelers who needed a Shadow—so we built Beyond26.
          </p>
          <p className="text-muted-foreground">
            Every member of our team, from Shadows to operations, undergoes rigorous background checks, continuous training, and adheres to strict codes of conduct and confidentiality.
          </p>
        </motion.div>
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
            Ready to Experience Beyond26?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Let's discuss how we can make your 2026 journey unforgettable.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-2xl bg-primary px-8 py-4 text-sm font-medium text-primary-foreground shadow-lg hover:bg-primary/90 transition-all"
          >
            Get in Touch
          </a>
        </motion.div>
      </section>
    </div>
  );
}
