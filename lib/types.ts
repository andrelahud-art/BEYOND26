// Core types for Beyond26

export type CountryCode = 'us' | 'mx' | 'fr' | 'de';

export type ShadowType = 'conversationalist' | 'balanced' | 'silent';

export type PackageId = 'matchday-lite' | 'weekend-pro' | 'elite-family' | 'beyond-corporate';

export interface ServicePackage {
  id: PackageId;
  name: string;
  usdPrice: number | 'custom';
  hours?: number;
  includes: string[];
  addOns: string[];
  description: string;
  calendlyUrl?: string;
}

export interface ShadowArchetype {
  id: ShadowType;
  name: string;
  description: string;
  idealFor: string[];
  keywords: string[];
  characteristics: string[];
}

export interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  country: CountryCode;
  city?: string;
  preferredDates?: string;
  shadowType?: ShadowType;
  packageId?: PackageId;
  message?: string;
}

export interface QuotePayload {
  name: string;
  email: string;
  phone: string;
  country: CountryCode;
  teamSize: number;
  dates: string;
  cities: string[];
  specialNeeds?: string;
}

export interface CountryContent {
  code: CountryCode;
  name: string;
  flag: string;
  language: string;
  hero: {
    title: string;
    subtitle: string;
  };
  content: string;
  currency: string;
  seo: {
    title: string;
    description: string;
  };
}

export interface HostCity {
  name: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
}
