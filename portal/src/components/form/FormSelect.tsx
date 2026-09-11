import MenuItem from '@mui/material/MenuItem';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import type { Option } from '@/lib/labels';

type FormSelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: Option[];
  hint?: string;
  multiple?: boolean;
  /** Adds a first option with an empty value, e.g. "All" */
  emptyLabel?: string;
} & Omit<TextFieldProps, 'name' | 'value' | 'onChange' | 'onBlur' | 'error' | 'helperText' | 'label' | 'select' | 'slotProps'>;

const asArray = (v: unknown): string[] => {
  if (Array.isArray(v)) return v.map(String);
  return typeof v === 'string' && v ? v.split(',') : [];
};

/** react-hook-form bound MUI select (single or multiple) */
export function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  options,
  hint,
  multiple = false,
  emptyLabel,
  ...rest
}: Readonly<FormSelectProps<T>>) {
  const labelOf = (value: string) => options.find((o) => o.value === value)?.label ?? value;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <TextField
          {...rest}
          select
          name={field.name}
          label={label}
          value={multiple ? asArray(field.value) : (field.value ?? '')}
          onChange={(e) => field.onChange(multiple ? asArray(e.target.value) : e.target.value)}
          onBlur={field.onBlur}
          inputRef={field.ref}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message ?? hint}
          slotProps={{
            select: {
              multiple,
              displayEmpty: Boolean(emptyLabel),
              renderValue: multiple ? (selected) => asArray(selected).map(labelOf).join(', ') || emptyLabel : undefined,
            },
            inputLabel: emptyLabel ? { shrink: true } : undefined,
          }}
        >
          {emptyLabel && !multiple ? <MenuItem value="">{emptyLabel}</MenuItem> : null}
          {options.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}
