import { zodResolver } from '@hookform/resolvers/zod';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { FormTextField } from '@/components/form';
import { useNotify } from '@/components/Notify';
import { ErrorAlert } from '@/components/states';
import { useUpdateDisplay } from '@/hooks/mutations';
import { useAuth, useMe } from '@/lib/auth';
import { displayDefaults, displaySchema, previewDate, type DisplayValues } from './display.types';

/** Time zone + locale used for every date and number in the portal (the admin's own profile) */
export function DisplayForm({ timeZones }: Readonly<{ timeZones: string[] }>) {
  const me = useMe();
  const { setUser } = useAuth();
  const notify = useNotify();
  const save = useUpdateDisplay();
  const schema = useMemo(() => displaySchema(timeZones), [timeZones]);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = useForm<DisplayValues>({ resolver: zodResolver(schema), values: displayDefaults(me), mode: 'onChange' });
  const typed = useWatch({ control });

  const submit = handleSubmit(async (v) => {
    const { updateProfile } = await save.mutateAsync({ input: { timezone: v.timezone, locale: v.locale.trim() } });
    setUser(updateProfile);
    notify.success('Display settings saved');
  });

  return (
    <Stack component="form" noValidate spacing={2} onSubmit={submit}>
      <Controller
        control={control}
        name="timezone"
        render={({ field, fieldState }) => (
          <Autocomplete
            options={timeZones}
            value={field.value || null}
            onChange={(_, v) => field.onChange(v ?? '')}
            onBlur={field.onBlur}
            renderInput={(params) => (
              <TextField
                {...params}
                inputRef={field.ref}
                label="Time zone"
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message ?? 'IANA time zone'}
              />
            )}
          />
        )}
      />
      <FormTextField control={control} name="locale" label="Locale" hint="Language + region for dates and numbers, e.g. en-IN" />
      <Typography variant="body2" color="text.secondary">
        Preview: {previewDate(typed)}
      </Typography>
      <ErrorAlert error={save.error} />
      <div>
        <Button type="submit" variant="contained" loading={isSubmitting} disabled={!isDirty}>
          Save display settings
        </Button>
      </div>
    </Stack>
  );
}
