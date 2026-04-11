import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/search?city=cdmx&type=event_companion&duration=240&language=en&maxPrice=100
 * Returns paginated list of companions matching filters.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') ?? 'cdmx';
    const type = searchParams.get('type');
    const duration = searchParams.get('duration');
    const language = searchParams.get('language');
    const maxPrice = searchParams.get('maxPrice');
    const zone = searchParams.get('zone');
    const limit = parseInt(searchParams.get('limit') ?? '20');
    const offset = parseInt(searchParams.get('offset') ?? '0');

    const supabase = createClient();

    // Build query
    let query = supabase
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
        service_offerings(
          id,
          service_type,
          title,
          description,
          base_price,
          duration_minutes,
          max_group_size,
          inclusions,
          exclusions
        ),
        companion_languages(
          language_id,
          proficiency,
          languages(code, name)
        ),
        companion_service_areas(
          zone_id,
          priority,
          service_zones(id, name, slug)
        )
      `,
        { count: 'exact' }
      )
      .eq('approval_status', 'approved')
      .eq('city_id', city === 'cdmx' ? '00000000-0000-0000-0000-0000000c1001' : 'unknown')
      .order('trust_score', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error) throw error;

    // Filter in-memory (Phase 1 is simple; Phase 3 uses ranking formula)
    let results = data || [];

    if (type) {
      results = results.filter((c: any) =>
        c.service_offerings?.some((o: any) => o.service_type === type)
      );
    }

    if (duration) {
      results = results.filter((c: any) =>
        c.service_offerings?.some((o: any) => o.duration_minutes === parseInt(duration))
      );
    }

    if (maxPrice) {
      results = results.filter((c: any) =>
        c.service_offerings?.some((o: any) => o.base_price <= parseInt(maxPrice))
      );
    }

    if (language) {
      results = results.filter((c: any) =>
        c.companion_languages?.some((l: any) => l.languages?.code === language)
      );
    }

    if (zone) {
      results = results.filter((c: any) =>
        c.companion_service_areas?.some((a: any) => a.service_zones?.slug === zone)
      );
    }

    return NextResponse.json({
      companions: results,
      total: count,
      limit,
      offset,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
