'use client';

import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CompanionApplicationStep2 } from '@/lib/validation/schemas';

interface Language {
  id: string;
  code: string;
  name: string;
}

interface City {
  id: string;
  name: string;
  slug: string;
}

interface Step2Props {
  data: Partial<CompanionApplicationStep2>;
  onChange: (data: Partial<CompanionApplicationStep2>) => void;
}

export default function Step2({ data, onChange }: Step2Props) {
  const [cities, setCities] = useState<City[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesRes, languagesRes] = await Promise.all([
          fetch('/api/setup/cities'),
          fetch('/api/setup/languages'),
        ]);
        const citiesData = await citiesRes.json();
        const languagesData = await languagesRes.json();
        setCities(citiesData);
        setLanguages(languagesData);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleLanguage = (languageId: string, proficiency: 'native' | 'fluent' | 'conversational') => {
    const current = data.languages || [];
    const existingIndex = current.findIndex((l) => l.languageId === languageId);

    if (existingIndex >= 0) {
      const updated = [...current];
      updated[existingIndex] = { languageId, proficiency };
      onChange({ ...data, languages: updated });
    } else {
      onChange({ ...data, languages: [...current, { languageId, proficiency }] });
    }
  };

  const removeLanguage = (languageId: string) => {
    const current = data.languages || [];
    onChange({ ...data, languages: current.filter((l) => l.languageId !== languageId) });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Languages & City</h2>
        <p className="mt-1 text-muted-foreground">Where you are and how you speak</p>
      </div>

      {/* City Selection */}
      <div>
        <Label>Operating City *</Label>
        <div className="mt-2 space-y-2">
          {cities.map((city) => (
            <label key={city.id} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="city"
                value={city.id}
                checked={data.cityId === city.id}
                onChange={(e) => onChange({ ...data, cityId: e.target.value })}
                className="cursor-pointer"
              />
              <span className="text-sm">{city.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div>
        <Label>Languages *</Label>
        <p className="mt-1 text-sm text-muted-foreground">
          Add the languages you speak. Travelers will see proficiency levels.
        </p>

        {/* Selected languages */}
        {(data.languages || []).length > 0 && (
          <div className="mt-4 space-y-2">
            {data.languages!.map((lang) => {
              const langInfo = languages.find((l) => l.id === lang.languageId);
              return (
                <Card key={lang.languageId} className="flex items-center justify-between p-3">
                  <div>
                    <p className="font-medium">{langInfo?.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{lang.proficiency}</p>
                  </div>
                  <div className="flex gap-2">
                    {(['native', 'fluent', 'conversational'] as const).map((prof) => (
                      <button
                        key={prof}
                        onClick={() => toggleLanguage(lang.languageId, prof)}
                        className={`rounded px-2 py-1 text-xs font-medium transition ${
                          lang.proficiency === prof
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {prof}
                      </button>
                    ))}
                    <button
                      onClick={() => removeLanguage(lang.languageId)}
                      className="rounded px-2 py-1 text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 transition"
                    >
                      Remove
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Add language */}
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium">Add a language:</p>
          {languages.map((lang) => {
            const isSelected = (data.languages || []).some((l) => l.languageId === lang.id);
            return (
              <button
                key={lang.id}
                onClick={() => toggleLanguage(lang.id, 'fluent')}
                disabled={isSelected}
                className={`block w-full rounded border p-2 text-left text-sm transition ${
                  isSelected
                    ? 'border-primary bg-primary/5 cursor-default'
                    : 'border-border hover:border-primary cursor-pointer'
                }`}
              >
                {lang.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
