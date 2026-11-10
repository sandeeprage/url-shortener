import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateUniqueShortCode, isValidUrl, normalizeUrl } from '@/lib/utils';

export async function GET() {
  try {
    const urls = await prisma.url.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Error fetching URLs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch URLs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { originalUrl } = body;

    if (!originalUrl || typeof originalUrl !== 'string') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const normalizedUrl = normalizeUrl(originalUrl);

    if (!isValidUrl(normalizedUrl)) {
      return NextResponse.json(
        { error: 'Invalid URL format. Must be a valid HTTP/HTTPS URL' },
        { status: 400 }
      );
    }

    const code = await generateUniqueShortCode();

    const url = await prisma.url.create({
      data: {
        code,
        originalUrl: normalizedUrl,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const shortUrl = `${baseUrl}/${code}`;

    return NextResponse.json({
      url: {
        ...url,
        shortUrl,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating short URL:', error);
    
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Short code collision, please try again' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create short URL' },
      { status: 500 }
    );
  }
}