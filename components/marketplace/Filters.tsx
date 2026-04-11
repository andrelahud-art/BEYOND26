'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SERVICE_TYPES, SERVICE_DURATIONS, SERVICE_TYPE_LABELS, SERVICE_DURATION_LABELS } from '@/lib/utils/constants';

export function Filters({ cities, zones }: { cities: any[]; zones: any[] }) {
  const router = useRouter();
  const params = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const p = new URLSearchParams(params.toString());
    if (value) p.set(key, value);
    else p.delete(key);
    router.push(`/explore?${p.toString()}`);
  };

  const clearFilters = () => {
    router.push('/explore');
  };

  return (
    <aside className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filters</h2>
        <button onClick={clearFilters} className="text-xs text-primary hover:underline">
          Clear all
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {/* City */}
        <div>
          <label className="block text-xs font-semibold uppercase text-muted-foreground">
            City
          </label>
          <select
            value={params.get('city') ?? ''}
            onChange={(e) => updateFilter('city', e.target.value)}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">All cities</option>
            {cities.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Service type */}
        <div>
          <label className="block text-xs font-semibold uppercase text-muted-foreground">
            Service
          </label>
          <select
            value={params.get('type') ?? ''}
            onChange={(e) => updateFilter('type', e.target.value)}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">All services</option>
            {SERVICE_TYPES.map((t) => (
              <option key={t} value={t}>
                {SERVICE_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-xs font-semibold uppercase text-muted-foreground">
            Duration
          </label>
          <select
            value={params.get('duration') ?? ''}
            onChange={(e) => updateFilter('duration', e.target.value)}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Any duration</option>
            {SERVICE_DURATIONS.map((d) => (
              <option key={d} value={d}>
                {SERVICE_DURATION_LABELS[d]}
              </option>
            ))}
          </select>
        </div>

        {/* Price range */}
        <div>
          <label className="block text-xs font-semibold uppercase text-muted-foreground">
            Max price per hour
          </label>
          <select
            value={params.get('maxPrice') ?? ''}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Any price</option>
            <option value="30">Up to $30</option>
            <option value="50">Up to $50</option>
            <option value="75">Up to $75</option>
            <option value="100">Up to $100</option>
          </select>
        </div>

        {/* Language */}
        <div>
          <label className="block text-xs font-semibold uppercase text-muted-foreground">
            Language
          </label>
          <select
            value={params.get('language') ?? ''}
            onChange={(e) => updateFilter('language', e.target.value)}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Any language</option>
            <option value="es">Spanish</option>
            <option value="en">English</option>
            <option value="pt">Portuguese</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="ja">Japanese</option>
          </select>
        </div>

        {/* Zone */}
        {zones.length > 0 && (
          <div>
            <label className="block text-xs font-semibold uppercase text-muted-foreground">
              Zone
            </label>
            <select
              value={params.get('zone') ?? ''}
              onChange={(e) => updateFilter('zone', e.target.value)}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">All zones</option>
              {zones.map((z) => (
                <option key={z.id} value={z.slug}>
                  {z.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </aside>
  );
}
