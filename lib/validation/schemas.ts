/**
 * Expanded validation schemas for Phase 1+
 * Adds booking, reviews, safety, and admin schemas
 */
import { z } from 'zod';
import { SERVICE_DURATIONS, SERVICE_TYPES } from '@/lib/utils/constants';

// ===== AUTH SCHEMAS (Phase 0) =====
export const signInSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
export type SignInInput = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms',
  }),
});
export type SignUpInput = z.infer<typeof signUpSchema>;

export const completeProfileSchema = z.object({
  fullName: z.string().min(2).max(100),
  phone: z.string().optional(),
  locale: z.string().optional(),
});
export type CompleteProfileInput = z.infer<typeof completeProfileSchema>;

// ===== COMPANION APPLICATION — Multi-step =====
export const companionApplicationStep1Schema = z.object({
  displayName: z.string().min(2).max(60),
  bio: z.string().min(80).max(1200),
  emergencyContactName: z.string().min(2).max(100),
  emergencyContactPhone: z.string().min(7).max(20),
});
export type CompanionApplicationStep1 = z.infer<typeof companionApplicationStep1Schema>;

export const companionApplicationStep2Schema = z.object({
  cityId: z.string().uuid(),
  languages: z
    .array(
      z.object({
        languageId: z.string().uuid(),
        proficiency: z.enum(['native', 'fluent', 'conversational']),
      })
    )
    .min(1, 'At least one language'),
});
export type CompanionApplicationStep2 = z.infer<typeof companionApplicationStep2Schema>;

export const companionApplicationStep3Schema = z.object({
  zoneIds: z.array(z.string().uuid()).min(1, 'Pick at least one service zone'),
});
export type CompanionApplicationStep3 = z.infer<typeof companionApplicationStep3Schema>;

export const companionApplicationStep4Schema = z.object({
  offerings: z
    .array(
      z.object({
        serviceType: z.enum(SERVICE_TYPES),
        title: z.string().min(4).max(120),
        description: z.string().min(20).max(1000),
        durationMinutes: z.number().refine((n) =>
          (SERVICE_DURATIONS as readonly number[]).includes(n)
        ),
        basePrice: z.number().positive('Price must be positive'),
        maxGroupSize: z.number().int().min(1).max(10),
        inclusions: z.string().max(500).optional(),
        exclusions: z.string().max(500).optional(),
      })
    )
    .min(1, 'At least one offering'),
});
export type CompanionApplicationStep4 = z.infer<typeof companionApplicationStep4Schema>;

export const companionApplicationStep5Schema = z.object({
  governmentIdUrl: z.string().url('Upload government ID'),
  selfieUrl: z.string().url('Upload selfie'),
  introVideoUrl: z.string().url('Intro video is required'),
});
export type CompanionApplicationStep5 = z.infer<typeof companionApplicationStep5Schema>;

// ===== BOOKING =====
export const createBookingSchema = z.object({
  companionId: z.string().uuid(),
  serviceOfferingId: z.string().uuid(),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  groupSize: z.number().int().min(1).max(10),
  basePrice: z.number().positive('Price must be positive'),
  meetingPointName: z.string().min(3).max(200),
  meetingPointLat: z.number().min(-90).max(90).optional(),
  meetingPointLng: z.number().min(-180).max(180).optional(),
  meetingPointInstructions: z.string().max(1000).optional(),
  zoneId: z.string().uuid().optional(),
  travelerNotes: z.string().max(2000).optional(),
});
export type CreateBookingInput = z.infer<typeof createBookingSchema>;

// ===== STRIPE CHECKOUT =====
export const checkoutSessionSchema = z.object({
  bookingId: z.string().uuid(),
});
export type CheckoutSessionInput = z.infer<typeof checkoutSessionSchema>;

// ===== BOOKING ACTIONS =====
export const acceptBookingSchema = z.object({
  bookingId: z.string().uuid(),
});

export const declineBookingSchema = z.object({
  bookingId: z.string().uuid(),
  reason: z.string().max(500).optional(),
});

export const checkInSchema = z.object({
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  method: z.enum(['code', 'gps', 'manual']).default('manual'),
});

export const checkOutSchema = z.object({
  method: z.enum(['mutual_confirm', 'auto_timer', 'manual']).default('mutual_confirm'),
});

// ===== REVIEWS =====
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

// ===== SAFETY / SOS =====
export const sosTriggerSchema = z.object({
  bookingId: z.string().uuid(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  alertType: z.enum(['panic', 'no_checkin', 'overtime', 'zone_exit']).default('panic'),
});
export type SosTriggerInput = z.infer<typeof sosTriggerSchema>;

// ===== INCIDENTS =====
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

// ===== ADMIN =====
export const approveCompanionSchema = z.object({
  companionId: z.string().uuid(),
  reason: z.string().optional(),
});

export const assignBookingSchema = z.object({
  bookingId: z.string().uuid(),
  companionId: z.string().uuid(),
  reason: z.string().optional(),
});

export const resolveIncidentSchema = z.object({
  incidentId: z.string().uuid(),
  resolution: z.string().min(10).max(2000),
  outcome: z.enum(['completed', 'partial_refund', 'full_refund']).optional(),
});
