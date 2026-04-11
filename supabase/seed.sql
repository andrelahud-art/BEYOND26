-- ============================================================================
-- BEYON26 — Demo seed data
-- ============================================================================
-- Realistic demo data for Phase 0 presentations. All IDs deterministic so that
-- rerunning the seed is idempotent.
--
-- NOTE: companion user rows reference auth.users. For local demo, create stub
-- rows directly in public.users (foreign key to auth.users will be satisfied
-- once you also create the corresponding auth.users rows via Supabase Admin).
-- In a real Supabase project, run this script AFTER seeding auth.users or
-- replace the user_id values with real auth user IDs.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Languages
-- ----------------------------------------------------------------------------
insert into public.languages (id, code, name) values
  ('00000000-0000-0000-0000-00000000la01', 'es', 'Spanish'),
  ('00000000-0000-0000-0000-00000000la02', 'en', 'English'),
  ('00000000-0000-0000-0000-00000000la03', 'pt', 'Portuguese'),
  ('00000000-0000-0000-0000-00000000la04', 'fr', 'French'),
  ('00000000-0000-0000-0000-00000000la05', 'de', 'German'),
  ('00000000-0000-0000-0000-00000000la06', 'ja', 'Japanese')
on conflict (code) do nothing;

-- ----------------------------------------------------------------------------
-- Cities (only CDMX active for v1)
-- ----------------------------------------------------------------------------
insert into public.cities (id, name, slug, country, timezone, is_active, hero_image_url, description) values
  ('00000000-0000-0000-0000-0000000c1001', 'Ciudad de México', 'cdmx', 'MX', 'America/Mexico_City', true,
   'https://images.unsplash.com/photo-1518659526054-190340b15735?w=1600',
   'Capital cultural y futbolística de México. Sede principal de BEYON26 durante el World Cup 2026.'),
  ('00000000-0000-0000-0000-0000000c1002', 'Guadalajara', 'gdl', 'MX', 'America/Mexico_City', false,
   'https://images.unsplash.com/photo-1568690942063-e4c39d59b4fb?w=1600',
   'Corazón de Jalisco y segunda sede mundialista (próximamente).'),
  ('00000000-0000-0000-0000-0000000c1003', 'Monterrey', 'mty', 'MX', 'America/Monterrey', false,
   'https://images.unsplash.com/photo-1597006438013-0fc35af62c4f?w=1600',
   'Sede norte del evento (próximamente).')
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- Service Zones — CDMX (5 approved zones)
-- ----------------------------------------------------------------------------
insert into public.service_zones (id, city_id, name, slug, is_approved, risk_level, polygon_geojson) values
  ('00000000-0000-0000-0000-0000000z1001', '00000000-0000-0000-0000-0000000c1001', 'Roma Norte', 'roma-norte', true, 'low',
   '{"type":"Polygon","coordinates":[[[-99.175,19.420],[-99.155,19.420],[-99.155,19.405],[-99.175,19.405],[-99.175,19.420]]]}'::jsonb),
  ('00000000-0000-0000-0000-0000000z1002', '00000000-0000-0000-0000-0000000c1001', 'Condesa', 'condesa', true, 'low',
   '{"type":"Polygon","coordinates":[[[-99.180,19.415],[-99.165,19.415],[-99.165,19.400],[-99.180,19.400],[-99.180,19.415]]]}'::jsonb),
  ('00000000-0000-0000-0000-0000000z1003', '00000000-0000-0000-0000-0000000c1001', 'Centro Histórico', 'centro-historico', true, 'medium',
   '{"type":"Polygon","coordinates":[[[-99.145,19.440],[-99.125,19.440],[-99.125,19.425],[-99.145,19.425],[-99.145,19.440]]]}'::jsonb),
  ('00000000-0000-0000-0000-0000000z1004', '00000000-0000-0000-0000-0000000c1001', 'Polanco', 'polanco', true, 'low',
   '{"type":"Polygon","coordinates":[[[-99.200,19.440],[-99.180,19.440],[-99.180,19.425],[-99.200,19.425],[-99.200,19.440]]]}'::jsonb),
  ('00000000-0000-0000-0000-0000000z1005', '00000000-0000-0000-0000-0000000c1001', 'Estadio Azteca', 'estadio-azteca', true, 'medium',
   '{"type":"Polygon","coordinates":[[[-99.160,19.310],[-99.140,19.310],[-99.140,19.295],[-99.160,19.295],[-99.160,19.310]]]}'::jsonb)
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- Stub users for demo companions (6 companions shown here; extend to 24 later)
-- ----------------------------------------------------------------------------
-- In local dev, pair this with an auth.users seed. In hosted Supabase, generate
-- users via the Admin API and replace these IDs with the real ones.
insert into public.users (id, email, role, status, full_name, avatar_url) values
  ('00000000-0000-0000-0000-0000000u1001', 'sofia@demo.beyon26.com', 'companion', 'active', 'Sofía Martínez', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'),
  ('00000000-0000-0000-0000-0000000u1002', 'diego@demo.beyon26.com', 'companion', 'active', 'Diego Hernández', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'),
  ('00000000-0000-0000-0000-0000000u1003', 'valentina@demo.beyon26.com', 'companion', 'active', 'Valentina Ríos', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'),
  ('00000000-0000-0000-0000-0000000u1004', 'carlos@demo.beyon26.com', 'companion', 'active', 'Carlos Mendoza', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'),
  ('00000000-0000-0000-0000-0000000u1005', 'ana@demo.beyon26.com', 'companion', 'active', 'Ana Luisa Cruz', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'),
  ('00000000-0000-0000-0000-0000000u1006', 'mateo@demo.beyon26.com', 'companion', 'active', 'Mateo Vargas', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400')
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- Companion Profiles
-- ----------------------------------------------------------------------------
insert into public.companion_profiles (
  id, user_id, display_name, bio, city_id, intro_video_url,
  response_rate, completion_rate, avg_rating, total_reviews, total_completed,
  trust_score, approval_status, approved_at, is_instant_book_enabled
) values
  ('00000000-0000-0000-0000-0000000p1001', '00000000-0000-0000-0000-0000000u1001',
   'Sofía M.', 'Periodista deportiva con 8 años cubriendo Liga MX. Te llevo al Azteca y a los mejores tacos del sur.',
   '00000000-0000-0000-0000-0000000c1001', 'https://example.com/intro/sofia.mp4',
   98.0, 96.0, 4.9, 12, 14, 92.0, 'approved', now() - interval '20 days', true),

  ('00000000-0000-0000-0000-0000000p1002', '00000000-0000-0000-0000-0000000u1002',
   'Diego H.', 'Chilango de corazón, fotógrafo y foodie. Guía por Roma, Condesa y Centro Histórico.',
   '00000000-0000-0000-0000-0000000c1001', 'https://example.com/intro/diego.mp4',
   95.0, 94.0, 4.8, 9, 10, 88.0, 'approved', now() - interval '18 days', false),

  ('00000000-0000-0000-0000-0000000p1003', '00000000-0000-0000-0000-0000000u1003',
   'Valentina R.', 'Arquitecta y amante del futbol. Multilingüe (ES/EN/FR). Experta en Polanco y Chapultepec.',
   '00000000-0000-0000-0000-0000000c1001', 'https://example.com/intro/valentina.mp4',
   99.0, 98.0, 5.0, 15, 15, 95.0, 'approved', now() - interval '25 days', true),

  ('00000000-0000-0000-0000-0000000p1004', '00000000-0000-0000-0000-0000000u1004',
   'Carlos M.', 'Ex-jugador semi-profesional. Conozco todos los rincones del fútbol mexicano.',
   '00000000-0000-0000-0000-0000000c1001', 'https://example.com/intro/carlos.mp4',
   92.0, 90.0, 4.6, 6, 7, 82.0, 'approved', now() - interval '12 days', false),

  ('00000000-0000-0000-0000-0000000p1005', '00000000-0000-0000-0000-0000000u1005',
   'Ana Luisa C.', 'Historiadora especializada en Centro Histórico. Habla ES/EN/DE.',
   '00000000-0000-0000-0000-0000000c1001', 'https://example.com/intro/ana.mp4',
   97.0, 95.0, 4.9, 11, 12, 90.0, 'approved', now() - interval '16 days', true),

  ('00000000-0000-0000-0000-0000000p1006', '00000000-0000-0000-0000-0000000u1006',
   'Mateo V.', 'Traductor certificado ES/EN/PT/JA. Ideal para visitantes de Brasil y Japón.',
   '00000000-0000-0000-0000-0000000c1001', 'https://example.com/intro/mateo.mp4',
   94.0, 93.0, 4.7, 8, 9, 85.0, 'approved', now() - interval '10 days', false)
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- Verifications (all complete for demo companions)
-- ----------------------------------------------------------------------------
insert into public.companion_verifications (
  companion_id, government_id_status, selfie_liveness_status, background_check_status,
  interview_status, references_status, training_completed, training_completed_at,
  verified_at
)
select id, 'verified', 'verified', 'clear', 'completed', 'verified', true, now() - interval '15 days', now() - interval '15 days'
from public.companion_profiles
on conflict (companion_id) do nothing;

-- ----------------------------------------------------------------------------
-- Languages per companion
-- ----------------------------------------------------------------------------
insert into public.companion_languages (companion_id, language_id, proficiency) values
  -- Sofía: ES native, EN fluent
  ('00000000-0000-0000-0000-0000000p1001', '00000000-0000-0000-0000-00000000la01', 'native'),
  ('00000000-0000-0000-0000-0000000p1001', '00000000-0000-0000-0000-00000000la02', 'fluent'),
  -- Diego: ES native, EN conversational, PT conversational
  ('00000000-0000-0000-0000-0000000p1002', '00000000-0000-0000-0000-00000000la01', 'native'),
  ('00000000-0000-0000-0000-0000000p1002', '00000000-0000-0000-0000-00000000la02', 'conversational'),
  ('00000000-0000-0000-0000-0000000p1002', '00000000-0000-0000-0000-00000000la03', 'conversational'),
  -- Valentina: ES/EN/FR fluent
  ('00000000-0000-0000-0000-0000000p1003', '00000000-0000-0000-0000-00000000la01', 'native'),
  ('00000000-0000-0000-0000-0000000p1003', '00000000-0000-0000-0000-00000000la02', 'fluent'),
  ('00000000-0000-0000-0000-0000000p1003', '00000000-0000-0000-0000-00000000la04', 'fluent'),
  -- Carlos: ES native, EN conversational
  ('00000000-0000-0000-0000-0000000p1004', '00000000-0000-0000-0000-00000000la01', 'native'),
  ('00000000-0000-0000-0000-0000000p1004', '00000000-0000-0000-0000-00000000la02', 'conversational'),
  -- Ana: ES/EN/DE
  ('00000000-0000-0000-0000-0000000p1005', '00000000-0000-0000-0000-00000000la01', 'native'),
  ('00000000-0000-0000-0000-0000000p1005', '00000000-0000-0000-0000-00000000la02', 'fluent'),
  ('00000000-0000-0000-0000-0000000p1005', '00000000-0000-0000-0000-00000000la05', 'fluent'),
  -- Mateo: ES/EN/PT/JA
  ('00000000-0000-0000-0000-0000000p1006', '00000000-0000-0000-0000-00000000la01', 'native'),
  ('00000000-0000-0000-0000-0000000p1006', '00000000-0000-0000-0000-00000000la02', 'fluent'),
  ('00000000-0000-0000-0000-0000000p1006', '00000000-0000-0000-0000-00000000la03', 'fluent'),
  ('00000000-0000-0000-0000-0000000p1006', '00000000-0000-0000-0000-00000000la06', 'conversational')
on conflict do nothing;

-- ----------------------------------------------------------------------------
-- Service areas per companion (which zones they operate in)
-- ----------------------------------------------------------------------------
insert into public.companion_service_areas (companion_id, zone_id, priority) values
  ('00000000-0000-0000-0000-0000000p1001', '00000000-0000-0000-0000-0000000z1005', 1), -- Sofía -> Azteca
  ('00000000-0000-0000-0000-0000000p1001', '00000000-0000-0000-0000-0000000z1001', 2), -- Sofía -> Roma Norte
  ('00000000-0000-0000-0000-0000000p1002', '00000000-0000-0000-0000-0000000z1001', 1), -- Diego -> Roma
  ('00000000-0000-0000-0000-0000000p1002', '00000000-0000-0000-0000-0000000z1002', 1), -- Diego -> Condesa
  ('00000000-0000-0000-0000-0000000p1002', '00000000-0000-0000-0000-0000000z1003', 2), -- Diego -> Centro
  ('00000000-0000-0000-0000-0000000p1003', '00000000-0000-0000-0000-0000000z1004', 1), -- Valentina -> Polanco
  ('00000000-0000-0000-0000-0000000p1003', '00000000-0000-0000-0000-0000000z1002', 2), -- Valentina -> Condesa
  ('00000000-0000-0000-0000-0000000p1004', '00000000-0000-0000-0000-0000000z1005', 1), -- Carlos -> Azteca
  ('00000000-0000-0000-0000-0000000p1004', '00000000-0000-0000-0000-0000000z1003', 2), -- Carlos -> Centro
  ('00000000-0000-0000-0000-0000000p1005', '00000000-0000-0000-0000-0000000z1003', 1), -- Ana -> Centro
  ('00000000-0000-0000-0000-0000000p1005', '00000000-0000-0000-0000-0000000z1004', 2), -- Ana -> Polanco
  ('00000000-0000-0000-0000-0000000p1006', '00000000-0000-0000-0000-0000000z1001', 1), -- Mateo -> Roma
  ('00000000-0000-0000-0000-0000000p1006', '00000000-0000-0000-0000-0000000z1004', 2)  -- Mateo -> Polanco
on conflict do nothing;

-- ----------------------------------------------------------------------------
-- Service Offerings (event_companion, city_guide, translator)
-- ----------------------------------------------------------------------------
insert into public.service_offerings (
  id, companion_id, service_type, title, description,
  duration_minutes, base_price, currency, max_group_size, inclusions
) values
  -- Sofía: event_companion 4h @ $60/h
  ('00000000-0000-0000-0000-0000000s1001', '00000000-0000-0000-0000-0000000p1001',
   'event_companion', 'Matchday en el Azteca', 'Te acompaño del hotel al estadio, previa, partido y after.',
   240, 240.00, 'USD', 4, array['Transporte incluido','Entrada no incluida','Traducción en vivo']),

  -- Diego: city_guide 2h @ $35/h
  ('00000000-0000-0000-0000-0000000s1002', '00000000-0000-0000-0000-0000000p1002',
   'city_guide', 'Walking tour Roma + Condesa', 'Arte urbano, cafés, mercados y murales.',
   120, 70.00, 'USD', 6, array['Tour a pie','Recomendaciones locales']),

  -- Valentina: city_guide 4h @ $70/h
  ('00000000-0000-0000-0000-0000000s1003', '00000000-0000-0000-0000-0000000p1003',
   'city_guide', 'Polanco & Chapultepec premium', 'Museos, galerías, mirador y gastronomía alta.',
   240, 280.00, 'USD', 4, array['Entradas de museo','Snack incluido','Multilingüe']),

  -- Carlos: event_companion full-day @ $45/h
  ('00000000-0000-0000-0000-0000000s1004', '00000000-0000-0000-0000-0000000p1004',
   'event_companion', 'Full matchday experience', 'Experiencia completa: fan zone, partido y celebración.',
   480, 360.00, 'USD', 2, array['Transporte','Guía experto en fútbol mexicano']),

  -- Ana: city_guide 4h @ $50/h
  ('00000000-0000-0000-0000-0000000s1005', '00000000-0000-0000-0000-0000000p1005',
   'city_guide', 'Centro Histórico profundo', 'Zócalo, Templo Mayor, Palacio Nacional y cantinas con historia.',
   240, 200.00, 'USD', 6, array['Historiadora certificada','Entradas a sitios']),

  -- Mateo: translator 2h @ $40/h
  ('00000000-0000-0000-0000-0000000s1006', '00000000-0000-0000-0000-0000000p1006',
   'translator', 'Traducción en vivo ES/EN/PT/JA', 'Intérprete profesional para reuniones, eventos o trámites.',
   120, 80.00, 'USD', 8, array['Traductor certificado'])
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- Availability slots (sample: next 7 days, 10:00-18:00)
-- ----------------------------------------------------------------------------
insert into public.availability_slots (companion_id, starts_at, ends_at, status)
select cp.id,
       (date_trunc('day', now()) + (n || ' days')::interval + interval '10 hours'),
       (date_trunc('day', now()) + (n || ' days')::interval + interval '18 hours'),
       'available'
from public.companion_profiles cp
cross join generate_series(1, 7) as n
where cp.approval_status = 'approved'
on conflict do nothing;
