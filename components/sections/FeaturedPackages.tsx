'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PackageCard } from '@/components/PackageCard';
import { PACKAGES } from '@/lib/data/packages';
import { CountryCode } from '@/lib/types';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

interface FeaturedPackagesProps {
  country?: CountryCode;
}

export function FeaturedPackages({ country = 'us' }: FeaturedPackagesProps) {
  // Show first 3 packages on home page
  const featuredPackages = PACKAGES.slice(0, 3);

  return (
    <section className="py-20 md:py-32">
      <div className="container px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Choose Your Package
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From matchday essentials to comprehensive family coverage, we have the perfect Shadow package for your needs.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {featuredPackages.map((pkg, index) => (
            <motion.div key={pkg.id} variants={item}>
              <PackageCard
                package={pkg}
                country={country}
                featured={index === 1} // Make middle package (Weekend Pro) featured
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 text-center">
          <Button asChild size="lg" variant="secondary">
            <Link href="/services">
              View All Packages <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
