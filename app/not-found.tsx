import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center py-20">
      <div className="container px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-primary">404</h1>
          </div>

          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Page Not Found
          </h2>

          <p className="mb-8 text-lg text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/services">
                View Services
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <Link
              href="/choose-your-shadow"
              className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary"
            >
              <h3 className="mb-2 font-semibold">Choose Your Shadow</h3>
              <p className="text-sm text-muted-foreground">
                Explore our three Shadow archetypes
              </p>
            </Link>

            <Link
              href="/contact"
              className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary"
            >
              <h3 className="mb-2 font-semibold">Contact Us</h3>
              <p className="text-sm text-muted-foreground">
                Get in touch with our team
              </p>
            </Link>

            <Link
              href="/about"
              className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary"
            >
              <h3 className="mb-2 font-semibold">About Beyond26</h3>
              <p className="text-sm text-muted-foreground">
                Learn more about our mission
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
