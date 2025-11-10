import { CountryCode, PackageId, ShadowType } from './types';

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Initialize GA4
export const initGA = () => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    window.gtag?.('config', GA_TRACKING_ID, {
      page_path: window.location.pathname,
    });
  }
};

// Page view tracking
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    window.gtag?.('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Event tracking types
export interface GAEventParams {
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

// Generic event tracking
export const trackEvent = (eventName: string, params?: GAEventParams) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

// Specific event trackers
export const analytics = {
  viewHome: () => trackEvent('view_home'),

  selectCountryTab: (country: CountryCode) =>
    trackEvent('select_country_tab', { country }),

  viewServices: () => trackEvent('view_services'),

  viewShadowPicker: () => trackEvent('view_shadow_picker'),

  selectShadow: (shadowType: ShadowType) =>
    trackEvent('select_shadow', { shadowType }),

  startCheckout: (packageId: PackageId, usdPrice: number | 'custom') =>
    trackEvent('start_checkout', {
      packageId,
      value: typeof usdPrice === 'number' ? usdPrice : 0,
      currency: 'USD',
    }),

  leadSubmit: (data: {
    country: CountryCode;
    packageId?: PackageId;
    shadowType?: ShadowType;
  }) =>
    trackEvent('lead_submit', {
      country: data.country,
      packageId: data.packageId,
      shadowType: data.shadowType,
    }),

  quoteRequest: (teamSize: number, cities: string[]) =>
    trackEvent('quote_request', {
      teamSize,
      cities: cities.join(','),
    }),

  whatsappClick: (packageId?: PackageId, shadowType?: ShadowType) =>
    trackEvent('whatsapp_click', { packageId, shadowType }),

  calendlyClick: (packageId: PackageId) =>
    trackEvent('calendly_click', { packageId }),

  viewExperience: () => trackEvent('view_experience'),

  viewAbout: () => trackEvent('view_about'),

  viewContact: () => trackEvent('view_contact'),
};
