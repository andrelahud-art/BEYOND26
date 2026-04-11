import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Zap, Video, Languages } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const supabase = createClient();
  const { data: companion } = await supabase
    .from('companion_profiles')
    .select(
      `
      id,
      display_name,
      bio,
      avg_rating,
      total_reviews,
      trust_score
    `
    )
    .eq('user_id', params.slug)
    .single();

  if (!companion) {
    return {
      title: 'Companion not found',
    };
  }

  return {
    title: `${companion.display_name} — BEYON26`,
    description: companion.bio || 'Verified local companion for World Cup 2026',
  };
}

export default async function CompanionProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createClient();

  // Fetch companion profile with all related data
  const { data: companion } = await supabase
    .from('companion_profiles')
    .select(
      `
      id,
      user_id,
      display_name,
      bio,
      city_id,
      intro_video_url,
      avg_rating,
      total_reviews,
      total_completed,
      trust_score,
      response_rate,
      completion_rate,
      approval_status,
      cities(id, name, slug),
      users(avatar_url)
    `
    )
    .eq('user_id', params.slug)
    .eq('approval_status', 'approved')
    .single();

  if (!companion) {
    notFound();
  }

  // Fetch languages
  const { data: languagesData } = await supabase
    .from('companion_languages')
    .select('language_id, proficiency, languages(id, code, name)')
    .eq('companion_id', companion.id);
  const languages = languagesData || [];

  // Fetch service zones
  const { data: zonesData } = await supabase
    .from('companion_service_areas')
    .select('service_zones(id, name)')
    .eq('companion_id', companion.id)
    .order('priority');
  const zones = zonesData || [];

  // Fetch service offerings
  const { data: offeringsData } = await supabase
    .from('service_offerings')
    .select('*')
    .eq('companion_id', companion.id)
    .eq('is_active', true);
  const offerings = offeringsData || [];

  // Fetch published reviews (reviewee_id is user_id, not companion_id)
  const { data: reviewsData } = await supabase
    .from('reviews')
    .select(
      `
      id,
      score_overall,
      comment,
      created_at,
      reviewer_id,
      users(full_name, avatar_url)
    `
    )
    .eq('reviewee_id', companion.user_id)
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(5);
  const reviews = reviewsData || [];

  const durationLabel = (mins: number) => {
    if (mins === 120) return '2 hours';
    if (mins === 240) return '4 hours';
    if (mins === 480) return 'Full day';
    return `${mins / 60} hours`;
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      {/* Header */}
      <div className="mb-10 flex gap-6">
        <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-2xl bg-muted">
          {companion.users && companion.users[0]?.avatar_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={companion.users[0].avatar_url}
              alt={companion.display_name}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-4xl font-semibold">{companion.display_name}</h1>

          {/* Stats */}
          <div className="mt-3 flex gap-6">
            <div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{companion.avg_rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({companion.total_reviews})</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-blue-500" />
                <span className="font-semibold">{companion.trust_score.toFixed(0)}</span>
                <span className="text-muted-foreground">trust score</span>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                {companion.total_completed} completed trips
              </p>
            </div>
          </div>

          {/* Bio */}
          <p className="mt-4 max-w-2xl text-muted-foreground">{companion.bio}</p>

          {/* CTA */}
          <Link href={`/explore/${companion.user_id}/book`}>
            <Button size="lg" className="mt-6">
              Request booking
            </Button>
          </Link>
        </div>
      </div>

      {/* Intro Video */}
      {companion.intro_video_url && (
        <div className="mb-10 rounded-2xl border border-border overflow-hidden bg-card">
          <div className="bg-muted p-8 text-center">
            <Video className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">Video introduction</p>
            <p className="text-xs text-muted-foreground">{companion.intro_video_url}</p>
          </div>
        </div>
      )}

      <div className="grid gap-10 md:grid-cols-3">
        {/* Languages */}
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Languages className="h-5 w-5" />
            Languages
          </h2>
          <div className="mt-3 space-y-2">
            {languages.map((lang: any) => (
              <div key={lang.language_id}>
                <p className="font-medium">{lang.languages.name}</p>
                <p className="text-xs capitalize text-muted-foreground">{lang.proficiency}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Service Zones */}
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <MapPin className="h-5 w-5" />
            Service Areas
          </h2>
          <div className="mt-3 space-y-2">
            {zones.map((zone: any, i: number) => (
              <p key={i} className="text-sm">
                {zone.service_zones.name}
              </p>
            ))}
          </div>
        </div>

        {/* Response Rate */}
        <div>
          <h2 className="text-lg font-semibold">Reliability</h2>
          <div className="mt-3 space-y-2">
            <div>
              <p className="text-xs text-muted-foreground">Response rate</p>
              <p className="font-semibold">{companion.response_rate.toFixed(0)}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Completion rate</p>
              <p className="font-semibold">{companion.completion_rate.toFixed(0)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Service Offerings */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold">Service Offerings</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {offerings.map((offering: any) => (
            <div key={offering.id} className="rounded-xl border border-border p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold">{offering.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{offering.description}</p>

                  <div className="mt-3 flex gap-3 text-sm">
                    <span className="rounded bg-muted px-2 py-1 capitalize">
                      {offering.service_type.replace('_', ' ')}
                    </span>
                    <span className="text-muted-foreground">{durationLabel(offering.duration_minutes)}</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-semibold text-primary">
                    ${offering.base_price}
                    <span className="text-xs font-normal text-muted-foreground">/person</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Up to {offering.max_group_size} people
                  </p>
                </div>
              </div>

              {offering.inclusions && (
                <div className="mt-3 border-t border-border pt-3">
                  <p className="text-xs font-medium text-muted-foreground">Includes:</p>
                  <p className="text-xs text-muted-foreground">{offering.inclusions}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold">Reviews ({companion.total_reviews})</h2>
          <div className="mt-4 space-y-4">
            {reviews.map((review: any) => (
              <div key={review.id} className="rounded-xl border border-border p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{review.users?.full_name || 'Verified traveler'}</p>
                    <div className="mt-1 flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.score_overall
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>

                {review.comment && <p className="mt-3 text-sm text-muted-foreground">{review.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
