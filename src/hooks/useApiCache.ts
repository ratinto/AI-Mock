import { useEffect, useMemo, useState } from 'react';
import { createCache } from '../lib/cache';

type CacheKey = string;

const cache = createCache<unknown>({ ttlMs: 60_000 });

export function useApiCache<T>(key: CacheKey, fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(() => (cache.get(key) as T | null) ?? null);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState<boolean>(() => !cache.has(key));

  const refresh = useMemo(() => {
    return async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetcher();
        cache.set(key, result);
        setData(result);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };
  }, [key, fetcher]);

  useEffect(() => {
    if (!cache.has(key)) void refresh();
  }, [key, refresh]);

  return { data, error, loading, refresh } as const;
}

