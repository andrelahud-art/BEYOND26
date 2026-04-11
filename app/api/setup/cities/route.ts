import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('cities')
      .select('id, name, slug')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error('Failed to fetch cities:', err);
    return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 });
  }
}
