'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Phone, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { leadSchema, type LeadFormData } from '@/lib/validators';
import { COUNTRIES } from '@/lib/data/countries';
import { PACKAGES } from '@/lib/data/packages';
import { SHADOW_ARCHETYPES } from '@/lib/data/shadows';
import { analytics } from '@/lib/analytics';
import { generateWhatsAppLink } from '@/lib/utils';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP || '15551234567';

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      shadowType: (searchParams.get('shadow') as any) || undefined,
      packageId: (searchParams.get('package') as any) || undefined,
    },
  });

  const selectedPackage = watch('packageId');
  const selectedShadow = watch('shadowType');

  useEffect(() => {
    analytics.viewContact();
  }, []);

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Submission failed');

      const result = await response.json();

      analytics.leadSubmit({
        country: data.country,
        packageId: data.packageId,
        shadowType: data.shadowType,
      });

      setSubmitMessage({ type: 'success', text: 'Thank you! We\'ll be in touch shortly.' });

      setTimeout(() => {
        router.push('/thank-you');
      }, 2000);
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppClick = () => {
    const pkg = selectedPackage ? PACKAGES.find(p => p.id === selectedPackage)?.name : '';
    const shadow = selectedShadow ? SHADOW_ARCHETYPES.find(s => s.id === selectedShadow)?.name : '';

    const message = `Hi Beyond26, I'd like to learn more about ${pkg || 'your services'}${shadow ? ` with ${shadow}` : ''}.`;

    analytics.whatsappClick(selectedPackage, selectedShadow);

    window.open(generateWhatsAppLink({ phone: WHATSAPP_NUMBER, message }), '_blank');
  };

  return (
    <div className="grid gap-12 lg:grid-cols-3">
      {/* Contact Info */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-6"
      >
        <div>
          <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
          <p className="text-muted-foreground mb-6">
            Choose your preferred method of contact. We respond within 24 hours.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-semibold">Email</div>
              <a href="mailto:hello@beyond26.com" className="text-sm text-muted-foreground hover:text-primary">
                hello@beyond26.com
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-semibold">Phone</div>
              <a href={`tel:+${WHATSAPP_NUMBER}`} className="text-sm text-muted-foreground hover:text-primary">
                +1 (555) 123-4567
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-semibold">WhatsApp</div>
              <button
                onClick={handleWhatsAppClick}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Chat with us
              </button>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            <strong>Office Hours:</strong><br />
            Monday - Friday: 9:00 AM - 6:00 PM (CST)<br />
            24/7 emergency support for active bookings
          </p>
        </div>
      </motion.div>

      {/* Contact Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="lg:col-span-2"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-2xl border border-border bg-card p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="John Doe"
                className="mt-2"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="john@example.com"
                className="mt-2"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                {...register('phone')}
                placeholder="+1 (555) 123-4567"
                className="mt-2"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="country">Country *</Label>
              <Select id="country" {...register('country')} className="mt-2">
                <option value="">Select a country</option>
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </Select>
              {errors.country && (
                <p className="mt-1 text-sm text-destructive">{errors.country.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                {...register('city')}
                placeholder="Mexico City"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="preferredDates">Preferred Dates</Label>
              <Input
                id="preferredDates"
                {...register('preferredDates')}
                placeholder="June 15-18, 2026"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="shadowType">Shadow Type</Label>
              <Select id="shadowType" {...register('shadowType')} className="mt-2">
                <option value="">Select a shadow type</option>
                {SHADOW_ARCHETYPES.map((shadow) => (
                  <option key={shadow.id} value={shadow.id}>
                    {shadow.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="packageId">Package</Label>
              <Select id="packageId" {...register('packageId')} className="mt-2">
                <option value="">Select a package</option>
                {PACKAGES.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              {...register('message')}
              placeholder="Tell us about your travel plans..."
              className="mt-2"
              rows={4}
            />
            {errors.message && (
              <p className="mt-1 text-sm text-destructive">{errors.message.message}</p>
            )}
          </div>

          {submitMessage && (
            <div
              className={`rounded-xl p-4 ${
                submitMessage.type === 'success'
                  ? 'bg-primary/10 text-primary'
                  : 'bg-destructive/10 text-destructive'
              }`}
            >
              {submitMessage.text}
            </div>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Inquiry
            </Button>
            <Button type="button" variant="secondary" onClick={handleWhatsAppClick}>
              <MessageSquare className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
