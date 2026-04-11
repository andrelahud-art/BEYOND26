'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SessionCheckInProps {
  bookingId: string;
  startTime: string;
  meetingPoint: string;
}

export default function SessionCheckIn({
  bookingId,
  startTime,
  meetingPoint,
}: SessionCheckInProps) {
  const router = useRouter();
  const [step, setStep] = useState<'start' | 'location' | 'confirm'>('start');
  const [method, setMethod] = useState('manual');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const getLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude.toString());
          setLng(position.coords.longitude.toString());
          setMethod('gps');
          setStep('confirm');
        },
        (err) => {
          setError(`Failed to get location: ${err.message}`);
        }
      );
    } else {
      setError('Geolocation not supported');
    }
  };

  const handleCheckIn = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/bookings/${bookingId}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: step === 'location' ? method : 'manual',
          lat: lat ? parseFloat(lat) : undefined,
          lng: lng ? parseFloat(lng) : undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Check-in failed');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/dashboard/bookings/${bookingId}/session`);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8">
      <h2 className="text-2xl font-semibold">Check in to your session</h2>

      {success ? (
        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-6 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
          <p className="mt-2 font-semibold text-green-900">Check-in successful!</p>
          <p className="mt-1 text-sm text-green-800">Redirecting to session...</p>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {/* Start confirmation */}
          {step === 'start' && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 flex-shrink-0 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Meeting point</p>
                  <p className="text-sm text-blue-800">{meetingPoint}</p>
                  <p className="mt-1 text-xs text-blue-700">
                    Expected time: {new Date(startTime).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-blue-900">Are you at the meeting point?</p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setStep('location')}
                    className="flex-1"
                  >
                    Yes, check me in
                  </Button>
                  <Button
                    onClick={() => setStep('start')}
                    variant="secondary"
                    className="flex-1"
                  >
                    Not yet
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Location selection */}
          {step === 'location' && (
            <div className="space-y-3">
              <p className="text-sm font-medium">How would you like to check in?</p>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-4 hover:bg-muted/50">
                <input
                  type="radio"
                  value="gps"
                  checked={method === 'gps'}
                  onChange={(e) => setMethod(e.target.value)}
                  className="cursor-pointer"
                />
                <div className="flex-1">
                  <p className="font-medium">GPS check-in</p>
                  <p className="text-xs text-muted-foreground">
                    Share your current location for verification
                  </p>
                </div>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-4 hover:bg-muted/50">
                <input
                  type="radio"
                  value="code"
                  checked={method === 'code'}
                  onChange={(e) => setMethod(e.target.value)}
                  className="cursor-pointer"
                />
                <div className="flex-1">
                  <p className="font-medium">Code check-in</p>
                  <p className="text-xs text-muted-foreground">
                    Enter a code provided by your companion
                  </p>
                </div>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-4 hover:bg-muted/50">
                <input
                  type="radio"
                  value="manual"
                  checked={method === 'manual'}
                  onChange={(e) => setMethod(e.target.value)}
                  className="cursor-pointer"
                />
                <div className="flex-1">
                  <p className="font-medium">Manual confirmation</p>
                  <p className="text-xs text-muted-foreground">
                    Confirm you're ready to start
                  </p>
                </div>
              </label>

              {method === 'gps' && (
                <Button onClick={getLocation} className="w-full">
                  Get my location
                </Button>
              )}

              {(method === 'code' || method === 'manual') && (
                <Button onClick={() => setStep('confirm')} className="w-full">
                  Continue
                </Button>
              )}
            </div>
          )}

          {/* Confirmation */}
          {step === 'confirm' && (
            <div className="space-y-4 rounded-lg border border-green-200 bg-green-50 p-4">
              <div>
                <p className="text-sm font-medium text-green-900">Check-in details</p>
                <div className="mt-2 space-y-1 text-sm text-green-800">
                  <p>Method: <span className="capitalize font-medium">{method}</span></p>
                  {lat && lng && (
                    <>
                      <p>Location: {parseFloat(lat).toFixed(4)}, {parseFloat(lng).toFixed(4)}</p>
                    </>
                  )}
                  <p>Time: {new Date().toLocaleTimeString()}</p>
                </div>
              </div>

              <Button
                onClick={handleCheckIn}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isLoading ? 'Checking in...' : 'Confirm check-in'}
              </Button>

              <Button
                onClick={() => {
                  setStep('start');
                  setLat('');
                  setLng('');
                }}
                variant="secondary"
                className="w-full"
              >
                Go back
              </Button>
            </div>
          )}

          {error && (
            <div className="flex gap-2 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
