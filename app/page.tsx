'use client';

import { useEffect } from 'react';
import { Hero } from '@/components/sections/Hero';
import { ValueTriptych } from '@/components/sections/ValueTriptych';
import { FeaturedPackages } from '@/components/sections/FeaturedPackages';
import { CountryTabsPreview } from '@/components/sections/CountryTabsPreview';
import { WhyBeyond26 } from '@/components/sections/WhyBeyond26';
import { analytics } from '@/lib/analytics';

export default function Home() {
  useEffect(() => {
    analytics.viewHome();
  }, []);

  return (
    <>
      <Hero />
      <ValueTriptych />
      <CountryTabsPreview />
      <FeaturedPackages />
      <WhyBeyond26 />
    </>
  );
}
