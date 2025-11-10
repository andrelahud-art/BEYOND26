'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Hero } from '@/components/sections/Hero';
import { FeaturedPackages } from '@/components/sections/FeaturedPackages';
import { WhyBeyond26 } from '@/components/sections/WhyBeyond26';
import { getCountryByCode } from '@/lib/data/countries';
import { analytics } from '@/lib/analytics';
import { CountryCode } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function CountryPage() {
  const params = useParams();
  const countryCode = params.country as CountryCode;
  const country = getCountryByCode(countryCode);

  useEffect(() => {
    if (countryCode) {
      analytics.selectCountryTab(countryCode);
    }
  }, [countryCode]);

  if (!country) {
    return (
      <div className="py-20">
        <div className="container px-4 md:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Country Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The country you're looking for doesn't exist in our system.
          </p>
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Hero title={country.hero.title} subtitle={country.hero.subtitle} />

      {/* Country-Specific Content */}
      <section className="py-20 bg-card/30">
        <div className="container px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="rounded-2xl border border-border bg-card p-8 md:p-12">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-6xl">{country.flag}</span>
                <div>
                  <h2 className="text-3xl font-bold">{country.name}</h2>
                  <p className="text-muted-foreground">
                    Pricing in {country.currency}
                  </p>
                </div>
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-lg leading-relaxed">{country.content}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Packages with local pricing */}
      <FeaturedPackages country={countryCode} />

      {/* Why Beyond26 */}
      <WhyBeyond26 />

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
            Book your Shadow today and make 2026 unforgettable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">
                Contact Us <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </>
  );
}
