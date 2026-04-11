/**
 * Provider-agnostic analytics wrapper.
 * Wired to PostHog in Phase 3, but every call site uses this interface.
 *
 * Event names are lower_snake_case. The payload is intentionally flat.
 */

export type BeyonEvent =
  // Acquisition
  | 'landing_viewed'
  | 'hero_search_submitted'
  // Discovery
  | 'explore_viewed'
  | 'companion_profile_viewed'
  | 'filter_applied'
  // Booking funnel
  | 'booking_requested'
  | 'booking_checkout_started'
  | 'booking_paid'
  | 'booking_accepted'
  | 'booking_declined'
  | 'booking_cancelled'
  // Session ops
  | 'safety_session_checkin'
  | 'safety_session_checkout'
  | 'safety_sos_triggered'
  // Supply
  | 'companion_application_started'
  | 'companion_application_submitted'
  | 'companion_approved'
  // Reviews
  | 'review_submitted'
  | 'review_published';

export function track(
  event: BeyonEvent,
  properties: Record<string, unknown> = {}
): void {
  if (typeof window === 'undefined') return;

  // Phase 0: console-based. Phase 3 will swap in PostHog.
  // eslint-disable-next-line no-console
  console.debug('[analytics]', event, properties);

  // Preserve the legacy GA4 wrapper if it's still mounted.
  const gtag = (window as any).gtag as
    | ((...args: unknown[]) => void)
    | undefined;
  if (gtag) gtag('event', event, properties);
}
