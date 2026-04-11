'use client';

import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { CompanionApplicationStep3 } from '@/lib/validation/schemas';

interface Zone {
  id: string;
  name: string;
  slug: string;
}

interface Step3Props {
  data: Partial<CompanionApplicationStep3>;
  onChange: (data: Partial<CompanionApplicationStep3>) => void;
}

export default function Step3({ data, onChange }: Step3Props) {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const res = await fetch('/api/setup/zones?cityId=00000000-0000-0000-0000-0000000c1001');
        const data = await res.json();
        setZones(data);
      } catch (err) {
        console.error('Failed to load zones:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchZones();
  }, []);

  const toggleZone = (zoneId: string) => {
    const current = data.zoneIds || [];
    if (current.includes(zoneId)) {
      onChange({ zoneIds: current.filter((id) => id !== zoneId) });
    } else {
      onChange({ zoneIds: [...current, zoneId] });
    }
  };

  if (loading) {
    return <div>Loading zones...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Service Zones</h2>
        <p className="mt-1 text-muted-foreground">Which areas of the city do you serve?</p>
      </div>

      <div>
        <Label>Select zones where you can work *</Label>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick the neighborhoods where you're most comfortable guiding travelers.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {zones.map((zone) => {
            const isSelected = (data.zoneIds || []).includes(zone.id);
            return (
              <button
                key={zone.id}
                onClick={() => toggleZone(zone.id)}
                className={`rounded-lg border-2 p-4 text-left transition ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-5 w-5 rounded border-2 transition ${
                      isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
                    }`}
                  />
                  <div>
                    <p className="font-medium">{zone.name}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {(data.zoneIds || []).length > 0 && (
          <div className="mt-6 rounded-lg bg-blue-50 p-4">
            <p className="text-sm font-medium text-blue-900">
              {data.zoneIds!.length} zone{data.zoneIds!.length !== 1 ? 's' : ''} selected
            </p>
            <p className="mt-1 text-sm text-blue-800">
              Travelers will see these as your service areas. You can update this after approval.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
