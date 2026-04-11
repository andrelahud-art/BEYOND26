/**
 * Central Zod schemas. Every API route and form validates against one of
 * these. The rule: if data crosses a boundary, it must be parsed here first.
 */
import { z } from 'zod';
import {
  SERVICE_DURATIONS,
  SERVICE_TYPES,
  USER_ROLES,
} from '@/lib/utils/constants';

// ---------- Auth ----------
export const signInSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'At least 8 characters'),
});
export type SignInInput = z.infer<typeof signInSchema>;

export const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    fullName: z.string().min(2).max(100),
    role: z.enum(['traveler', 'companion']).default('traveler'),
    termsAccepted: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms' }),
    }),
  })
  .strict();
export type SignUpInput = z.infer<typeof signUpSchema>;

export const completeProfileSchema = z.object({
  fullName: z.string().min(2).max(100),
  phone: z.string().min(7).max(20).optional(),
  locale: z.string().length(2).default('en'),
});
export type CompleteProfileInput = z.infer<typeof completeProfileSchema>;

// ---------- Search ----------
export const searchSchema = z.object({
  citySlug: z.string().min(1).default('cdmx'),
  serviceType: z.enum(SERVICE_TYPES).optional(),
  zoneSlug: z.string().optional(),
  languageCode: z.string().length(2).optional(),
  durationMinutes: z
    .coerce.number()
    .refine((n) => (SERVICE_DURATIONS as readonly number[]).includes(n), {
      message: 'Invalid duration',
    })
    .optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  startAt: z.string().datetime().optional(),
  endAt: z.string().datetime().optional(),
});
export type SearchInput = z.infer<typeof searchSchema>;

// ---------- Booking request ----------
export const createBookingSchema = z.object({
  companionId: z.string().uuid(),
  serviceOfferingId: z.string().uuid(),
  slotId: z.string().uuid().optional(),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  groupSize: z.number().int().min(1).max(10),
  meetingPointName: z.string().min(3).max(200),
  meetingPointLat: z.number().optional(),
  meetingPointLng: z.number().optional(),
  meetingPointInstructions: z.string().max(1000).optional(),
  zoneId: z.string().uuid().optional(),
  travelerNotes: z.string().max(2000).optional(),
});
export type CreateBookingInput = z.infer<typeof createBookingSchema>;

// ---------- Companion application ----------
export const companionApplicationSchema = z.object({
  displayName: z.string().min(2).max(60),
  bio: z.string().min(80, 'At least 80 characters').max(1200),
  cityId: z.string().uuid(),
  introVideoUrl: z.string().url('Intro video is required'),
  languages: z
    .array(
      z.object({
        code: z.string().length(2),
        proficiency: z.enum(['native', 'fluent', 'conversational']),
      })
    )
    .min(1, 'At least one language'),
  zoneIds: z.array(z.string().uuid()).min(1, 'Pick at least one service zone'),
  offerings: z
    .array(
      z.object({
        serviceType: z.enum(SERVICE_TYPES),
        title: z.string().min(4).max(120),
        description: z.string().min(20).max(1000),
        durationMinutes: z.number().refine((n) =>
          (SERVICE_DURATIONS as readonly number[]).includes(n)
        ),
        basePrice: z.number().positive(),
        maxGroupSize: z.number().int().min(1).max(10),
      })
    )
    .min(1, 'At least one offering'),
  emergencyContactName: z.string().min(2).max(100),
  emergencyContactPhone: z.string().min(7).max(20),
});
export type CompanionApplicationInput = z.infer<typeof companionApplicationSchema>;

// ---------- Reviews ----------
const scoreField = z.coerce.number().min(1).max(5);

export const submitReviewSchema = z.object({
  bookingId: z.string().uuid(),
  scoreOverall: scoreField,
  scoreCommunication: scoreField.optional(),
  scorePunctuality: scoreField.optional(),
  scoreSafety: scoreField.optional(),
  scoreKnowledge: scoreField.optional(),
  scoreValue: scoreField.optional(),
  wouldRepeat: z.boolean().optional(),
  comment: z.string().max(2000).optional(),
});
export type SubmitReviewInput = z.infer<typeof submitReviewSchema>;

// ---------- Incidents / SOS ----------
export const reportIncidentSchema = z.object({
  bookingId: z.string().uuid().optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  category: z.enum([
    'no_show',
    'late_arrival',
    'safety_concern',
    'harassment',
    'misrepresentation',
    'payment_dispute',
    'zone_violation',
    'other',
  ]),
  description: z.string().min(10).max(4000),
  evidenceUrls: z.array(z.string().url()).optional(),
});
export type ReportIncidentInput = z.infer<typeof reportIncidentSchema>;

export const sosTriggerSchema = z.object({
  bookingId: z.string().uuid(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});
export type SosTriggerInput = z.infer<typeof sosTriggerSchema>;

// ---------- Admin actions ----------
export const adminRoleAssignSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(USER_ROLES),
});
