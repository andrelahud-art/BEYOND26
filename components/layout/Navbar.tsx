'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navigation = [
  { name: 'How it Works', href: '#how-it-works' },
  { name: 'Cities', href: '#cities' },
  { name: 'Locals', href: '#locals' },
  { name: 'Panel Cliente', href: '#booking-layer' },
  { name: 'Panel Local', href: '#local-layer' },
  { name: 'Trust', href: '#trust' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur">
      <nav className="container flex h-16 items-center justify-between px-4 md:px-8">
        <a href="#hero" className="text-2xl font-semibold tracking-tight">
          <span className="text-foreground">BEYON</span>
          <span className="text-primary">26</span>
        </a>

        <div className="hidden items-center gap-5 md:flex">
          {navigation.map((item) => (
            <a key={item.name} href={item.href} className="text-sm text-muted-foreground transition hover:text-primary">
              {item.name}
            </a>
          ))}
        </div>

        <div className="hidden gap-2 md:flex">
          <a href="#booking-layer" className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary">
            Soy viajero
          </a>
          <a href="#local-layer" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
            Soy local
          </a>
        </div>

        <button type="button" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="container space-y-2 px-4 py-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-card hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <a href="#booking-layer" className="rounded-full border border-border px-4 py-2 text-center text-sm font-semibold">Soy viajero</a>
              <a href="#local-layer" className="rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground">Soy local</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
