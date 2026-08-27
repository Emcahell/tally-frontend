interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const DEFAULT_TTL = 30_000; // 30 seconds

/** Guarda datos en el cache */
export function setCache<T>(key: string, data: T, ttl = DEFAULT_TTL): void {
  cache.set(key, { data, timestamp: Date.now() + ttl });
}

/** Obtiene datos del cache si no han expirado */
export function getCache<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() > entry.timestamp) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

/** Invalida una entrada del cache */
export function invalidateCache(key: string): void {
  cache.delete(key);
}
