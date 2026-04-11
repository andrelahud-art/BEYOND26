'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CompanionApplicationStep1 } from '@/lib/validation/schemas';

interface Step1Props {
  data: Partial<CompanionApplicationStep1>;
  onChange: (data: Partial<CompanionApplicationStep1>) => void;
}

export default function Step1({ data, onChange }: Step1Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Tell us about yourself</h2>
        <p className="mt-1 text-muted-foreground">Basic information to get started</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="displayName">Display name *</Label>
          <Input
            id="displayName"
            placeholder="E.g., Sofia M. or Diego H."
            value={data.displayName || ''}
            onChange={(e) => onChange({ ...data, displayName: e.target.value })}
            className="mt-1"
          />
          <p className="mt-1 text-xs text-muted-foreground">How travelers will see you on your profile (2-60 chars)</p>
        </div>

        <div>
          <Label htmlFor="bio">Bio *</Label>
          <Textarea
            id="bio"
            placeholder="Tell travelers who you are, what you love about your city, and why you're a great guide. Include relevant experience."
            value={data.bio || ''}
            onChange={(e) => onChange({ ...data, bio: e.target.value })}
            className="mt-1"
            rows={5}
          />
          <p className="mt-1 text-xs text-muted-foreground">80-1200 characters. Be authentic and specific.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="emergencyContactName">Emergency contact name *</Label>
            <Input
              id="emergencyContactName"
              placeholder="Full name"
              value={data.emergencyContactName || ''}
              onChange={(e) => onChange({ ...data, emergencyContactName: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="emergencyContactPhone">Emergency contact phone *</Label>
            <Input
              id="emergencyContactPhone"
              placeholder="+52 55 1234 5678"
              value={data.emergencyContactPhone || ''}
              onChange={(e) => onChange({ ...data, emergencyContactPhone: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
