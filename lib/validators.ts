import { z } from 'zod';

// Lead form validation schema
export const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  country: z.enum(['us', 'mx', 'fr', 'de'], {
    errorMap: () => ({ message: 'Please select a country' }),
  }),
  city: z.string().optional(),
  preferredDates: z.string().optional(),
  shadowType: z.enum(['conversationalist', 'balanced', 'silent']).optional(),
  packageId: z.enum(['matchday-lite', 'weekend-pro', 'elite-family', 'beyond-corporate']).optional(),
  message: z.string().max(1000, 'Message must be less than 1000 characters').optional(),
});

export type LeadFormData = z.infer<typeof leadSchema>;

// Quote form validation schema
export const quoteSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  country: z.enum(['us', 'mx', 'fr', 'de']),
  teamSize: z.number().min(4, 'Minimum team size is 4').max(20, 'Maximum team size is 20'),
  dates: z.string().min(1, 'Dates are required'),
  cities: z.array(z.string()).min(1, 'At least one city is required'),
  specialNeeds: z.string().max(2000).optional(),
});

export type QuoteFormData = z.infer<typeof quoteSchema>;

// Newsletter subscription
export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;
