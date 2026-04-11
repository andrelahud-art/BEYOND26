import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/server';

/**
 * POST /api/admin/trust-scores
 * Recalculate trust scores for all or specific companions (admin only)
 * Trust formula: Verifications (60%) + Rating (30%) + Completion (10%)
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = createClient();

    // Check authorization
    const { data: userRecord } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!userRecord || !['admin'].includes(userRecord.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { companionIds } = await request.json();

    // Get list of companions to update
    let companionIdList: string[] = [];

    if (companionIds && Array.isArray(companionIds)) {
      companionIdList = companionIds;
    } else {
      // Update all approved companions
      const { data: companions } = await supabase
        .from('companion_profiles')
        .select('id')
        .eq('approval_status', 'approved');

      companionIdList = companions?.map((c: any) => c.id) || [];
    }

    // Update trust scores
    const results = [];
    for (const cid of companionIdList) {
      const { error } = await supabase.rpc('update_companion_trust_score', {
        companion_id: cid,
      });

      if (!error) {
        results.push({ companionId: cid, success: true });
      } else {
        results.push({ companionId: cid, success: false, error });
      }
    }

    // Log admin action
    await supabase
      .from('admin_actions')
      .insert({
        admin_id: user.id,
        action_type: 'trust_score_recalc',
        target_type: 'system',
        target_id: user.id,
        metadata: {
          companion_count: companionIdList.length,
          success_count: results.filter((r: any) => r.success).length,
        },
      });

    return NextResponse.json({
      message: `Updated trust scores for ${companionIdList.length} companions`,
      results,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
