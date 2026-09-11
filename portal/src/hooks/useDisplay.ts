import { useMemo } from 'react';
import { useMe } from '@/lib/auth';
import type { Display } from '@/lib/format';

/** Locale + time zone of the signed-in admin (Settings → Display) */
export function useDisplay(): Display {
  const { locale, timezone } = useMe();
  return useMemo(() => ({ locale, timezone }), [locale, timezone]);
}
