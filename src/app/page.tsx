'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { UrlForm } from '@/components/UrlForm';
import { UrlList } from '@/components/UrlList';
import { UrlData } from '@/types';

export default function Home() {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [result, setResult] = useState<UrlData | undefined>();
  const [error, setError] = useState<string | undefined>();
  const fetchUrlsRef = useRef<() => Promise<void> | null>(null);

  const fetchUrls = useCallback(async () => {
    try {
      setIsLoadingList(true);
      const response = await fetch('/api/urls');
      const data = await response.json();
      if (data.urls) {
        setUrls(data.urls);
      }
    } catch (err) {
      console.error('Failed to fetch URLs:', err);
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  // Store fetchUrls in ref to avoid effect dependency
  useEffect(() => {
    fetchUrlsRef.current = fetchUrls;
  }, [fetchUrls]);

  // Initial fetch - use a timeout to defer setState
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUrlsRef.current?.();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleShorten = async (originalUrl: string) => {
    setIsLoading(true);
    setError(undefined);
    setResult(undefined);

    try {
      const response = await fetch('/api/urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to shorten URL');
      }

      setResult(data.url);
      fetchUrls();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.shortUrl);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleClear = () => {
    setResult(undefined);
    setError(undefined);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/urls/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete URL');
      }

      fetchUrls();
    } catch (err) {
      console.error('Failed to delete URL:', err);
      alert('Failed to delete URL');
    }
  };

  const handleRefresh = fetchUrls;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">URL Shortener</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Create short, memorable links for long URLs</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <UrlForm
          onShorten={handleShorten}
          isLoading={isLoading}
          result={result}
          error={error}
          onCopy={handleCopy}
          onClear={handleClear}
        />

        <UrlList
          urls={urls}
          isLoading={isLoadingList}
          onDelete={handleDelete}
          onRefresh={handleRefresh}
        />
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Built with Next.js, TypeScript, Tailwind CSS, PostgreSQL, and Prisma</p>
        </div>
      </footer>
    </div>
  );
}