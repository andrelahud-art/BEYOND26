-- ============================================================================
-- BEYON26 — Fix RLS security issues (Phase 1)
-- ============================================================================
-- P0: Prevent role escalation in self-update users policy
-- P1: Block companions from self-approving their profiles
--
-- Issues fixed:
-- 1. users_update_own allowed any user to set role='admin' or reset status
-- 2. companions_self_update allowed companions to set approval_status='approved'
-- ============================================================================

-- ---------- HELPER: Enforce immutable fields on users table ----------
drop trigger if exists enforce_users_immutable on public.users;
drop function if exists public.enforce_users_immutable();

create function public.enforce_users_immutable()
returns trigger as $$
begin
  -- Prevent role escalation
  new.role := old.role;

  -- Prevent status reset
  new.status := old.status;

  -- Prevent terms_accepted_at modification (once set, cannot unset)
  if old.terms_accepted_at is not null then
    new.terms_accepted_at := old.terms_accepted_at;
  end if;

  return new;
end;
$$ language plpgsql;

create trigger enforce_users_immutable
before update on public.users
for each row
execute function public.enforce_users_immutable();

-- ---------- HELPER: Enforce immutable fields on companion_profiles ----------
drop trigger if exists enforce_companion_immutable on public.companion_profiles;
drop function if exists public.enforce_companion_immutable();

create function public.enforce_companion_immutable()
returns trigger as $$
begin
  -- Only allow companions to update profile-visible fields
  -- Block modifications to approval/trust fields

  if new.user_id = auth.uid() then
    -- Companion is updating their own record; enforce immutability of ops fields
    new.approval_status := old.approval_status;
    new.approved_at := old.approved_at;
    new.approved_by := old.approved_by;
    new.is_instant_book_enabled := old.is_instant_book_enabled;
    new.trust_score := old.trust_score;
    new.avg_rating := old.avg_rating;
    new.total_reviews := old.total_reviews;
    new.total_completed := old.total_completed;
    new.response_rate := old.response_rate;
    new.completion_rate := old.completion_rate;
  end if;

  return new;
end;
$$ language plpgsql;

create trigger enforce_companion_immutable
before update on public.companion_profiles
for each row
execute function public.enforce_companion_immutable();

-- ---------- USERS: Restrict to editable fields only ----------
drop policy if exists users_update_own on public.users;

create policy users_update_own on public.users
  for update using (auth.uid() = id);

-- ---------- COMPANION PROFILES: Restrict to profile-editable fields only ----------
drop policy if exists companions_self_update on public.companion_profiles;

create policy companions_self_update on public.companion_profiles
  for update using (user_id = auth.uid());
