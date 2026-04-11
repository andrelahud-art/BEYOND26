import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get('cityId');

    if (!cityId) {
      return NextResponse.json({ error: 'Missing cityId' }, { status: 400 });
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from('service_zones')
      .select('id, name, slug')
      .eq('city_id', cityId)
      .eq('is_approved', true)
      .order('name');

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error('Failed to fetch zones:', err);
    return NextResponse.json({ error: 'Failed to fetch zones' }, { status: 500 });
  }
}
