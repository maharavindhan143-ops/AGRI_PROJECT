import { NextResponse } from 'next/server';
import { computeCropRecommendations } from '@/lib/aiEngine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const recommendations = computeCropRecommendations({
      nitrogen: Number(body.nitrogen || 140),
      phosphorus: Number(body.phosphorus || 55),
      potassium: Number(body.potassium || 165),
      ph: Number(body.ph || 6.8),
      soilType: body.soilType || 'alluvial',
      landSizeAcres: Number(body.landSizeAcres || 4.5),
    });
    return NextResponse.json({
      success: true,
      recommendations,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Recommendation calculation failed' }, { status: 500 });
  }
}
