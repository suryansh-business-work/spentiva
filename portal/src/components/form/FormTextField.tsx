import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import { useState } from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

type FormTextFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  hint?: string;
  /** Shows a live "12 / 120" counter (the limit itself is enforced by the zod schema) */
  maxLength?: number;
} & Omit<TextFieldProps, 'name' | 'value' | 'onChange' | 'onBlur' | 'error' | 'helperText' | 'label' | 'slotProps'>;

function RevealButton({ shown, onToggle }: Readonly<{ shown: boolean; onToggle: () => void }>) {
  return (
    <InputAdornment position="end">
      <IconButton aria-label={shown ? 'Hide password' : 'Show password'} onClick={onToggle} edge="end" size="small">
        {shown ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
      </IconButton>
    </InputAdornment>
  );
}

/** react-hook-form bound MUI text field: label, hint, validation message, optional counter + password reveal */
export function FormTextField<T extends FieldValues>({ control, name, label, hint, maxLength, type, ...rest }: Readonly<FormTextFieldProps<T>>) {
  const [shown, setShown] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && shown ? 'text' : type;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const length = typeof field.value === 'string' ? field.value.length : 0;
        const message = fieldState.error?.message ?? hint;
        return (
          <TextField
            {...rest}
            name={field.name}
            value={field.value ?? ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            inputRef={field.ref}
            label={label}
            type={inputType}
            error={Boolean(fieldState.error)}
            helperText={
              <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                <span>{message}</span>
                {maxLength ? <span>{`${length} / ${maxLength}`}</span> : null}
              </Box>
            }
            slotProps={{ input: isPassword ? { endAdornment: <RevealButton shown={shown} onToggle={() => setShown((s) => !s)} /> } : undefined }}
          />
        );
      }}
    />
  );
}
