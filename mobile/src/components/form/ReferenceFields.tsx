import { useMemo } from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { useReference } from '@/hooks/queries';
import { deviceDefaults } from '@/lib/device';
import { SelectField } from './SelectField';

interface ReferenceFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  hint?: string;
}

/** ISO 4217 currency picker (list served by the API) */
export function CurrencyField<T extends FieldValues>({ control, name, label, hint }: Readonly<ReferenceFieldProps<T>>) {
  const { data } = useReference();
  const items = useMemo(() => (data?.currencies ?? []).map((c) => ({ value: c.code, label: `${c.code} · ${c.name}` })), [data]);
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <SelectField
          label={label}
          title="Currency (ISO 4217)"
          value={field.value}
          placeholder="Select currency"
          items={items}
          onChange={field.onChange}
          error={fieldState.error?.message}
          hint={hint}
          searchable
        />
      )}
    />
  );
}

/** IANA time-zone picker (list served by the API, device zone first) */
export function TimezoneField<T extends FieldValues>({ control, name, label, hint }: Readonly<ReferenceFieldProps<T>>) {
  const { data } = useReference();
  const items = useMemo(() => {
    const device = deviceDefaults().timezone;
    const zones = [device, ...(data?.timeZones ?? []).filter((z) => z !== device)];
    return zones.map((z) => ({ value: z, label: z.replaceAll('_', ' '), subtitle: z === device ? 'Device time zone' : undefined }));
  }, [data]);
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <SelectField
          label={label}
          title="Time zone (IANA)"
          value={field.value}
          display={typeof field.value === 'string' ? field.value.replaceAll('_', ' ') : null}
          placeholder="Select time zone"
          items={items}
          onChange={field.onChange}
          error={fieldState.error?.message}
          hint={hint}
          searchable
        />
      )}
    />
  );
}
