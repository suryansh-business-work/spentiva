import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { YStack } from 'tamagui';
import { TextField } from '@/components/form';
import { Btn, Card, ErrorText, Muted, Success } from '@/components/ui';
import { DEFAULT_API_URL, getApiUrl, saveApiUrl } from '@/lib/api';
import { runAsync } from '@/lib/log';
import { serverSchema, type ServerValues } from './server.types';

async function ping(url: string): Promise<void> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: '{ __typename }' }),
  });
  if (!res.ok) throw new Error(`Server answered ${res.status}`);
}

/** Point the app at another Spentiva API (e.g. staging or a local dev server) */
export function ServerForm({ onDone }: Readonly<{ onDone: () => void }>) {
  const qc = useQueryClient();
  const [status, setStatus] = useState<{ ok: boolean; error: unknown }>({ ok: false, error: null });
  const { control, handleSubmit, reset } = useForm<ServerValues>({ resolver: zodResolver(serverSchema), defaultValues: { url: getApiUrl() } });

  const test = runAsync(
    'server',
    handleSubmit(async ({ url }) => {
      try {
        await ping(url);
        setStatus({ ok: true, error: null });
      } catch {
        setStatus({ ok: false, error: new Error('Could not reach this server') });
      }
    }),
  );

  const save = runAsync(
    'server',
    handleSubmit(async ({ url }) => {
      await saveApiUrl(url);
      qc.clear();
      onDone();
    }),
  );

  const useBuiltIn = runAsync('server', async () => {
    await saveApiUrl(null);
    reset({ url: DEFAULT_API_URL });
    qc.clear();
  });

  return (
    <YStack gap={14}>
      <Card>
        <TextField control={control} name="url" label="GraphQL endpoint" autoCapitalize="none" autoCorrect={false} keyboardType="url" />
        <Muted fontSize={12}>Built-in: {DEFAULT_API_URL}</Muted>
        {status.ok ? <Success>Server reachable</Success> : <ErrorText error={status.error} />}
      </Card>
      <Btn title="Test connection" variant="ghost" onPress={test} />
      <Btn title="Save" onPress={save} />
      <Btn title="Use built-in server" variant="lime" onPress={useBuiltIn} />
    </YStack>
  );
}
