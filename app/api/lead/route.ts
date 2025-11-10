import { NextRequest, NextResponse } from 'next/server';
import { leadSchema } from '@/lib/validators';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = leadSchema.parse(body);

    // In production, you would:
    // 1. Save to database
    // 2. Send to CRM (like HubSpot, Salesforce)
    // 3. Send notification emails
    // 4. Trigger webhooks

    // For now, just log and return success
    console.log('Lead submitted:', {
      ...validatedData,
      timestamp: new Date().toISOString(),
    });

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Generate a mock lead ID
    const leadId = `LEAD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    return NextResponse.json(
      {
        ok: true,
        leadId,
        message: 'Your inquiry has been received. We\'ll contact you within 24 hours.',
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

    console.error('Lead submission error:', error);

    return NextResponse.json(
      {
        ok: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
