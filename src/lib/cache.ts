export type CacheOptions = {
  ttlMs: number;
};

type Entry<T> = {
  value: T;
  expiresAt: number;
};

export function createCache<T>(opts: CacheOptions) {
  const map = new Map<string, Entry<T>>();

  const now = () => Date.now();
  const isExpired = (e: Entry<T>) => e.expiresAt <= now();

  const get = (key: string): T | null => {
    const entry = map.get(key);
    if (!entry) return null;
    if (isExpired(entry)) {
      map.delete(key);
      return null;
    }
    return entry.value;
  };

  const set = (key: string, value: T) => {
    map.set(key, { value, expiresAt: now() + opts.ttlMs });
  };

  const has = (key: string) => get(key) !== null;
  const del = (key: string) => map.delete(key);
  const clear = () => map.clear();

  return { get, set, has, del, clear } as const;
}

