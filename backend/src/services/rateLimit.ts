/** Fixed-window counter per key (e.g. client IP). In memory: the API runs as one container. */
export function createRateLimiter(limit: number, windowMs: number) {
  const windows = new Map<string, { start: number; used: number }>();

  return function allow(key: string, cost = 1): boolean {
    const now = Date.now();
    if (windows.size > 10_000) {
      for (const [k, w] of windows) if (now - w.start >= windowMs) windows.delete(k);
    }
    const current = windows.get(key);
    if (!current || now - current.start >= windowMs) {
      windows.set(key, { start: now, used: cost });
      return cost <= limit;
    }
    current.used += cost;
    return current.used <= limit;
  };
}
