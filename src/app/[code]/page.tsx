import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

interface Props {
  params: Promise<{ code: string }>;
}

export default async function RedirectPage({ params }: Props) {
  const { code } = await params;

  // Exclude API routes and other internal routes
  if (code.startsWith('api') || code.startsWith('_next') || code === 'favicon.ico') {
    notFound();
  }

  try {
    const url = await prisma.url.findUnique({
      where: { code },
    });

    if (!url) {
      notFound();
    }

    // Increment click count
    await prisma.url.update({
      where: { id: url.id },
      data: { clicks: { increment: 1 } },
    });

    redirect(url.originalUrl);
  } catch (error) {
    // Re-throw Next.js redirect errors
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    console.error('Error redirecting:', error);
    notFound();
  }
}