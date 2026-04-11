-- ============================================================================
-- Add auto-publish and SOS features to BEYON26
-- ============================================================================

-- Add auto-publish window to reviews
alter table public.reviews
  add column if not exists auto_publish_at timestamptz;

-- Add status field to safety_sessions
alter table public.safety_sessions
  add column if not exists status text check (status in (
    'pending_checkin', 'active', 'checked_out', 'alert_triggered'
  )) default 'pending_checkin';

alter table public.safety_sessions
  add column if not exists alert_triggered_at timestamptz;

alter table public.safety_sessions
  add column if not exists alert_type text check (alert_type in ('panic', 'no_checkin', 'overtime', 'zone_exit'));

-- Add incident_id to sos_alerts to link back to incident
alter table public.sos_alerts
  add column if not exists incident_id uuid references public.incidents(id);

-- Create index for auto-publish queries
create index if not exists idx_reviews_auto_publish
  on public.reviews(auto_publish_at, is_published)
  where is_published = false and auto_publish_at is not null;

-- Create index for active SOS alerts
create index if not exists idx_sos_alerts_active
  on public.sos_alerts(booking_id)
  where resolved_at is null;
