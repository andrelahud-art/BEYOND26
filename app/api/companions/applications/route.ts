import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/server';
import {
  companionApplicationStep1Schema,
  companionApplicationStep2Schema,
  companionApplicationStep3Schema,
  companionApplicationStep4Schema,
  companionApplicationStep5Schema,
} from '@/lib/validation/schemas';

/**
 * POST /api/companions/applications
 * Submit a complete companion application
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate all steps
    const step1 = companionApplicationStep1Schema.parse(body);
    const step2 = companionApplicationStep2Schema.parse(body);
    const step3 = companionApplicationStep3Schema.parse(body);
    const step4 = companionApplicationStep4Schema.parse(body);
    const step5 = companionApplicationStep5Schema.parse(body);

    const supabase = createClient();

    // Check if companion profile already exists
    const { data: existing } = await supabase
      .from('companion_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'You already have a companion application' },
        { status: 400 }
      );
    }

    // Create companion profile
    const { data: profile, error: profileError } = await supabase
      .from('companion_profiles')
      .insert({
        user_id: user.id,
        display_name: step1.displayName,
        bio: step1.bio,
        city_id: step2.cityId,
        approval_status: 'pending_review',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (profileError) throw profileError;

    // Create companion verification record with documents
    const { error: verifyError } = await supabase
      .from('companion_verifications')
      .insert({
        companion_id: profile.id,
        government_id_url: step5.governmentIdUrl,
        government_id_status: 'pending',
        selfie_url: step5.selfieUrl,
        selfie_liveness_status: 'pending',
        background_check_status: 'pending',
        interview_status: 'not_scheduled',
        references_status: 'pending',
        training_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (verifyError) throw verifyError;

    // Add languages
    const languageInserts = step2.languages.map((lang) => ({
      companion_id: profile.id,
      language_id: lang.languageId,
      proficiency: lang.proficiency,
    }));

    const { error: langError } = await supabase
      .from('companion_languages')
      .insert(languageInserts);

    if (langError) throw langError;

    // Add service zones
    const zoneInserts = step3.zoneIds.map((zoneId, index) => ({
      companion_id: profile.id,
      zone_id: zoneId,
      priority: index + 1,
    }));

    const { error: zoneError } = await supabase
      .from('companion_service_areas')
      .insert(zoneInserts);

    if (zoneError) throw zoneError;

    // Add service offerings
    const offeringInserts = step4.offerings.map((offering) => ({
      companion_id: profile.id,
      service_type: offering.serviceType,
      title: offering.title,
      description: offering.description,
      duration_minutes: offering.durationMinutes,
      base_price: offering.basePrice,
      currency: 'USD',
      max_group_size: offering.maxGroupSize,
      inclusions: offering.inclusions ? [offering.inclusions] : null,
      exclusions: offering.exclusions ? [offering.exclusions] : null,
      created_at: new Date().toISOString(),
    }));

    const { error: offeringError } = await supabase
      .from('service_offerings')
      .insert(offeringInserts);

    if (offeringError) throw offeringError;

    // Store emergency contact in public.users as metadata (or create new table in Phase 2)
    const { error: updateError } = await supabase
      .from('users')
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      profile: {
        id: profile.id,
        displayName: profile.display_name,
        approvalStatus: profile.approval_status,
        message: 'Application submitted! Ops will review and schedule an interview.',
      },
    });
  } catch (err: any) {
    console.error('Application submission error:', err);
    return NextResponse.json(
      {
        error: err.message || 'Failed to submit application',
      },
      { status: 400 }
    );
  }
}
