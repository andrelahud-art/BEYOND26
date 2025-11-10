'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MessageCircle, Users, EyeOff, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SHADOW_ARCHETYPES } from '@/lib/data/shadows';
import { analytics } from '@/lib/analytics';
import { ShadowType } from '@/lib/types';

const shadowIcons = {
  conversationalist: MessageCircle,
  balanced: Users,
  silent: EyeOff,
};

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

export default function ChooseYourShadowPage() {
  const [selectedShadow, setSelectedShadow] = useState<ShadowType | null>(null);

  useEffect(() => {
    analytics.viewShadowPicker();
  }, []);

  const handleSelectShadow = (shadowId: ShadowType) => {
    setSelectedShadow(shadowId);
    analytics.selectShadow(shadowId);
  };

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
            Choose Your Shadow
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Every traveler deserves a Shadow that fits. Select the archetype that matches your style and comfort level.
          </p>
        </motion.div>
      </section>

      {/* Shadow Archetypes */}
      <section className="container px-4 md:px-8 mb-20">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto"
        >
          {SHADOW_ARCHETYPES.map((shadow) => {
            const Icon = shadowIcons[shadow.id];
            const isSelected = selectedShadow === shadow.id;

            return (
              <motion.div key={shadow.id} variants={item}>
                <Card
                  className={`group cursor-pointer transition-all hover:shadow-2xl ${
                    isSelected ? 'border-primary shadow-xl' : ''
                  }`}
                  onClick={() => handleSelectShadow(shadow.id)}
                >
                  {isSelected && (
                    <div className="absolute -top-3 right-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                      Selected
                    </div>
                  )}

                  <CardHeader>
                    <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 w-fit">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{shadow.name}</CardTitle>
                    <CardDescription className="text-base pt-2">
                      {shadow.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                        Ideal For:
                      </h4>
                      <ul className="space-y-2">
                        {shadow.idealFor.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                        Characteristics:
                      </h4>
                      <ul className="space-y-2">
                        {shadow.characteristics.slice(0, 3).map((char, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-primary">•</span>
                            <span>{char}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button
                      asChild
                      className="w-full"
                      variant={isSelected ? 'primary' : 'secondary'}
                    >
                      <Link href={`/contact?shadow=${shadow.id}`}>
                        Book {shadow.name} <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Comparison Note */}
      <section className="container px-4 md:px-8 py-16 bg-card/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Not sure which Shadow is right for you?
          </h2>
          <p className="text-muted-foreground mb-6">
            Our team can help you select the perfect archetype based on your travel style, group composition, and personal preferences.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/contact">Schedule a Consultation</Link>
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
