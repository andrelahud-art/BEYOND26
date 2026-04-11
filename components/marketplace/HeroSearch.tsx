'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { MapPin, CalendarDays, Users, Search } from 'lucide-react';
import { track } from '@/lib/utils/analytics';

/**
 * Compact hero search. Phase 0: routes to /explore with query params so the
 * marketplace view (Phase 1) can read them directly.
 */
export function HeroSearch() {
  const router = useRouter();
  const [citySlug, setCitySlug] = useState('cdmx');
  const [date, setDate] = useState('');
  const [groupSize, setGroupSize] = useState('1');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    track('hero_search_submitted', { citySlug, date, groupSize });
    const params = new URLSearchParams({
      city: citySlug,
      ...(date ? { date } : {}),
      ...(groupSize ? { groupSize } : {}),
    });
    router.push(`/explore?${params.toString()}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-3 rounded-3xl border border-white/15 bg-white/10 p-3 backdrop-blur-xl sm:grid-cols-[1.3fr,1fr,0.8fr,auto]"
    >
      <label className="flex items-center gap-2 rounded-2xl bg-black/30 px-4 py-3 text-sm text-white/90">
        <MapPin className="h-4 w-4 text-blue-300" />
        <select
          value={citySlug}
          onChange={(e) => setCitySlug(e.target.value)}
          className="w-full bg-transparent outline-none"
          aria-label="City"
        >
          <option value="cdmx">Ciudad de México</option>
          <option value="gdl" disabled>
            Guadalajara (soon)
          </option>
          <option value="mty" disabled>
            Monterrey (soon)
          </option>
        </select>
      </label>

      <label className="flex items-center gap-2 rounded-2xl bg-black/30 px-4 py-3 text-sm text-white/90">
        <CalendarDays className="h-4 w-4 text-blue-300" />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-transparent outline-none [color-scheme:dark]"
          aria-label="Date"
        />
      </label>

      <label className="flex items-center gap-2 rounded-2xl bg-black/30 px-4 py-3 text-sm text-white/90">
        <Users className="h-4 w-4 text-blue-300" />
        <select
          value={groupSize}
          onChange={(e) => setGroupSize(e.target.value)}
          className="w-full bg-transparent outline-none"
          aria-label="Group size"
        >
          <option value="1">1 traveler</option>
          <option value="2">2 travelers</option>
          <option value="3">3 travelers</option>
          <option value="4">4+ travelers</option>
        </select>
      </label>

      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
      >
        <Search className="h-4 w-4" />
        Search
      </button>
    </form>
  );
}
