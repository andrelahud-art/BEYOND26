import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

/**
 * PATCH /api/admin/incidents/[id]
 * Update incident status and resolution (admin/ops only)
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Use session client only for auth check (RLS-safe for users table)
    const supabase = createClient();

    // Check authorization
    const { data: userRecord } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!userRecord || !['admin', 'ops'].includes(userRecord.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Use service role client for incident mutations (bypasses RLS)
    const adminSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { status, resolution } = await request.json();

    // Validate status
    const validStatuses = ['open', 'investigating', 'resolved', 'escalated'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const updateData: Record<string, any> = { updated_at: new Date().toISOString() };

    if (status) {
      updateData.status = status;
    }

    if (resolution) {
      updateData.resolution = resolution;
      updateData.resolved_at = new Date().toISOString();
      updateData.status = 'resolved';
    }

    // Update incident using service role (bypasses RLS)
    const { data: incident, error } = await adminSupabase
      .from('incidents')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    // Log admin action
    await adminSupabase
      .from('admin_actions')
      .insert({
        admin_id: user.id,
        action_type: 'incident_update',
        target_type: 'incident',
        target_id: params.id,
        metadata: {
          status_change: status,
          has_resolution: !!resolution,
        },
      });

    return NextResponse.json(incident);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
