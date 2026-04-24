import { NextRequest, NextResponse } from 'next/server';
import { calculateMetrics, CalculationInput } from '@/lib/strategy-calculations';

export async function POST(request: NextRequest) {
  try {
    const input: CalculationInput = await request.json();

    const metrics = calculateMetrics(input);

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('[/api/strategy/calculate] Error:', error);
    return NextResponse.json(
      { error: 'Error calculating metrics' },
      { status: 500 }
    );
  }
}
