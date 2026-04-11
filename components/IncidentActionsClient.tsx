'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface IncidentActionsClientProps {
  incidentId: string;
  currentStatus: string;
}

export default function IncidentActionsClient({
  incidentId,
  currentStatus,
}: IncidentActionsClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resolutionText, setResolutionText] = useState('');

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/incidents/${incidentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update incident');
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!resolutionText.trim()) {
      setError('Please provide a resolution description');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/incidents/${incidentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'resolved',
          resolution: resolutionText,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to resolve incident');
      }

      setSuccess(true);
      setTimeout(() => {
        router.refresh();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-green-600" />
        <p className="mt-2 font-medium text-green-900">Incident resolved!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex gap-2 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Status buttons */}
      <div className="flex gap-2">
        <Button
          onClick={() => handleStatusChange('investigating')}
          disabled={isLoading || currentStatus === 'investigating'}
          variant={currentStatus === 'investigating' ? 'default' : 'secondary'}
        >
          Mark Investigating
        </Button>
        <Button
          onClick={() => handleStatusChange('escalated')}
          disabled={isLoading}
          variant="secondary"
        >
          Escalate
        </Button>
      </div>

      {/* Resolution form */}
      <div className="border-t border-border pt-4">
        <Label htmlFor="resolution">Resolution (to close incident)</Label>
        <Textarea
          id="resolution"
          placeholder="Describe the resolution taken..."
          value={resolutionText}
          onChange={(e) => setResolutionText(e.target.value)}
          rows={4}
          className="mt-2"
        />
        <Button
          onClick={handleResolve}
          disabled={isLoading || !resolutionText.trim()}
          className="mt-3 w-full bg-green-600 hover:bg-green-700"
        >
          {isLoading ? 'Resolving...' : 'Resolve Incident'}
        </Button>
      </div>
    </div>
  );
}
