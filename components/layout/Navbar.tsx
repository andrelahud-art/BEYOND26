'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { COUNTRIES } from '@/lib/data/countries';

const navigation = [
  { name: 'Services', href: '/services' },
  { name: 'Experience', href: '/experience' },
  { name: 'Choose Your Shadow', href: '/choose-your-shadow' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          <span className="text-foreground">Beyond</span>
          <span className="text-primary">26</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === item.href ? 'text-primary' : 'text-foreground'
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Country Selector & CTA */}
        <div className="hidden items-center gap-4 md:flex">
          <select
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            onChange={(e) => {
              if (e.target.value) {
                window.location.href = `/countries/${e.target.value}`;
              }
            }}
          >
            <option value="">🌍 Select Country</option>
            {COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.name}
              </option>
            ))}
          </select>
          <Button asChild size="sm">
            <Link href="/contact">Book Now</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="container space-y-1 px-4 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'block rounded-lg px-3 py-2 text-base font-medium transition-colors hover:bg-accent/10',
                  pathname === item.href ? 'text-primary' : 'text-foreground'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              <select
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                onChange={(e) => {
                  if (e.target.value) {
                    window.location.href = `/countries/${e.target.value}`;
                  }
                }}
              >
                <option value="">🌍 Select Country</option>
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
              <Button asChild className="w-full">
                <Link href="/contact">Book Now</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
