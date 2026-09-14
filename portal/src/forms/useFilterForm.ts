import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef } from 'react';
import { useForm, useWatch, type FieldValues } from 'react-hook-form';
import type { z } from 'zod';

/**
 * A filter form that applies itself: every valid change the user makes is pushed to `onApply`
 * (debounced, so typing in the search box doesn't fire a request per key). Values come from the
 * URL, so the form follows back/forward navigation and links like /logs?userId=…
 */
export function useFilterForm<T extends FieldValues>(schema: z.ZodType<T, T>, values: T, onApply: (values: T) => void, debounceMs = 400) {
  const form = useForm<T>({ resolver: zodResolver(schema), values, mode: 'onChange' });
  const current = useWatch({ control: form.control });
  const apply = useRef(onApply);

  useEffect(() => {
    apply.current = onApply;
  }, [onApply]);

  const { handleSubmit } = form;
  useEffect(() => {
    // Same as the URL already (first render, or a reset after navigation) → nothing to apply
    if (JSON.stringify(current) === JSON.stringify(values)) return undefined;
    const timer = setTimeout(() => {
      handleSubmit((v) => apply.current(v))().catch((err: unknown) => console.error('Filter form failed', err));
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [current, values, handleSubmit, debounceMs]);

  return form;
}
