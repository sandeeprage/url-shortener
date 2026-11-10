'use client';

import { useState, FormEvent } from 'react';
import { UrlData } from '@/types';

interface UrlFormProps {
  onShorten: (url: string) => Promise<void>;
  isLoading: boolean;
  result?: UrlData;
  error?: string;
  onCopy: () => Promise<void>;
  onClear: () => void;
}

export function UrlForm({ onShorten, isLoading, result, error, onCopy, onClear }: UrlFormProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    await onShorten(url.trim());
  };

  const handleClear = () => {
    setUrl('');
    onClear();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label htmlFor="url" className="sr-only">Enter URL to shorten</label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter a long URL to shorten..."
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            disabled={isLoading}
            aria-describedby={error ? 'url-error' : undefined}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-lg">
              <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          )}
        </div>

        {error && (
          <p id="url-error" className="text-red-600 text-sm" role="alert">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Shortening...' : 'Shorten URL'}
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={isLoading && !result}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Clear
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in" role="status">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-green-800 font-medium">Shortened URL</h3>
            <button
              onClick={onCopy}
              className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              aria-label="Copy shortened URL to clipboard"
            >
              Copy
            </button>
          </div>
          <a
            href={result.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all font-mono text-sm"
          >
            {result.shortUrl}
          </a>
          <p className="mt-2 text-sm text-green-700">
            Original: <span className="break-all">{result.originalUrl}</span>
          </p>
        </div>
      )}
    </div>
  );
}