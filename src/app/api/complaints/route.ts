import { NextResponse } from 'next/server';
import { INITIAL_COMPLAINTS } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: INITIAL_COMPLAINTS,
    count: INITIAL_COMPLAINTS.length,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newId = `RF-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newComplaint = {
      ...body,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return NextResponse.json({
      success: true,
      message: 'Complaint recorded successfully',
      data: newComplaint,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }
}
