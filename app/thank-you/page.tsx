'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ThankYouPage() {
  return (
    <div className="py-20">
      <div className="container px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="mb-8 inline-flex items-center justify-center rounded-full bg-primary/10 p-6">
            <CheckCircle2 className="h-16 w-16 text-primary" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Thank You!
          </h1>

          <p className="text-lg text-muted-foreground mb-8">
            We've received your inquiry and will get back to you within 24 hours.
            One of our team members will reach out to discuss your needs and answer any questions.
          </p>

          <div className="rounded-2xl border border-border bg-card p-8 mb-8">
            <h2 className="text-xl font-semibold mb-4">What Happens Next?</h2>
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  1
                </div>
                <div>
                  <p className="font-medium">Confirmation Email</p>
                  <p className="text-sm text-muted-foreground">
                    You'll receive an email confirmation of your inquiry shortly.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  2
                </div>
                <div>
                  <p className="font-medium">Personal Consultation</p>
                  <p className="text-sm text-muted-foreground">
                    Our team will contact you to discuss your travel plans and preferences.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  3
                </div>
                <div>
                  <p className="font-medium">Customized Proposal</p>
                  <p className="text-sm text-muted-foreground">
                    We'll create a tailored package based on your needs and send you a detailed proposal.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  4
                </div>
                <div>
                  <p className="font-medium">Book Your Shadow</p>
                  <p className="text-sm text-muted-foreground">
                    Once approved, we'll finalize your booking and assign your perfect Shadow.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Need immediate assistance?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:hello@beyond26.com"
                className="inline-flex items-center justify-center gap-2 text-sm text-primary hover:underline"
              >
                <Mail className="h-4 w-4" />
                hello@beyond26.com
              </a>
              <a
                href="tel:+15551234567"
                className="inline-flex items-center justify-center gap-2 text-sm text-primary hover:underline"
              >
                <Phone className="h-4 w-4" />
                +1 (555) 123-4567
              </a>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">
              While you wait, explore more about our services
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="secondary">
                <Link href="/services">
                  View All Packages
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/">
                  Return Home <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
