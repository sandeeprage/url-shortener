import { prisma } from '@/lib/prisma';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const CODE_LENGTH = 7;

export function generateShortCode(): string {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
  }
  return code;
}

export async function generateUniqueShortCode(): Promise<string> {
  let code: string;
  let exists = true;
  let attempts = 0;
  const maxAttempts = 10;

  while (exists && attempts < maxAttempts) {
    code = generateShortCode();
    const existing = await prisma.url.findUnique({ where: { code } });
    exists = !!existing;
    attempts++;
  }

  if (exists) {
    throw new Error('Unable to generate unique short code after maximum attempts');
  }

  return code!;
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  // Check if URL already has a protocol
  try {
    new URL(trimmed);
    return trimmed;
  } catch {
    // No valid protocol, add https://
    return `https://${trimmed}`;
  }
}