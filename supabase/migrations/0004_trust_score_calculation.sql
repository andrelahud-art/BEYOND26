-- ============================================================================
-- Trust Score Calculation Function
-- Deterministic formula: Verifications (60%) + Rating (30%) + Completion (10%)
-- ============================================================================

create or replace function public.calculate_companion_trust_score(companion_id uuid)
returns numeric
language plpgsql
stable
as $$
declare
  verification_score numeric := 0;
  rating_score numeric := 0;
  completion_score numeric := 0;
  total_score numeric := 0;
  verification_count integer := 0;
  completed_bookings integer := 0;
  total_bookings integer := 0;
  completion_pct numeric := 0;
  avg_rating numeric := 0;
begin
  -- Get verification status (0-100 points based on completed verifications)
  select count(*)::numeric into verification_count
  from public.companion_verifications cv
  where cv.companion_id = $1
    and cv.government_id_status = 'verified'
    and cv.selfie_liveness_status = 'verified'
    and cv.background_check_status in ('clear', 'unavailable')
    and cv.training_completed = true;

  -- Full verification = 100 points, each missing component deducts 20 points
  verification_score := least(100, verification_count * 100);

  -- Get rating score (0-100 points based on avg_rating, max 5)
  select coalesce(avg_rating, 0)::numeric into avg_rating
  from public.companion_profiles
  where id = $1;

  rating_score := (avg_rating / 5) * 100;

  -- Get completion score (0-100 points based on completion_rate %)
  select
    coalesce(total_completed, 0)::integer,
    coalesce((
      select count(*)
      from public.bookings
      where companion_id = $1 and booking_status in ('completed', 'disputed')
    ), 0)::integer
  into completed_bookings, total_bookings
  from public.companion_profiles
  where id = $1;

  if total_bookings > 0 then
    completion_pct := (completed_bookings::numeric / total_bookings) * 100;
  else
    completion_pct := 0;
  end if;

  completion_score := completion_pct;

  -- Calculate weighted total: 60% verification + 30% rating + 10% completion
  total_score := (verification_score * 0.6) + (rating_score * 0.3) + (completion_score * 0.1);

  -- Return score capped at 100, floored to 0.01 precision
  return least(100, greatest(0, round(total_score, 2)));
end;
$$;

-- Create endpoint-callable function (needs to update companion_profiles)
create or replace function public.update_companion_trust_score(companion_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  new_score numeric;
begin
  new_score := public.calculate_companion_trust_score(companion_id);

  update public.companion_profiles
  set
    trust_score = new_score,
    updated_at = now()
  where id = companion_id;
end;
$$;

-- Create a trigger to auto-recalculate trust_score when reviews are published
create or replace function public.trigger_recalc_trust_on_review()
returns trigger
language plpgsql
as $$
declare
  companion_id_val uuid;
begin
  if new.is_published and not old.is_published then
    -- Get companion_id from user_id (reviewee_id is a user, not companion)
    select id into companion_id_val from public.companion_profiles
    where user_id = new.reviewee_id;

    if companion_id_val is not null then
      perform public.update_companion_trust_score(companion_id_val);
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_recalc_trust_on_review on public.reviews;
create trigger trg_recalc_trust_on_review
after update on public.reviews
for each row
when (old.is_published != new.is_published)
execute function public.trigger_recalc_trust_on_review();

-- Create a trigger to recalc when verifications change
create or replace function public.trigger_recalc_trust_on_verification()
returns trigger
language plpgsql
as $$
begin
  -- new.companion_id is the actual companion_profiles.id
  if new.companion_id is not null then
    perform public.update_companion_trust_score(new.companion_id);
  end if;
  return new;
end;
$$;

drop trigger if exists trg_recalc_trust_on_verification on public.companion_verifications;
create trigger trg_recalc_trust_on_verification
after update on public.companion_verifications
for each row
when (
  old.government_id_status != new.government_id_status
  or old.selfie_liveness_status != new.selfie_liveness_status
  or old.background_check_status != new.background_check_status
  or old.training_completed != new.training_completed
)
execute function public.trigger_recalc_trust_on_verification();

-- Add index for ranking by trust score
create index if not exists idx_companions_ranking
  on public.companion_profiles(trust_score desc, avg_rating desc)
  where approval_status = 'approved';
