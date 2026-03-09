import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CookieConsent } from '@/components/CookieConsent';
import { AnalyticsProvider } from '@/components/AnalyticsProvider';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
  title: 'BEYON26 — Explore Mexico with Verified Local Companions',
  description:
    'Connect with verified local companions in Mexico City, Guadalajara, and Monterrey. Discover Mexico beyond tourist traps before World Cup 2026.',
});

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
