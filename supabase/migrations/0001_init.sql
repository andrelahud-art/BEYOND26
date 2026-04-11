-- ============================================================================
-- BEYON26 — Initial schema (Phase 0)
-- ============================================================================
-- Managed marketplace for verified local companions during mega-events.
-- One city, one event, one window, curated supply. Safety is architectural.
-- ============================================================================

-- Required extensions
create extension if not exists "pgcrypto";

-- ============================================================================
-- 1. USERS  (mirrors auth.users; our domain profile)
-- ============================================================================
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  phone text,
  role text not null check (role in ('traveler', 'companion', 'admin', 'ops')) default 'traveler',
  status text not null check (status in ('active', 'suspended', 'banned')) default 'active',
  full_name text,
  avatar_url text,
  locale text default 'en',
  terms_accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 2. CITIES & ZONES
-- ============================================================================
create table if not exists public.cities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  country text not null default 'MX',
  timezone text not null,
  is_active boolean not null default false,
  hero_image_url text,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.service_zones (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  name text not null,
  slug text not null,
  polygon_geojson jsonb,
  is_approved boolean not null default true,
  risk_level text not null check (risk_level in ('low', 'medium', 'high')) default 'low',
  created_at timestamptz not null default now(),
  unique (city_id, slug)
);

-- ============================================================================
-- 3. COMPANION PROFILES
-- ============================================================================
create table if not exists public.companion_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  display_name text not null,
  bio text,
  city_id uuid not null references public.cities(id),
  intro_video_url text,
  response_rate numeric(5,2) not null default 0,
  completion_rate numeric(5,2) not null default 0,
  avg_rating numeric(3,2) not null default 0,
  total_reviews integer not null default 0,
  total_completed integer not null default 0,
  trust_score numeric(5,2) not null default 0,
  approval_status text not null check (approval_status in (
    'draft', 'pending_review', 'interview_scheduled', 'approved', 'rejected', 'suspended'
  )) default 'draft',
  approved_at timestamptz,
  approved_by uuid references public.users(id),
  is_instant_book_enabled boolean not null default false,
  max_daily_hours integer not null default 8,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 4. COMPANION VERIFICATIONS
