import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

interface FormDateFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  hint?: string;
  disableFuture?: boolean;
}

/** react-hook-form bound MUI X date picker (clearable) */
export function FormDateField<T extends FieldValues>({ control, name, label, hint, disableFuture }: Readonly<FormDateFieldProps<T>>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <DatePicker
          label={label}
          value={field.value ?? null}
          onChange={(value) => field.onChange(value)}
          inputRef={field.ref}
          disableFuture={disableFuture}
          slotProps={{
            textField: {
              size: 'small',
              fullWidth: true,
              onBlur: field.onBlur,
              error: Boolean(fieldState.error),
              helperText: fieldState.error?.message ?? hint,
            },
            field: { clearable: true },
          }}
        />
      )}
    />
  );
}
