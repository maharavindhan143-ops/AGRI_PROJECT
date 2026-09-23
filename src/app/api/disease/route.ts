import { NextResponse } from 'next/server';
import { classifyCropDisease } from '@/lib/aiEngine';

export async function POST(request: Request) {
  try {
    const { image, cropHint } = await request.json();
    const diagnosis = classifyCropDisease(image || '', cropHint);
    return NextResponse.json({
      success: true,
      diagnosis,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Diagnosis failed' }, { status: 500 });
  }
}
