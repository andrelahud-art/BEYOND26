import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://beyond26.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/services',
    '/experience',
    '/about',
    '/contact',
    '/choose-your-shadow',
    '/countries/us',
    '/countries/mx',
    '/countries/fr',
    '/countries/de',
    '/legal/privacy',
    '/legal/terms',
    '/legal/cookies',
  ];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));
}
