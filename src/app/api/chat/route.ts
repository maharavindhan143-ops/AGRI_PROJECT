import { NextResponse } from 'next/server';
import { processChatMessage } from '@/lib/chatEngine';

export async function POST(request: Request) {
  try {
    const { message, language = 'en', history = [] } = await request.json();
    
    const response = processChatMessage({
      query: message || '',
      history: history || [],
      language: language === 'ta' ? 'ta' : 'en',
    });

    return NextResponse.json({
      success: true,
      reply: response.text,
      actionLink: response.actionLink,
      detectedIntent: response.detectedIntent,
      detectedEntity: response.detectedEntity,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Chat processing failed' }, { status: 500 });
  }
}

