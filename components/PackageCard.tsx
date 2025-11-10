'use client';

import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ServicePackage, CountryCode } from '@/lib/types';
import { formatPrice } from '@/lib/currency';
import { cn } from '@/lib/utils';

interface PackageCardProps {
  package: ServicePackage;
  country?: CountryCode;
  featured?: boolean;
}

export function PackageCard({ package: pkg, country = 'us', featured = false }: PackageCardProps) {
  return (
    <Card
      className={cn(
        'relative flex flex-col transition-all hover:shadow-2xl',
        featured && 'border-primary shadow-xl'
      )}
    >
      {featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-semibold text-primary-foreground">
          Most Popular
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-2xl">{pkg.name}</CardTitle>
        <CardDescription className="text-base">{pkg.description}</CardDescription>
        <div className="pt-4">
          <div className="text-4xl font-bold text-primary">
            {formatPrice(pkg.usdPrice, country)}
          </div>
          {pkg.hours && (
            <p className="mt-1 text-sm text-muted-foreground">{pkg.hours} hours coverage</p>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="space-y-4">
          <div>
            <h4 className="mb-3 font-semibold">Includes:</h4>
            <ul className="space-y-2">
              {pkg.includes.slice(0, 5).map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
              {pkg.includes.length > 5 && (
                <li className="text-sm text-muted-foreground">+ {pkg.includes.length - 5} more...</li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        {pkg.usdPrice === 'custom' ? (
          <Button asChild className="w-full" variant="primary">
            <Link href="/contact">Request Quote <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        ) : (
          <>
            <Button asChild className="w-full" variant="primary">
              <Link href="/contact">Book Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            {pkg.calendlyUrl && (
              <Button asChild className="w-full" variant="ghost" size="sm">
                <a href={pkg.calendlyUrl} target="_blank" rel="noopener noreferrer">
                  Schedule Consultation
                </a>
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
}
