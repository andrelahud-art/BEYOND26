'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle2, Star } from 'lucide-react';
import { submitReviewSchema } from '@/lib/validation/schemas';
import { ZodError } from 'zod';

interface ReviewFormProps {
  bookingId: string;
  companionId: string;
}

const ScoreSelect = ({
  value,
  onChange,
  label,
}: {
  value: number | undefined;
  onChange: (val: number) => void;
  label: string;
}) => {
  return (
    <div>
      <Label className="text-sm">{label}</Label>
      <div className="mt-2 flex gap-2">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            onClick={() => onChange(score)}
            className={`p-2 rounded transition-colors ${
              value === score
                ? 'bg-amber-100 text-amber-700'
                : 'bg-muted text-muted-foreground hover:bg-muted-foreground/20'
            }`}
            type="button"
          >
            <Star
              className={`h-5 w-5 ${value === score ? 'fill-amber-400' : ''}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default function ReviewForm({ bookingId, companionId }: ReviewFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    scoreOverall: 5,
    scoreCommunication: undefined as number | undefined,
    scorePunctuality: undefined as number | undefined,
    scoreSafety: undefined as number | undefined,
    scoreKnowledge: undefined as number | undefined,
    scoreValue: undefined as number | undefined,
    wouldRepeat: false,
    comment: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const validated = submitReviewSchema.parse({
        bookingId,
        ...formData,
      });

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit review');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/dashboard/bookings/${bookingId}`);
      }, 2000);
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
        setError(errors.join('; '));
      } else if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
        <p className="mt-3 font-medium text-green-900">Review submitted!</p>
        <p className="mt-1 text-sm text-green-800">
          Your review will be published once the companion leaves their review too.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-6 rounded-lg border border-border bg-card p-6">
        <div>
          <Label className="text-base font-semibold">Overall experience *</Label>
          <p className="text-sm text-muted-foreground mb-3">
            How would you rate your overall experience?
          </p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                onClick={() => setFormData({ ...formData, scoreOverall: score })}
                className={`p-3 rounded-lg transition-colors ${
                  formData.scoreOverall === score
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-muted text-muted-foreground hover:bg-muted-foreground/20'
                }`}
                type="button"
              >
                <Star
                  className={`h-6 w-6 ${
                    formData.scoreOverall === score ? 'fill-amber-400' : ''
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <h3 className="font-semibold mb-4">Additional feedback (optional)</h3>
          <div className="space-y-4">
            <ScoreSelect
              label="Communication"
              value={formData.scoreCommunication}
              onChange={(val) =>
                setFormData({ ...formData, scoreCommunication: val })
              }
            />
            <ScoreSelect
              label="Punctuality"
              value={formData.scorePunctuality}
              onChange={(val) =>
                setFormData({ ...formData, scorePunctuality: val })
              }
            />
            <ScoreSelect
              label="Safety"
              value={formData.scoreSafety}
              onChange={(val) =>
                setFormData({ ...formData, scoreSafety: val })
              }
            />
            <ScoreSelect
              label="Knowledge"
              value={formData.scoreKnowledge}
              onChange={(val) =>
                setFormData({ ...formData, scoreKnowledge: val })
              }
            />
            <ScoreSelect
              label="Value for money"
              value={formData.scoreValue}
              onChange={(val) => setFormData({ ...formData, scoreValue: val })}
            />
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.wouldRepeat}
              onChange={(e) =>
                setFormData({ ...formData, wouldRepeat: e.target.checked })
              }
              className="rounded"
            />
            <span>I would book with this companion again</span>
          </label>
        </div>

        <div className="border-t border-border pt-6">
          <Label htmlFor="comment">Comments (optional)</Label>
          <Textarea
            id="comment"
            placeholder="Share any additional thoughts or feedback..."
            value={formData.comment}
            onChange={(e) =>
              setFormData({
                ...formData,
                comment: e.target.value.slice(0, 2000),
              })
            }
            rows={4}
            className="mt-2"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {formData.comment.length} / 2000 characters
          </p>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Submitting...' : 'Submit review'}
      </Button>
    </form>
  );
}
