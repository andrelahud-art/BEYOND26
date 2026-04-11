import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://beyon26.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/explore',
    '/how-it-works',
    '/trust',
    '/cities/cdmx',
    '/apply',
    '/auth/sign-in',
    '/auth/sign-up',
  ];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.7,
  }));
}
