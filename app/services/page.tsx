'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { PackageCard } from '@/components/PackageCard';
import { PACKAGES, ADD_ONS } from '@/lib/data/packages';
import { analytics } from '@/lib/analytics';
import { Check } from 'lucide-react';

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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ServicesPage() {
  useEffect(() => {
    analytics.viewServices();
  }, []);

  return (
    <div className="py-20">
      {/* Header */}
      <section className="container px-4 md:px-8 text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Concierge Redefined
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Premium Shadow services designed for the modern traveler. Choose the package that fits your journey.
          </p>
        </motion.div>
      </section>

      {/* Packages Grid */}
      <section className="container px-4 md:px-8 mb-20">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-6xl mx-auto"
        >
          {PACKAGES.map((pkg, index) => (
            <motion.div key={pkg.id} variants={item}>
              <PackageCard
                package={pkg}
                featured={pkg.id === 'weekend-pro'}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Add-Ons Section */}
      <section className="container px-4 md:px-8 py-20 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Premium Add-Ons
            </h2>
            <p className="text-lg text-muted-foreground">
              Enhance your experience with our curated selection of additional services.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-2"
          >
            {ADD_ONS.map((addon) => (
              <motion.div
                key={addon.id}
                variants={item}
                className="flex gap-4 rounded-2xl border border-border bg-card p-6"
              >
                <div className="shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{addon.name}</h3>
                    <span className="text-primary font-semibold whitespace-nowrap ml-4">
                      ${addon.basePrice}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {addon.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {addon.unit}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 md:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Book Your Shadow?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Contact us to discuss your needs, or book directly through our scheduling system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-2xl bg-primary px-8 py-4 text-sm font-medium text-primary-foreground shadow-lg hover:bg-primary/90 transition-all"
            >
              Contact Us
            </a>
            <a
              href="/choose-your-shadow"
              className="inline-flex items-center justify-center rounded-2xl border-2 border-primary px-8 py-4 text-sm font-medium hover:bg-primary/10 transition-all"
            >
              Choose Your Shadow
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
