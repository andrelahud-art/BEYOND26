-- ============================================================================
-- Add missing RLS insert policies for companion onboarding
-- ============================================================================

-- COMPANION_LANGUAGES insert policy
drop policy if exists languages_self_insert on public.companion_languages;
create policy languages_self_insert on public.companion_languages
  for insert with check (public.is_companion_owner(companion_id));

-- COMPANION_SERVICE_AREAS insert policy
drop policy if exists service_areas_self_insert on public.companion_service_areas;
create policy service_areas_self_insert on public.companion_service_areas
  for insert with check (public.is_companion_owner(companion_id));

-- MESSAGE_THREADS insert policy (for booking creation)
drop policy if exists threads_booking_insert on public.message_threads;
create policy threads_booking_insert on public.message_threads
  for insert with check (
    booking_id in (
      select id from public.bookings
      where traveler_id = auth.uid()
         or public.is_companion_owner(companion_id)
    )
  );
