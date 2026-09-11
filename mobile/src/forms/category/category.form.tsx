import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { YStack } from 'tamagui';
import { TextField } from '@/components/form';
import { Btn, ErrorText, type ButtonVariant } from '@/components/ui';
import { runAsync } from '@/lib/log';
import { categoryDefaults, categorySchema, type CategoryValues } from './category.types';

interface CategoryFormProps {
  name?: string;
  placeholder?: string;
  submitLabel: string;
  variant?: ButtonVariant;
  pending: boolean;
  error: unknown;
  onSubmit: (name: string) => Promise<unknown>;
}

/** Category name (used to create a category and to rename one) */
export function CategoryForm({ name, placeholder, submitLabel, variant = 'dark', pending, error, onSubmit }: Readonly<CategoryFormProps>) {
  const { control, handleSubmit, reset } = useForm<CategoryValues>({ resolver: zodResolver(categorySchema), values: categoryDefaults(name) });

  const submit = runAsync(
    'category',
    handleSubmit(async (v) => {
      await onSubmit(v.name.trim());
      if (!name) reset(categoryDefaults());
    }),
  );

  return (
    <YStack gap={12}>
      <TextField
        control={control}
        name="name"
        label="Name"
        placeholder={placeholder}
        autoCapitalize="words"
        onSubmitEditing={submit}
        hint="Up to 60 characters"
      />
      <ErrorText error={error} />
      <Btn title={submitLabel} variant={variant} onPress={submit} loading={pending} height={48} />
    </YStack>
  );
}
