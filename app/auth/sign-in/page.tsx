import Link from 'next/link';
import { Metadata } from 'next';
import { SignInForm } from './SignInForm';

export const metadata: Metadata = {
  title: 'Sign in — BEYON26',
  description: 'Sign in to your BEYON26 account.',
};

export default function SignInPage({
  searchParams,
}: {
  searchParams: { next?: string; error?: string };
}) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to manage your bookings and trips.
        </p>
      </div>

      {searchParams.error && (
        <div className="mb-6 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {searchParams.error}
        </div>
      )}

      <SignInForm next={searchParams.next ?? '/dashboard/traveler'} />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        No account yet?{' '}
        <Link href="/auth/sign-up" className="font-medium text-primary hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
