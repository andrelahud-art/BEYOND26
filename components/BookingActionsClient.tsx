'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, XCircle } from 'lucide-react';

interface BookingActionsClientProps {
  bookingId: string;
}

export default function BookingActionsClient({ bookingId }: BookingActionsClientProps) {
  const router = useRouter();
  const [action, setAction] = useState<'accept' | 'reject' | null>(null);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAction = async () => {
    if (!action) return;

    setIsLoading(true);
    setError('');

    try {
      const endpoint = action === 'accept'
        ? `/api/bookings/${bookingId}/accept`
        : `/api/bookings/${bookingId}/decline`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action === 'decline' ? { reason } : {}),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to process booking');
      }

      router.refresh();
      setAction(null);
      setReason('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!action) {
    return (
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Your response</h2>
        <div className="flex gap-3">
          <Button
            onClick={() => setAction('accept')}
            className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle2 className="h-4 w-4" />
            Accept booking
          </Button>
          <Button
            onClick={() => setAction('reject')}
            variant="secondary"
            className="flex-1 gap-2"
          >
            <XCircle className="h-4 w-4" />
            Decline
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-lg font-semibold">
        {action === 'accept' ? 'Confirm acceptance' : 'Decline booking'}
      </h2>

      {action === 'reject' && (
        <div className="mb-4">
          <label htmlFor="reason" className="block text-sm font-medium">
            Reason (optional)
          </label>
          <Textarea
            id="reason"
            placeholder="Let the traveler know why you can't take this booking..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-2"
            rows={3}
          />
        </div>
      )}

      {action === 'accept' && (
        <div className="mb-4 rounded bg-green-50 p-4">
          <p className="text-sm text-green-900">
            You're about to confirm this booking. The traveler will be notified immediately.
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          onClick={() => {
            setAction(null);
            setReason('');
            setError('');
          }}
          variant="secondary"
          className="flex-1"
          disabled={isLoading}
        >
          Cancel
        </Button>

        <Button
          onClick={handleAction}
          disabled={isLoading}
          className={`flex-1 ${
            action === 'accept'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {isLoading ? 'Processing...' : action === 'accept' ? 'Confirm' : 'Decline'}
        </Button>
      </div>
    </Card>
  );
}
