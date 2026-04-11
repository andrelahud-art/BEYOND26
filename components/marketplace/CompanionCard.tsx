import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Globe2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface CompanionCardProps {
  id: string;
  displayName: string;
  image: string;
  role: string;
  rating: number;
  totalReviews: number;
  languages: string[];
  zones: string[];
  basePrice: number;
  trustScore: number;
}

export function CompanionCard({
  id,
  displayName,
  image,
  role,
  rating,
  totalReviews,
  languages,
  zones,
  basePrice,
  trustScore,
}: CompanionCardProps) {
  return (
    <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:shadow-md">
      <Link href={`/explore/${id}`}>
        <div className="relative h-56 overflow-hidden bg-slate-200">
          <Image
            src={image}
            alt={displayName}
            fill
            className="object-cover transition hover:scale-105"
            unoptimized
          />
          {trustScore >= 90 && (
            <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary/90 px-2 py-1 text-xs font-semibold text-white backdrop-blur">
              ✓ Featured
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/explore/${id}`} className="hover:underline">
          <h3 className="text-lg font-semibold">{displayName}</h3>
        </Link>
        <p className="mt-0.5 text-xs text-muted-foreground">{role}</p>

        {zones.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {zones.slice(0, 2).map((z) => (
              <span
                key={z}
                className="inline-flex items-center gap-0.5 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-muted-foreground"
              >
                <MapPin className="h-3 w-3" /> {z}
              </span>
            ))}
            {zones.length > 2 && <span className="text-xs text-muted-foreground">+{zones.length - 2}</span>}
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-1">
          {languages.slice(0, 2).map((lang) => (
            <span
              key={lang}
              className="inline-flex items-center gap-0.5 rounded-full border border-border px-1.5 py-0.5 text-xs"
            >
              <Globe2 className="h-3 w-3" /> {lang}
            </span>
          ))}
          {languages.length > 2 && (
            <span className="inline-block rounded-full border border-border px-1.5 py-0.5 text-xs">
              +{languages.length - 2}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({totalReviews})</span>
          </div>
          <p className="font-semibold text-primary">From ${basePrice}/h</p>
        </div>

        <Link href={`/explore/${id}?action=book`} className="mt-4 block">
          <Button className="w-full" size="sm">
            Request booking
          </Button>
        </Link>
      </div>
    </article>
  );
}
