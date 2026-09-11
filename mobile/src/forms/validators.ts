import { z } from 'zod';

/** Shared zod building blocks for every form */
const AMOUNT = /^\d+(\.\d{1,2})?$/;
const clean = (v: string) => v.replaceAll(',', '').trim();

export const zEmail = z.string().trim().min(1, 'Email is required').pipe(z.email('Enter a valid email'));
export const zPassword = z.string().min(6, 'At least 6 characters').max(100, 'At most 100 characters');
export const zName = z.string().trim().min(1, 'Name is required').max(60, 'At most 60 characters');
export const zPersonName = z.string().trim().min(2, 'Enter your name').max(60, 'At most 60 characters');
export const zCurrencyCode = z.string().regex(/^[A-Z]{3}$/, 'Pick a currency');

/** Required positive money amount typed as text (e.g. "1,250.50") */
export const zAmount = z
  .string()
  .min(1, 'Amount is required')
  .refine((v) => AMOUNT.test(clean(v)) && Number(clean(v)) > 0, 'Enter a valid amount (up to 2 decimals)');

/** Optional non-negative amount (empty = not set) */
export const zOptionalAmount = z.string().refine((v) => v.trim() === '' || AMOUNT.test(clean(v)), 'Enter a valid amount (up to 2 decimals)');

export const toAmount = (v: string) => Math.round(Number(clean(v)) * 100) / 100;
export const toOptionalAmount = (v: string) => (v.trim() === '' ? null : toAmount(v));
