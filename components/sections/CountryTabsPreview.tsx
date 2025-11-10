'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { COUNTRIES } from '@/lib/data/countries';

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
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1 },
};

export function CountryTabsPreview() {
  return (
    <section className="py-20 md:py-32 bg-card/30">
      <div className="container px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Available for 2026 Travelers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select your region for localized information, pricing, and language support.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {COUNTRIES.map((country) => (
            <motion.div key={country.code} variants={item}>
              <Link
                href={`/countries/${country.code}`}
                className="group block rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-xl"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 text-6xl">{country.flag}</div>
                  <h3 className="mb-2 text-xl font-semibold group-hover:text-primary">
                    {country.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {country.currency} pricing
                  </p>
                  <div className="flex items-center text-sm text-primary">
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
