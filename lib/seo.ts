import { Metadata } from 'next';
import { CountryCode } from './types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://beyond26.com';
const SITE_NAME = 'Beyond26';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og/og-home.jpg`;

export interface SEOConfig {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  locale?: string;
  alternates?: {
    languages: Record<string, string>;
  };
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    image = DEFAULT_OG_IMAGE,
    url = SITE_URL,
    type = 'website',
    locale = 'en',
    alternates,
  } = config;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: alternates || undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale,
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'Luxury Shadow Concierge 24/7 for 2026 travelers in Mexico',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['English', 'Spanish', 'French', 'German'],
    },
  };
}

export function generateServiceSchema(service: {
  name: string;
  description: string;
  price: number | 'custom';
}) {
  if (service.price === 'custom') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.name,
      description: service.description,
      provider: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      price: service.price,
      priceCurrency: 'USD',
    },
  };
}

export function generateLocalBusinessSchema(city: {
  name: string;
  lat: number;
  lng: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `${SITE_NAME} - ${city.name}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city.name,
      addressCountry: 'MX',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: city.lat,
      longitude: city.lng,
    },
  };
}

export const HREFLANG_MAP: Record<CountryCode, string> = {
  us: 'en',
  mx: 'es',
  fr: 'fr',
  de: 'de',
};

export function generateHreflangLinks(basePath: string) {
  const countries: CountryCode[] = ['us', 'mx', 'fr', 'de'];
  return countries.map((country) => ({
    rel: 'alternate',
    hreflang: HREFLANG_MAP[country],
    href: `${SITE_URL}/countries/${country}`,
  }));
}
