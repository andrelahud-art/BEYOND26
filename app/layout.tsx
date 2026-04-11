import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CookieConsent } from '@/components/CookieConsent';
import { AnalyticsProvider } from '@/components/AnalyticsProvider';

export const metadata: Metadata = {
  title: 'BEYON26 — Verified local companions for World Cup 2026',
  description:
    'Managed marketplace of ID-verified, interviewed, and monitored local companions in Ciudad de México. Matchday, city guiding, and live translation — backed by real ops.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AnalyticsProvider>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main id="main-content" className="flex-1 pt-16">
              {children}
            </main>
            <Footer />
          </div>
          <CookieConsent />
        </AnalyticsProvider>
      </body>
    </html>
  );
}
