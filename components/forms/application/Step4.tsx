'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { CompanionApplicationStep4 } from '@/lib/validation/schemas';
import { SERVICE_TYPES, SERVICE_DURATIONS } from '@/lib/utils/constants';

interface ServiceOffering {
  serviceType: string;
  title: string;
  description: string;
  durationMinutes: number;
  basePrice: number;
  maxGroupSize: number;
  inclusions?: string;
  exclusions?: string;
}

interface Step4Props {
  data: Partial<CompanionApplicationStep4>;
  onChange: (data: Partial<CompanionApplicationStep4>) => void;
}

export default function Step4({ data, onChange }: Step4Props) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<ServiceOffering>({
    serviceType: 'event_companion',
    title: '',
    description: '',
    durationMinutes: 240,
    basePrice: 50,
    maxGroupSize: 4,
  });

  const handleAddOffering = () => {
    const current = data.offerings || [];
    onChange({ offerings: [...current, formData] });
    setFormData({
      serviceType: 'event_companion',
      title: '',
      description: '',
      durationMinutes: 240,
      basePrice: 50,
      maxGroupSize: 4,
    });
  };

  const handleRemoveOffering = (index: number) => {
    const current = data.offerings || [];
    onChange({ offerings: current.filter((_, i) => i !== index) });
  };

  const handleEditOffering = (index: number) => {
    const current = data.offerings || [];
    setFormData(current[index]);
    setEditingIndex(index);
  };

  const handleUpdateOffering = () => {
    const current = data.offerings || [];
    if (editingIndex !== null) {
      const updated = [...current];
      updated[editingIndex] = formData;
      onChange({ offerings: updated });
      setEditingIndex(null);
      setFormData({
        serviceType: 'event_companion',
        title: '',
        description: '',
        durationMinutes: 240,
        basePrice: 50,
        maxGroupSize: 4,
      });
    }
  };

  const durationLabel = (mins: number) => {
    if (mins === 120) return '2 hours';
    if (mins === 240) return '4 hours';
    if (mins === 480) return 'Full day (8h)';
    return `${mins} min`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Service Offerings</h2>
        <p className="mt-1 text-muted-foreground">What packages do you offer travelers?</p>
      </div>

      {/* Current offerings */}
      {(data.offerings || []).length > 0 && (
        <div className="space-y-3">
          {data.offerings!.map((offering, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{offering.title}</p>
                    <span className="rounded bg-muted px-2 py-1 text-xs font-medium capitalize">
                      {offering.serviceType.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{offering.description}</p>
                  <div className="mt-2 flex gap-4 text-sm">
                    <span>${offering.basePrice}/person</span>
                    <span>{durationLabel(offering.durationMinutes)}</span>
                    <span>Up to {offering.maxGroupSize} people</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEditOffering(index)}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => handleRemoveOffering(index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add offering form */}
      <Card className="p-6">
        <h3 className="font-semibold">
          {editingIndex !== null ? 'Edit Offering' : 'Add a New Offering'}
        </h3>

        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="serviceType">Service Type *</Label>
            <select
              id="serviceType"
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              className="mt-1 block w-full rounded border border-border bg-background px-3 py-2 text-sm"
            >
              {SERVICE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="E.g., 'Stadium tour with authentic street food'"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="What will travelers experience? Include highlights and what's included."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration *</Label>
              <select
                id="duration"
                value={formData.durationMinutes}
                onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                className="mt-1 block w-full rounded border border-border bg-background px-3 py-2 text-sm"
              >
                {SERVICE_DURATIONS.map((duration) => (
                  <option key={duration} value={duration}>
                    {durationLabel(duration)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="basePrice">Price per person (USD) *</Label>
              <Input
                id="basePrice"
                type="number"
                min="10"
                max="500"
                step="5"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="maxGroupSize">Max group size *</Label>
            <Input
              id="maxGroupSize"
              type="number"
              min="1"
              max="10"
              value={formData.maxGroupSize}
              onChange={(e) => setFormData({ ...formData, maxGroupSize: Number(e.target.value) })}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="inclusions">Inclusions (optional)</Label>
              <Textarea
                id="inclusions"
                placeholder="E.g., drinks, snacks, photos"
                value={formData.inclusions || ''}
                onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
                className="mt-1"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="exclusions">Exclusions (optional)</Label>
              <Textarea
                id="exclusions"
                placeholder="E.g., hotel transfer, meals"
                value={formData.exclusions || ''}
                onChange={(e) => setFormData({ ...formData, exclusions: e.target.value })}
                className="mt-1"
                rows={2}
              />
            </div>
          </div>

          <Button
            type="button"
            onClick={editingIndex !== null ? handleUpdateOffering : handleAddOffering}
            className="w-full"
          >
            {editingIndex !== null ? 'Update Offering' : 'Add Offering'}
          </Button>

          {editingIndex !== null && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setEditingIndex(null);
                setFormData({
                  serviceType: 'event_companion',
                  title: '',
                  description: '',
                  durationMinutes: 240,
                  basePrice: 50,
                  maxGroupSize: 4,
                });
              }}
              className="w-full"
            >
              Cancel Edit
            </Button>
          )}
        </div>
      </Card>

      {(data.offerings || []).length === 0 && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm font-medium text-yellow-900">
            You need at least one service offering.
          </p>
        </div>
      )}
    </div>
  );
}
