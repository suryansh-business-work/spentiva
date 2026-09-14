import { z } from 'zod';
import type { Me } from '@/lib/auth';

const isLocale = (v: string) => {
  try {
    return Intl.getCanonicalLocales(v).length === 1;
  } catch {
    return false;
  }
};

/** Time zone must be one the API knows (list comes from the `timeZones` query); locale is BCP 47 */
export const displaySchema = (timeZones: readonly string[]) => {
  const known = new Set(timeZones);
  return z.object({
    timezone: z.string().refine((v) => known.has(v), 'Pick a time zone from the list'),
    locale: z.string().trim().min(2, 'Enter a locale, e.g. en-IN').refine(isLocale, 'Use a BCP 47 locale such as en-IN or en-US'),
  });
};

export type DisplayValues = z.infer<ReturnType<typeof displaySchema>>;

export const displayDefaults = (me: Me): DisplayValues => ({ timezone: me.timezone, locale: me.locale });

/** Live preview of how dates will look with the typed settings */
export function previewDate(v: Partial<DisplayValues>): string {
  try {
    return new Intl.DateTimeFormat(v.locale || undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: v.timezone || undefined,
    }).format(new Date());
  } catch {
    return '—';
  }
}
