import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Switch from '@mui/material/Switch';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

interface FormSwitchProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  hint?: string;
  disabled?: boolean;
}

/** react-hook-form bound MUI switch */
export function FormSwitch<T extends FieldValues>({ control, name, label, hint, disabled }: Readonly<FormSwitchProps<T>>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div>
          <FormControlLabel
            label={label}
            disabled={disabled}
            control={<Switch checked={Boolean(field.value)} onChange={(e) => field.onChange(e.target.checked)} onBlur={field.onBlur} />}
          />
          <FormHelperText error={Boolean(fieldState.error)}>{fieldState.error?.message ?? hint}</FormHelperText>
        </div>
      )}
    />
  );
}
