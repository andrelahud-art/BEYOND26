import { NextRequest, NextResponse } from 'next/server';
import { PACKAGES, ADD_ONS } from '@/lib/data/packages';
import { convertPrice } from '@/lib/currency';
import { CountryCode } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = (searchParams.get('country') as CountryCode) || 'us';

    // Convert prices for the requested country
    const packagesWithLocalPricing = PACKAGES.map((pkg) => {
      if (pkg.usdPrice === 'custom') {
        return {
          ...pkg,
          localPrice: 'custom',
        };
      }

      const localPrice = convertPrice(pkg.usdPrice, country);

      return {
        ...pkg,
        usdPrice: pkg.usdPrice,
        localPrice: {
          currency: localPrice.currency,
          amount: localPrice.amount,
          formatted: localPrice.formatted,
          isApprox: localPrice.isApprox,
        },
      };
    });

    const addOnsWithLocalPricing = ADD_ONS.map((addon) => {
      const localPrice = convertPrice(addon.basePrice, country);

      return {
        ...addon,
        usdPrice: addon.basePrice,
        localPrice: {
          currency: localPrice.currency,
          amount: localPrice.amount,
          formatted: localPrice.formatted,
          isApprox: localPrice.isApprox,
        },
      };
    });

    return NextResponse.json({
      ok: true,
      country,
      packages: packagesWithLocalPricing,
      addOns: addOnsWithLocalPricing,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Pricing API error:', error);

    return NextResponse.json(
      {
        ok: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
