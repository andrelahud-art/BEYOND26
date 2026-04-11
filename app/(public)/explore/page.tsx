import { Metadata } from 'next';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { CompanionCard } from '@/components/marketplace/CompanionCard';
import { Filters } from '@/components/marketplace/Filters';

export const metadata: Metadata = {
  title: 'Explore companions — BEYON26',
  description: 'Find verified local companions in Ciudad de México.',
};

async function ExploreContent({
  searchParams,
}: {
  searchParams: { city?: string; type?: string; duration?: string; language?: string; zone?: string; maxPrice?: string };
}) {
  const supabase = createClient();

  // Fetch cities
  const { data: cities } = await supabase
    .from('cities')
    .select('id, name, slug, is_active')
    .eq('is_active', true);

  // Fetch zones for CDMX
  const { data: zones } = await supabase
    .from('service_zones')
    .select('id, name, slug, city_id')
    .eq('city_id', '00000000-0000-0000-0000-0000000c1001')
    .eq('is_approved', true);

  // Fetch companions with filters (Phase 1: basic filtering)
  const { data: companions } = await supabase
    .from('companion_profiles')
    .select(
      `
      id,
      user_id,
      display_name,
      bio,
      avg_rating,
      total_reviews,
      trust_score,
      users(avatar_url),
      service_offerings(base_price, service_type, duration_minutes),
      companion_languages(languages(code, name)),
      companion_service_areas(service_zones(name))
    `
    )
    .eq('approval_status', 'approved')
    .eq('city_id', '00000000-0000-0000-0000-0000000c1001')
    .order('trust_score', { ascending: false })
    .limit(50);

  // Filter in-memory
  let filtered = companions || [];

  if (searchParams.type) {
    filtered = filtered.filter((c: any) =>
      c.service_offerings?.some((o: any) => o.service_type === searchParams.type)
    );
  }

  if (searchParams.duration) {
    filtered = filtered.filter((c: any) =>
      c.service_offerings?.some((o: any) => o.duration_minutes === parseInt(searchParams.duration || '0'))
    );
  }

  if (searchParams.maxPrice) {
    filtered = filtered.filter((c: any) =>
      c.service_offerings?.some((o: any) => o.base_price <= parseInt(searchParams.maxPrice || '999'))
    );
  }

  if (searchParams.language) {
    filtered = filtered.filter((c: any) =>
      c.companion_languages?.some((l: any) => l.languages?.code === searchParams.language)
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-[280px,1fr]">
      <Filters cities={cities || []} zones={zones || []} />

      <div>
        <p className="mb-6 text-sm text-muted-foreground">
          Showing {filtered.length} verified companion{filtered.length !== 1 ? 's' : ''}
        </p>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">No companions match your filters. Try adjusting.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {filtered.map((c: any) => (
              <CompanionCard
                key={c.id}
                id={c.user_id}
                displayName={c.display_name}
                image={c.users?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'}
                role={c.bio?.substring(0, 50) + '...' || 'Companion'}
                rating={c.avg_rating || 4.5}
                totalReviews={c.total_reviews || 0}
                languages={c.companion_languages?.map((l: any) => l.languages?.name || 'Unknown') || []}
                zones={c.companion_service_areas?.map((a: any) => a.service_zones?.name || 'Unknown') || []}
                basePrice={c.service_offerings?.[0]?.base_price || 50}
                trustScore={c.trust_score || 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExplorePage({
  searchParams,
}: {
  searchParams: { city?: string; type?: string; duration?: string; language?: string; zone?: string; maxPrice?: string };
}) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl font-semibold">Explore companions</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Find verified local companions in Ciudad de México. Filter by service, language, zone, or price.
      </p>

      <div className="mt-8">
        <Suspense fallback={<div className="text-center text-muted-foreground">Loading...</div>}>
          <ExploreContent searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
