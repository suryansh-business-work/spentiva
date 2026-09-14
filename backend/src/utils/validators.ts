import { z } from 'zod';
import { RULES } from '../config/rules.js';

const ISO_CURRENCIES = new Set(Intl.supportedValuesOf('currency'));

/** ISO 4217 alpha-3 currency code */
export const isCurrency = (code: string) => ISO_CURRENCIES.has(code.toUpperCase());

/** IANA time zone identifier (e.g. Asia/Kolkata) */
export function isTimeZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/** BCP 47 locale (e.g. en-IN) */
export function isLocale(locale: string): boolean {
  try {
    return Intl.getCanonicalLocales(locale).length > 0;
  } catch {
    return false;
  }
}

export const zCurrency = z
  .string()
  .trim()
  .transform((v) => v.toUpperCase())
  .refine(isCurrency, 'must be an ISO 4217 currency code');
export const zTimeZone = z.string().trim().refine(isTimeZone, 'must be an IANA time zone');
export const zLocale = z.string().trim().refine(isLocale, 'must be a BCP 47 locale');
export const zName = z.string().trim().min(1, 'is required').max(RULES.nameMax, 'is too long');
export const zColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'must be a hex color');
export const zObjectId = z.string().regex(/^[a-f0-9]{24}$/i, 'is not a valid id');

export const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
export const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
