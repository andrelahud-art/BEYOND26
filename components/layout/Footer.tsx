import Link from 'next/link';
import { Instagram, Music2, Twitter } from 'lucide-react';

const footerNav = {
  Product: [
    { name: 'Explore CDMX', href: '/explore' },
    { name: 'How it works', href: '/how-it-works' },
    { name: 'Cities', href: '/cities/cdmx' },
  ],
  Trust: [
    { name: 'Trust & safety', href: '/trust' },
    { name: 'Sign in', href: '/auth/sign-in' },
    { name: 'Get started', href: '/auth/sign-up' },
  ],
  Companions: [
    { name: 'Become a companion', href: '/apply' },
  ],
};

const socialLinks = [
  { name: 'Instagram', href: '#', icon: Instagram },
  { name: 'TikTok', href: '#', icon: Music2 },
  { name: 'Twitter', href: '#', icon: Twitter },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr,1fr,1fr,1fr]">
          <div>
            <div className="text-2xl font-semibold">
              <span className="text-foreground">BEYON</span>
              <span className="text-primary">26</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Managed marketplace of verified local companions for World Cup 2026.
            </p>
          </div>

          {Object.entries(footerNav).map(([heading, items]) => (
            <div key={heading}>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {heading}
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-foreground/80 transition hover:text-primary"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} BEYON26. Building for World Cup 2026.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  aria-label={item.name}
                  className="text-muted-foreground transition hover:text-primary"
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
