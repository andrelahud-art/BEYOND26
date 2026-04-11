/**
 * BEYON26 constants. Keep business tunables here so they are auditable by ops.
 */

export const BRAND = {
  name: 'BEYON26',
  tagline: 'Verified local companions for World Cup 2026',
  supportEmail: 'support@beyon26.com',
  opsEmail: 'ops@beyon26.com',
} as const;

// Platform economics
export const PLATFORM_FEE_PERCENT = Number(
  process.env.PLATFORM_FEE_PERCENT ?? 15
);

// Booking windows
export const DISPUTE_WINDOW_HOURS = 24;
export const REVIEW_WINDOW_DAYS = 14;
export const SAFETY_TIMER_BUFFER_MIN = 60;

// Service catalog (v1 is intentionally small)
export const SERVICE_TYPES = [
  'event_companion',
  'city_guide',
  'translator',
] as const;
export type ServiceType = (typeof SERVICE_TYPES)[number];

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  event_companion: 'Event companion',
  city_guide: 'City guide',
  translator: 'Translator',
};

// Only 2h, 4h, full-day (8h)
export const SERVICE_DURATIONS = [120, 240, 480] as const;
export type ServiceDuration = (typeof SERVICE_DURATIONS)[number];

export const SERVICE_DURATION_LABELS: Record<ServiceDuration, string> = {
  120: '2 hours',
  240: '4 hours',
  480: 'Full day (8h)',
};

// Roles
export const USER_ROLES = [
  'traveler',
  'companion',
  'admin',
  'ops',
] as const;
export type UserRole = (typeof USER_ROLES)[number];

// Booking state machine (source of truth is lib/booking/state-machine.ts)
export const BOOKING_STATUSES = [
  'pending',
  'confirmed',
  'declined',
  'cancelled',
  'in_progress',
  'completed',
  'refunded',
  'disputed',
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

// Approval pipeline
export const APPROVAL_STATUSES = [
  'draft',
  'pending_review',
  'interview_scheduled',
  'approved',
  'rejected',
  'suspended',
] as const;
export type ApprovalStatus = (typeof APPROVAL_STATUSES)[number];

// Trust thresholds
export const TRUST_SCORE_INSTANT_BOOK = 85;
export const TRUST_SCORE_FEATURED = 90;

// Demo mode gate
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
