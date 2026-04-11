'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const navigation = [
  { name: 'Explore', href: '/explore' },
  { name: 'How it works', href: '/how-it-works' },
  { name: 'Trust & safety', href: '/trust' },
  { name: 'Become a companion', href: '/apply' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="text-2xl font-semibold tracking-tight">
          <span className="text-foreground">BEYON</span>
          <span className="text-primary">26</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm text-muted-foreground transition hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden gap-2 md:flex">
          <Link
            href="/auth/sign-in"
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
          >
            Sign in
          </Link>
          <Link
            href="/auth/sign-up"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Get started
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto max-w-6xl space-y-2 px-4 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-card hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                href="/auth/sign-in"
                className="rounded-full border border-border px-4 py-2 text-center text-sm font-semibold"
              >
                Sign in
              </Link>
              <Link
                href="/auth/sign-up"
                className="rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
