/**
 * Supabase-generated types placeholder.
 *
 * Once the Supabase project is linked, run:
 *   pnpm db:types
 * to regenerate this file from the live schema.
 *
 * Until then, we type the handful of tables we touch in Phase 0 and leave a
 * permissive `[key: string]: any` escape hatch so the clients don't force
 * every query through the narrow schema.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type TableShape<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

export interface UserRow {
  id: string;
  email: string;
  phone: string | null;
  role: 'traveler' | 'companion' | 'admin' | 'ops';
  status: 'active' | 'suspended' | 'banned';
  full_name: string | null;
  avatar_url: string | null;
  locale: string | null;
  terms_accepted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CityRow {
  id: string;
  name: string;
  slug: string;
  country: string;
  timezone: string;
  is_active: boolean;
  hero_image_url: string | null;
  description: string | null;
  created_at: string;
}

export interface CompanionProfileRow {
  id: string;
  user_id: string;
  display_name: string;
  bio: string | null;
  city_id: string;
  intro_video_url: string | null;
  response_rate: number;
  completion_rate: number;
  avg_rating: number;
  total_reviews: number;
  total_completed: number;
  trust_score: number;
  approval_status:
    | 'draft'
    | 'pending_review'
    | 'interview_scheduled'
    | 'approved'
    | 'rejected'
    | 'suspended';
  approved_at: string | null;
  approved_by: string | null;
  is_instant_book_enabled: boolean;
  max_daily_hours: number;
  created_at: string;
  updated_at: string;
}

/**
 * Loose Database type. The index signature + `any` means Supabase type
 * inference falls back to "any table / any column". Once we generate real
 * types via `pnpm db:types`, replace this file wholesale.
 */
export type Database = any;
