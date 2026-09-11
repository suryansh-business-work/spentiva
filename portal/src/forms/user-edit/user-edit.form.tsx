import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FormSelect, FormSwitch, FormTextField } from '@/components/form';
import { ErrorAlert } from '@/components/states';
import type { AdminUserFieldsFragment, RulesFieldsFragment, UserUpdateInput } from '@/gql/graphql';
import { ROLE_OPTIONS, toUserUpdate, userEditDefaults, userEditSchema, type UserEditValues } from './user-edit.types';

interface UserEditFormProps {
  user: AdminUserFieldsFragment;
  rules: RulesFieldsFragment;
  isSelf: boolean;
  onSubmit: (input: UserUpdateInput) => Promise<unknown>;
  onCancel: () => void;
  error: unknown;
}

/** Name, role and account status of a user (admin) */
export function UserEditForm({ user, rules, isSelf, onSubmit, onCancel, error }: Readonly<UserEditFormProps>) {
  const schema = useMemo(() => userEditSchema(rules, isSelf), [rules, isSelf]);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = useForm<UserEditValues>({ resolver: zodResolver(schema), defaultValues: userEditDefaults(user), mode: 'onChange' });

  return (
    <Stack component="form" noValidate spacing={2} sx={{ pt: 1 }} onSubmit={handleSubmit((v) => onSubmit(toUserUpdate(v)))}>
      <FormTextField control={control} name="name" label="Name" maxLength={rules.nameMax} autoFocus />
      <FormSelect
        control={control}
        name="role"
        label="Role"
        options={ROLE_OPTIONS}
        disabled={isSelf}
        hint={isSelf ? 'You are editing your own account' : 'Admins can open this portal and change app settings'}
      />
      <FormSwitch
        control={control}
        name="disabled"
        label="Disable account"
        disabled={isSelf}
        hint="A disabled user is signed out and can't log in to the app"
      />
      <ErrorAlert error={error} />
      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained" loading={isSubmitting} disabled={!isDirty}>
          Save changes
        </Button>
      </Stack>
    </Stack>
  );
}
