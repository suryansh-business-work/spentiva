import { env } from '../config/env.js';
import { badInput } from '../utils/errors.js';

const TTL_MS = 6 * 60 * 60 * 1000;
const ATTEMPTS = 2;
const cache = new Map<string, { at: number; rates: Record<string, number> }>();

async function fetchRates(base: string): Promise<Record<string, number>> {
  let lastError: unknown = null;
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      const res = await fetch(`${env.FX_API_URL}/${base}`, { signal: AbortSignal.timeout(8_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as { rates?: Record<string, number> };
      if (!json.rates) throw new Error('response has no rates');
      return json.rates;
    } catch (err) {
      lastError = err;
    }
  }
  console.error(`FX rates for ${base} failed:`, lastError);
  throw badInput(`Could not fetch exchange rates for ${base}. Please try again.`);
}

async function ratesFor(base: string): Promise<Record<string, number>> {
  const hit = cache.get(base);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.rates;
  const rates = await fetchRates(base);
  cache.set(base, { at: Date.now(), rates });
  return rates;
}

/** Rate to multiply an amount in `from` by to get `to` (ISO 4217 codes) */
export async function getRate(from: string, to: string): Promise<number> {
  if (from === to) return 1;
  const rate = (await ratesFor(from))[to];
  if (!rate) throw badInput(`Currency ${from} → ${to} is not supported`);
  return rate;
}
