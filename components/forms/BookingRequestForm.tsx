'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { createBookingSchema } from '@/lib/validation/schemas';
import { ZodError } from 'zod';

interface ServiceOffering {
  id: string;
  title: string;
  service_type: string;
  duration_minutes: number;
  base_price: number;
  max_group_size: number;
  description?: string;
}

interface BookingRequestFormProps {
  companionId: string;
  offerings: ServiceOffering[];
  onClose?: () => void;
}

export default function BookingRequestForm({
  companionId,
  offerings,
  onClose,
}: BookingRequestFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    serviceOfferingId: offerings[0]?.id || '',
    startAt: '',
    endAt: '',
    groupSize: '1',
    meetingPointName: '',
    meetingPointLat: '',
    meetingPointLng: '',
    meetingPointInstructions: '',
    travelerNotes: '',
  });

  const selectedOffering = offerings.find((o) => o.id === formData.serviceOfferingId);

  const handleNext = () => {
    if (step === 1) {
      if (!formData.serviceOfferingId || !formData.startAt) {
        setErrors({
          serviceOfferingId: !formData.serviceOfferingId ? 'Please select an offering' : '',
          startAt: !formData.startAt ? 'Please select a date and time' : '',
        });
        return;
      }
    } else if (step === 2) {
      if (!formData.groupSize || !formData.meetingPointName) {
        setErrors({
          groupSize: !formData.groupSize ? 'Please select group size' : '',
          meetingPointName: !formData.meetingPointName ? 'Please enter meeting point' : '',
        });
        return;
      }
    }

    setErrors({});
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Calculate endAt based on duration
      if (selectedOffering && formData.startAt && !formData.endAt) {
        const startDate = new Date(formData.startAt);
        const endDate = new Date(startDate.getTime() + selectedOffering.duration_minutes * 60000);
        formData.endAt = endDate.toISOString();
      }

      const validated = createBookingSchema.parse({
        companionId,
        serviceOfferingId: formData.serviceOfferingId,
        startAt: new Date(formData.startAt).toISOString(),
        endAt: new Date(formData.endAt || formData.startAt).toISOString(),
        groupSize: parseInt(formData.groupSize),
        basePrice: selectedOffering?.base_price || 0,
        meetingPointName: formData.meetingPointName,
        meetingPointLat: formData.meetingPointLat ? parseFloat(formData.meetingPointLat) : undefined,
        meetingPointLng: formData.meetingPointLng ? parseFloat(formData.meetingPointLng) : undefined,
        meetingPointInstructions: formData.meetingPointInstructions || undefined,
        travelerNotes: formData.travelerNotes || undefined,
      });

      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      });

      if (!bookingResponse.ok) {
        const data = await bookingResponse.json();
        throw new Error(data.error || 'Failed to create booking');
      }

      const booking = await bookingResponse.json();
      const bookingId = booking.id;

      // Create Stripe checkout session
      const checkoutResponse = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      });

      if (!checkoutResponse.ok) {
        const data = await checkoutResponse.json();
        throw new Error(data.error || 'Failed to create checkout session');
      }

      const { url } = await checkoutResponse.json();

      // Redirect to Stripe checkout
      if (url) {
        window.location.href = url;
      } else {
        router.push(`/dashboard/traveler/bookings/${bookingId}`);
      }
    } catch (err) {
      if (err instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          newErrors[e.path.join('.')] = e.message;
        });
        setErrors(newErrors);
      } else if (err instanceof Error) {
        setErrors({ submit: err.message });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const durationLabel = (mins: number) => {
    if (mins === 120) return '2 hours';
    if (mins === 240) return '4 hours';
    if (mins === 480) return 'Full day';
    return `${mins / 60} hours`;
  };

  return (
    <Card className="p-8">
      <h2 className="text-2xl font-semibold">Request a booking</h2>

      {/* Step 1: Service Selection */}
      {step === 1 && (
        <div className="mt-6 space-y-6">
          <div>
            <Label>Select service *</Label>
            <div className="mt-3 space-y-2">
              {offerings.map((offering) => (
                <label key={offering.id} className="flex cursor-pointer items-start gap-3 p-4">
                  <input
                    type="radio"
                    name="offering"
                    value={offering.id}
                    checked={formData.serviceOfferingId === offering.id}
                    onChange={(e) => setFormData({ ...formData, serviceOfferingId: e.target.value })}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{offering.title}</p>
                    <p className="text-sm text-muted-foreground">{offering.description}</p>
                    <div className="mt-2 flex gap-3 text-sm text-muted-foreground">
                      <span>${offering.base_price}/person</span>
                      <span>{durationLabel(offering.duration_minutes)}</span>
                      <span>Up to {offering.max_group_size} people</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {errors.serviceOfferingId && (
              <p className="mt-2 text-sm text-red-600">{errors.serviceOfferingId}</p>
            )}
          </div>

          <div>
            <Label htmlFor="startAt">Select date and time *</Label>
            <Input
              id="startAt"
              type="datetime-local"
              value={formData.startAt}
              onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
              className="mt-1"
              min={new Date().toISOString().slice(0, 16)}
            />
            {errors.startAt && <p className="mt-2 text-sm text-red-600">{errors.startAt}</p>}
          </div>

          {selectedOffering && formData.startAt && (
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm font-medium text-blue-900">
                Duration: {durationLabel(selectedOffering.duration_minutes)}
              </p>
              <p className="text-xs text-blue-800">
                Estimated end time: {new Date(new Date(formData.startAt).getTime() + selectedOffering.duration_minutes * 60000).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="groupSize">Group size *</Label>
              <select
                id="groupSize"
                value={formData.groupSize}
                onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })}
                className="mt-1 block w-full rounded border border-border bg-background px-3 py-2"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <option key={i} value={i}>
                    {i} {i === 1 ? 'person' : 'people'}
                  </option>
                ))}
              </select>
              {errors.groupSize && <p className="mt-1 text-sm text-red-600">{errors.groupSize}</p>}
            </div>

            {selectedOffering && parseInt(formData.groupSize) > selectedOffering.max_group_size && (
              <div className="rounded border border-red-200 bg-red-50 p-3">
                <p className="text-xs text-red-700">
                  Max group size: {selectedOffering.max_group_size}
                </p>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="meetingPointName">Meeting point *</Label>
            <Input
              id="meetingPointName"
              placeholder="E.g., 'Estadio Azteca main entrance' or 'Café in Roma Norte'"
              value={formData.meetingPointName}
              onChange={(e) => setFormData({ ...formData, meetingPointName: e.target.value })}
              className="mt-1"
            />
            {errors.meetingPointName && (
              <p className="mt-1 text-sm text-red-600">{errors.meetingPointName}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lat">Latitude (optional)</Label>
              <Input
                id="lat"
                type="number"
                placeholder="19.2957"
                step="0.0001"
                min="-90"
                max="90"
                value={formData.meetingPointLat}
                onChange={(e) => setFormData({ ...formData, meetingPointLat: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="lng">Longitude (optional)</Label>
              <Input
                id="lng"
                type="number"
                placeholder="-99.1643"
                step="0.0001"
                min="-180"
                max="180"
                value={formData.meetingPointLng}
                onChange={(e) => setFormData({ ...formData, meetingPointLng: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="instructions">Meeting instructions (optional)</Label>
            <Textarea
              id="instructions"
              placeholder="E.g., 'Look for someone in a red jacket' or 'Gate 2'"
              value={formData.meetingPointInstructions}
              onChange={(e) => setFormData({ ...formData, meetingPointInstructions: e.target.value })}
              className="mt-1"
              rows={3}
            />
          </div>
        </div>
      )}

      {/* Step 3: Summary */}
      {step === 3 && (
        <div className="mt-6 space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold">Booking summary</h3>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service:</span>
                <span className="font-medium">{selectedOffering?.title}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Date & time:</span>
                <span className="font-medium">{new Date(formData.startAt).toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium">{durationLabel(selectedOffering?.duration_minutes || 240)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Group size:</span>
                <span className="font-medium">{formData.groupSize} people</span>
              </div>

              <div className="flex justify-between border-t border-border pt-3">
                <span className="font-semibold">Total (before fees):</span>
                <span className="font-semibold">
                  ${((selectedOffering?.base_price || 0) * parseInt(formData.groupSize)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Additional notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Anything else the companion should know?"
              value={formData.travelerNotes}
              onChange={(e) => setFormData({ ...formData, travelerNotes: e.target.value })}
              rows={3}
            />
          </div>

          {errors.submit && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            if (step === 1) {
              onClose?.();
            } else {
              setStep(step - 1);
            }
          }}
        >
          {step === 1 ? 'Cancel' : 'Back'}
        </Button>

        {step < 3 ? (
          <Button type="button" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : 'Continue to payment'}
          </Button>
        )}
      </div>

      <div className="mt-4 text-center text-xs text-muted-foreground">
        Step {step} of 3
      </div>
    </Card>
  );
}