-- ============================================================================
create table if not exists public.companion_verifications (
  id uuid primary key default gen_random_uuid(),
  companion_id uuid not null unique references public.companion_profiles(id) on delete cascade,
  government_id_status text not null check (government_id_status in ('pending', 'verified', 'rejected', 'expired')) default 'pending',
  government_id_url text,
  selfie_liveness_status text not null check (selfie_liveness_status in ('pending', 'verified', 'rejected')) default 'pending',
  selfie_url text,
  background_check_status text not null check (background_check_status in ('pending', 'clear', 'flagged', 'unavailable')) default 'pending',
  background_check_provider text,
  background_check_ref text,
  interview_status text not null check (interview_status in ('not_scheduled', 'scheduled', 'completed', 'failed')) default 'not_scheduled',
  interview_date timestamptz,
  interview_notes text,
  references_status text not null check (references_status in ('pending', 'verified', 'insufficient')) default 'pending',
  training_completed boolean not null default false,
  training_completed_at timestamptz,
  verified_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 5. LANGUAGES
-- ============================================================================
create table if not exists public.languages (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null
);

create table if not exists public.companion_languages (
  companion_id uuid not null references public.companion_profiles(id) on delete cascade,
  language_id uuid not null references public.languages(id) on delete cascade,
  proficiency text not null check (proficiency in ('native', 'fluent', 'conversational')),
  primary key (companion_id, language_id)
);

-- ============================================================================
-- 6. SERVICE AREAS
-- ============================================================================
create table if not exists public.companion_service_areas (
  id uuid primary key default gen_random_uuid(),
  companion_id uuid not null references public.companion_profiles(id) on delete cascade,
  zone_id uuid not null references public.service_zones(id) on delete cascade,
  priority integer not null default 1,
  unique (companion_id, zone_id)
);

-- ============================================================================
-- 7. SERVICE OFFERINGS (Catalog)
-- ============================================================================
create table if not exists public.service_offerings (
  id uuid primary key default gen_random_uuid(),
  companion_id uuid not null references public.companion_profiles(id) on delete cascade,
  service_type text not null check (service_type in ('event_companion', 'city_guide', 'translator')),
  title text not null,
  description text,
  duration_minutes integer not null check (duration_minutes in (120, 240, 480)),
  base_price numeric(10,2) not null,
  currency text not null default 'USD',
  max_group_size integer not null default 1,
  inclusions text[],
  exclusions text[],
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 8. AVAILABILITY
-- ============================================================================
create table if not exists public.availability_slots (
  id uuid primary key default gen_random_uuid(),
  companion_id uuid not null references public.companion_profiles(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null check (status in ('available', 'booked', 'blocked')) default 'available',
  buffer_before_min integer not null default 30,
  buffer_after_min integer not null default 30,
  created_at timestamptz not null default now(),
  constraint valid_slot check (ends_at > starts_at)
);

create table if not exists public.blackout_dates (
  id uuid primary key default gen_random_uuid(),
  companion_id uuid not null references public.companion_profiles(id) on delete cascade,
  date date not null,
  reason text,
  unique (companion_id, date)
);

-- ============================================================================
-- 9. BOOKINGS
-- ============================================================================
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  traveler_id uuid not null references public.users(id),
  companion_id uuid not null references public.companion_profiles(id),
  service_offering_id uuid not null references public.service_offerings(id),
  slot_id uuid references public.availability_slots(id),
  booking_status text not null check (booking_status in (
    'pending', 'confirmed', 'declined', 'cancelled', 'in_progress', 'completed', 'refunded', 'disputed'
  )) default 'pending',
  start_at timestamptz not null,
  end_at timestamptz not null,
  meeting_point_name text,
  meeting_point_lat numeric(10,7),
  meeting_point_lng numeric(10,7),
  meeting_point_instructions text,
  zone_id uuid references public.service_zones(id),
  group_size integer not null default 1,
  traveler_notes text,
  base_price numeric(10,2) not null,
  platform_fee numeric(10,2) not null,
  companion_payout numeric(10,2) not null,
  total_charged numeric(10,2) not null,
  currency text not null default 'USD',
  payment_status text check (payment_status in ('pending', 'authorized', 'captured', 'refunded', 'failed')) default 'pending',
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,
  assigned_by uuid references public.users(id),
  cancelled_by text check (cancelled_by in ('traveler', 'companion', 'admin', 'system')),
  cancellation_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.booking_status_history (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  from_status text,
  to_status text not null,
  changed_by uuid references public.users(id),
  reason text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 10. SAFETY SESSIONS
-- ============================================================================
create table if not exists public.safety_sessions (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  live_tracking_enabled boolean not null default false,
  traveler_emergency_contact text,
  traveler_emergency_phone text,
  companion_emergency_contact text,
  companion_emergency_phone text,
  expected_route_geojson jsonb,
  checkin_at timestamptz,
  checkin_method text check (checkin_method in ('code', 'gps', 'manual')),
  checkin_lat numeric(10,7),
  checkin_lng numeric(10,7),
  checkout_at timestamptz,
  checkout_method text check (checkout_method in ('mutual_confirm', 'auto_timer', 'manual')),
  panic_alerted_at timestamptz,
  anomaly_flags text[],
  ops_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 11. PAYMENTS & ESCROW
-- ============================================================================
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id),
  type text not null check (type in ('charge', 'refund', 'payout')),
  amount numeric(10,2) not null,
  currency text not null default 'USD',
  stripe_id text,
  status text not null check (status in ('pending', 'succeeded', 'failed', 'cancelled')) default 'pending',
  fee_breakdown jsonb,
  escrow_held_at timestamptz,
  escrow_released_at timestamptz,
  payout_initiated_at timestamptz,
  payout_completed_at timestamptz,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 12. REVIEWS (Double-blind)
-- ============================================================================
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id),
  reviewer_id uuid not null references public.users(id),
  reviewee_id uuid not null references public.users(id),
  reviewer_role text not null check (reviewer_role in ('traveler', 'companion')),
  score_overall numeric(2,1) not null check (score_overall between 1 and 5),
  score_communication numeric(2,1) check (score_communication between 1 and 5),
  score_punctuality numeric(2,1) check (score_punctuality between 1 and 5),
  score_safety numeric(2,1) check (score_safety between 1 and 5),
  score_knowledge numeric(2,1) check (score_knowledge between 1 and 5),
  score_value numeric(2,1) check (score_value between 1 and 5),
  would_repeat boolean,
  comment text,
  is_published boolean not null default false,
  published_at timestamptz,
  moderation_status text not null check (moderation_status in ('pending', 'approved', 'flagged', 'removed')) default 'pending',
  created_at timestamptz not null default now(),
  unique (booking_id, reviewer_id)
);

-- ============================================================================
-- 13. INCIDENTS & SOS
-- ============================================================================
create table if not exists public.incidents (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id),
  reported_by uuid not null references public.users(id),
  severity text not null check (severity in ('low', 'medium', 'high', 'critical')),
  category text not null check (category in (
    'no_show', 'late_arrival', 'safety_concern', 'harassment',
    'misrepresentation', 'payment_dispute', 'zone_violation', 'other'
  )),
  description text not null,
  evidence_urls text[],
  status text not null check (status in ('open', 'investigating', 'resolved', 'escalated')) default 'open',
  assigned_to uuid references public.users(id),
  resolution text,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sos_alerts (
  id uuid primary key default gen_random_uuid(),
  safety_session_id uuid not null references public.safety_sessions(id) on delete cascade,
  triggered_by uuid not null references public.users(id),
  triggered_at timestamptz not null default now(),
  lat numeric(10,7),
  lng numeric(10,7),
  alert_type text not null check (alert_type in ('panic', 'no_checkin', 'overtime', 'zone_exit')) default 'panic',
  acknowledged_by uuid references public.users(id),
  acknowledged_at timestamptz,
  resolution text,
  resolved_at timestamptz
);

-- ============================================================================
-- 14. MESSAGES
-- ============================================================================
create table if not exists public.message_threads (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.message_threads(id) on delete cascade,
  sender_id uuid not null references public.users(id),
  content text not null,
  is_flagged boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 15. ADMIN AUDIT LOG
-- ============================================================================
create table if not exists public.admin_actions (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.users(id),
  action_type text not null,
  target_type text not null,
  target_id uuid not null,
  reason text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
create index if not exists idx_companions_city
  on public.companion_profiles(city_id) where approval_status = 'approved';
create index if not exists idx_companions_trust
  on public.companion_profiles(trust_score desc) where approval_status = 'approved';
create index if not exists idx_slots_companion_time
  on public.availability_slots(companion_id, starts_at, ends_at) where status = 'available';
create index if not exists idx_bookings_traveler
  on public.bookings(traveler_id, booking_status);
create index if not exists idx_bookings_companion
  on public.bookings(companion_id, booking_status);
create index if not exists idx_bookings_status
  on public.bookings(booking_status, start_at);
create index if not exists idx_safety_active
  on public.safety_sessions(booking_id) where checkout_at is null and checkin_at is not null;
create index if not exists idx_incidents_open
  on public.incidents(status, severity) where status in ('open', 'investigating');
create index if not exists idx_reviews_reviewee
  on public.reviews(reviewee_id, is_published) where is_published = true;
create index if not exists idx_service_offerings_companion
  on public.service_offerings(companion_id) where is_active = true;
create index if not exists idx_messages_thread
  on public.messages(thread_id, created_at);

-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  for t in select unnest(array[
    'users',
    'companion_profiles',
    'companion_verifications',
    'bookings',
    'safety_sessions',
    'incidents'
  ]) loop
    execute format(
      'drop trigger if exists trg_touch_%1$s on public.%1$s;
       create trigger trg_touch_%1$s before update on public.%1$s
       for each row execute function public.touch_updated_at();',
      t
    );
  end loop;
end $$;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table public.users                    enable row level security;
alter table public.cities                   enable row level security;
alter table public.service_zones            enable row level security;
alter table public.companion_profiles       enable row level security;
alter table public.companion_verifications  enable row level security;
alter table public.companion_languages      enable row level security;
alter table public.companion_service_areas  enable row level security;
alter table public.service_offerings        enable row level security;
alter table public.availability_slots       enable row level security;
alter table public.blackout_dates           enable row level security;
alter table public.bookings                 enable row level security;
alter table public.booking_status_history   enable row level security;
alter table public.safety_sessions          enable row level security;
alter table public.payments                 enable row level security;
alter table public.reviews                  enable row level security;
alter table public.incidents                enable row level security;
alter table public.sos_alerts               enable row level security;
alter table public.message_threads          enable row level security;
alter table public.messages                 enable row level security;
alter table public.admin_actions            enable row level security;

-- Helper: is the current user a given companion_profile owner?
create or replace function public.is_companion_owner(cp uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.companion_profiles
    where id = cp and user_id = auth.uid()
  );
$$;

-- ---------- USERS ----------
drop policy if exists users_read_own on public.users;
create policy users_read_own on public.users
  for select using (auth.uid() = id);
drop policy if exists users_update_own on public.users;
create policy users_update_own on public.users
  for update using (auth.uid() = id);

-- ---------- CITIES / ZONES (public read) ----------
drop policy if exists cities_public_read on public.cities;
create policy cities_public_read on public.cities
  for select using (true);
drop policy if exists zones_public_read on public.service_zones;
create policy zones_public_read on public.service_zones
  for select using (true);
drop policy if exists languages_public_read on public.languages;
alter table public.languages enable row level security;
create policy languages_public_read on public.languages
  for select using (true);

-- ---------- COMPANION PROFILES ----------
drop policy if exists companions_public_read on public.companion_profiles;
create policy companions_public_read on public.companion_profiles
  for select using (approval_status = 'approved');
drop policy if exists companions_self_read on public.companion_profiles;
create policy companions_self_read on public.companion_profiles
  for select using (user_id = auth.uid());
drop policy if exists companions_self_update on public.companion_profiles;
create policy companions_self_update on public.companion_profiles
  for update using (user_id = auth.uid());
drop policy if exists companions_self_insert on public.companion_profiles;
create policy companions_self_insert on public.companion_profiles
  for insert with check (user_id = auth.uid());

-- ---------- VERIFICATIONS (self only) ----------
drop policy if exists verifications_self on public.companion_verifications;
create policy verifications_self on public.companion_verifications
  for all using (public.is_companion_owner(companion_id))
  with check (public.is_companion_owner(companion_id));

-- ---------- SERVICE OFFERINGS ----------
drop policy if exists offerings_public_read on public.service_offerings;
create policy offerings_public_read on public.service_offerings
  for select using (is_active = true);
drop policy if exists offerings_owner_all on public.service_offerings;
create policy offerings_owner_all on public.service_offerings
  for all using (public.is_companion_owner(companion_id))
  with check (public.is_companion_owner(companion_id));

-- ---------- AVAILABILITY ----------
drop policy if exists slots_public_read on public.availability_slots;
create policy slots_public_read on public.availability_slots
  for select using (status = 'available');
drop policy if exists slots_owner_all on public.availability_slots;
create policy slots_owner_all on public.availability_slots
  for all using (public.is_companion_owner(companion_id))
  with check (public.is_companion_owner(companion_id));

-- ---------- BOOKINGS ----------
drop policy if exists bookings_traveler_read on public.bookings;
create policy bookings_traveler_read on public.bookings
  for select using (auth.uid() = traveler_id);
drop policy if exists bookings_companion_read on public.bookings;
create policy bookings_companion_read on public.bookings
  for select using (public.is_companion_owner(companion_id));
drop policy if exists bookings_traveler_insert on public.bookings;
create policy bookings_traveler_insert on public.bookings
  for insert with check (auth.uid() = traveler_id);

-- ---------- REVIEWS ----------
drop policy if exists reviews_public_read on public.reviews;
create policy reviews_public_read on public.reviews
  for select using (is_published = true);
drop policy if exists reviews_self_read on public.reviews;
create policy reviews_self_read on public.reviews
  for select using (reviewer_id = auth.uid());
drop policy if exists reviews_self_insert on public.reviews;
create policy reviews_self_insert on public.reviews
  for insert with check (reviewer_id = auth.uid());

-- ---------- MESSAGES ----------
drop policy if exists threads_participants_read on public.message_threads;
create policy threads_participants_read on public.message_threads
  for select using (
    booking_id in (
      select id from public.bookings
      where traveler_id = auth.uid()
         or public.is_companion_owner(companion_id)
    )
  );

drop policy if exists messages_participants_read on public.messages;
create policy messages_participants_read on public.messages
  for select using (
    thread_id in (
      select mt.id from public.message_threads mt
      join public.bookings b on b.id = mt.booking_id
      where b.traveler_id = auth.uid()
         or public.is_companion_owner(b.companion_id)
    )
  );

drop policy if exists messages_participants_insert on public.messages;
create policy messages_participants_insert on public.messages
  for insert with check (
    sender_id = auth.uid() and
    thread_id in (
      select mt.id from public.message_threads mt
      join public.bookings b on b.id = mt.booking_id
      where b.traveler_id = auth.uid()
         or public.is_companion_owner(b.companion_id)
    )
  );

-- Admin/ops tables are accessed exclusively via the service role client.

-- ============================================================================
-- AUTO-CREATE users ROW ON auth.users INSERT
-- ============================================================================
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();
