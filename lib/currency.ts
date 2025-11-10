import { CountryCode } from './types';

// Hardcoded exchange rates (approximate)
// In production, these should be fetched from a real-time API
const EXCHANGE_RATES = {
  USD_TO_MXN: 18.0,
  USD_TO_EUR: 0.92,
  USD_TO_CAD: 1.36,
} as const;

export interface PriceDisplay {
  currency: string;
  symbol: string;
  amount: number;
  formatted: string;
  isApprox: boolean;
}

export function convertPrice(usdAmount: number, country: CountryCode): PriceDisplay {
  switch (country) {
    case 'mx':
      const mxnAmount = Math.round(usdAmount * EXCHANGE_RATES.USD_TO_MXN);
      return {
        currency: 'MXN',
        symbol: '$',
        amount: mxnAmount,
        formatted: `$${mxnAmount.toLocaleString('es-MX')} MXN`,
        isApprox: true,
      };
    case 'fr':
    case 'de':
      const eurAmount = Math.round(usdAmount * EXCHANGE_RATES.USD_TO_EUR);
      return {
        currency: 'EUR',
        symbol: '€',
        amount: eurAmount,
        formatted: `€${eurAmount.toLocaleString('de-DE')}`,
        isApprox: true,
      };
    case 'us':
    default:
      return {
        currency: 'USD',
        symbol: '$',
        amount: usdAmount,
        formatted: `$${usdAmount.toLocaleString('en-US')} USD`,
        isApprox: false,
      };
  }
}

export function formatPrice(amount: number | 'custom', country: CountryCode = 'us'): string {
  if (amount === 'custom') {
    return 'Custom Quote';
  }

  const price = convertPrice(amount, country);
  return price.isApprox ? `~${price.formatted}` : price.formatted;
}
