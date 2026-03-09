import { Instagram, Music2, Twitter } from 'lucide-react';

const links = [
  { name: 'About', href: '#hero' },
  { name: 'Cities', href: '#cities' },
  { name: 'Travelers', href: '#booking-layer' },
  { name: 'Become a Local', href: '#local-layer' },
  { name: 'FAQ', href: '#trust' },
  { name: 'Contact', href: '#booking-layer' },
];

const socialLinks = [
  { name: 'Instagram', href: '#', icon: Instagram },
  { name: 'TikTok', href: '#', icon: Music2 },
  { name: 'Twitter', href: '#', icon: Twitter },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container px-6 py-10 md:px-8">
        <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
          <div className="text-xl font-semibold">
            <span className="text-foreground">BEYON</span>
            <span className="text-primary">26</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            {links.map((link) => (
              <a key={link.name} href={link.href} className="text-muted-foreground transition hover:text-primary">
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a key={item.name} href={item.href} aria-label={item.name} className="text-muted-foreground transition hover:text-primary">
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} BEYON26</p>
      </div>
    </footer>
  );
}
