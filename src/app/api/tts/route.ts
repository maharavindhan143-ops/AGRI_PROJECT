import { NextRequest, NextResponse } from 'next/server';

function splitTextIntoChunks(text: string, maxLen = 180): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let current = '';

  for (const word of words) {
    if ((current + ' ' + word).trim().length <= maxLen) {
      current = (current + ' ' + word).trim();
    } else {
      if (current) chunks.push(current);
      current = word;
    }
  }
  if (current) chunks.push(current);
  return chunks.length > 0 ? chunks : [text];
}

async function fetchChunkAudio(chunk: string, targetLang: string): Promise<Buffer | null> {
  try {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${targetLang}&client=tw-ob&q=${encodeURIComponent(chunk)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://translate.google.com/',
      },
    });
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (err) {
    console.error('Error fetching chunk:', err);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text');
  const lang = searchParams.get('lang') || 'ta';

  if (!text) {
    return new NextResponse('Missing text parameter', { status: 400 });
  }

  const targetLang = lang === 'ta' ? 'ta' : 'en';
  const cleanText = text.trim();

  try {
    const chunks = splitTextIntoChunks(cleanText, 180);
    const audioBuffers = await Promise.all(chunks.map(chunk => fetchChunkAudio(chunk, targetLang)));
    const validBuffers = audioBuffers.filter((b): b is Buffer => b !== null);

    if (validBuffers.length === 0) {
      return new NextResponse('Failed to generate audio', { status: 500 });
    }

    // MP3 frames can be directly concatenated into one seamless, continuous stream with 0 gaps!
    const combinedBuffer = Buffer.concat(validBuffers);

    return new NextResponse(combinedBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (error) {
    console.error('TTS API error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
