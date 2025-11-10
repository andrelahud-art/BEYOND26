import { NextRequest, NextResponse } from 'next/server';
import { quoteSchema } from '@/lib/validators';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = quoteSchema.parse(body);

    // In production, you would:
    // 1. Save to database
    // 2. Trigger custom quote workflow
    // 3. Notify sales team
    // 4. Send confirmation email

    console.log('Quote request submitted:', {
      ...validatedData,
      timestamp: new Date().toISOString(),
    });

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Generate a mock quote ID
    const quoteId = `QUOTE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    return NextResponse.json(
      {
        ok: true,
        quoteId,
        message: 'Your custom quote request has been received. Our team will prepare a detailed proposal within 48 hours.',
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Validation failed',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    console.error('Quote request error:', error);

    return NextResponse.json(
      {
        ok: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
