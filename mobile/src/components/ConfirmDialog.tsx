import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { XStack } from 'tamagui';
import { AppSheet } from './AppSheet';
import { Btn, H2, Muted } from './ui';

export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  destructive?: boolean;
}

type Request = ConfirmOptions & { resolve: (ok: boolean) => void };
type Confirm = (options: ConfirmOptions) => Promise<boolean>;

interface ConfirmState {
  request: Request | null;
  close: (ok: boolean) => void;
}

const ConfirmContext = createContext<Confirm | null>(null);
const ConfirmStateContext = createContext<ConfirmState | null>(null);

/**
 * In-app confirmation (instead of native Alert/confirm boxes). Use via `useConfirm()`.
 * The provider only holds state, so it can sit above TamaguiProvider and be used inside sheets;
 * `<ConfirmHost />` draws the sheet and goes inside TamaguiProvider.
 */
export function ConfirmProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [request, setRequest] = useState<Request | null>(null);

  const confirm = useCallback<Confirm>((options) => new Promise<boolean>((resolve) => setRequest({ ...options, resolve })), []);

  const close = useCallback(
    (ok: boolean) => {
      request?.resolve(ok);
      setRequest(null);
    },
    [request],
  );

  const state = useMemo(() => ({ request, close }), [request, close]);

  return (
    <ConfirmContext.Provider value={confirm}>
      <ConfirmStateContext.Provider value={state}>{children}</ConfirmStateContext.Provider>
    </ConfirmContext.Provider>
  );
}

/** The confirmation sheet (render once, inside TamaguiProvider) */
export function ConfirmHost() {
  const state = useContext(ConfirmStateContext);
  if (!state) throw new Error('ConfirmHost must be used inside ConfirmProvider');
  const { request, close } = state;
  return (
    <AppSheet
      open={request !== null}
      onOpenChange={(open) => {
        if (!open) close(false);
      }}
    >
      <H2>{request?.title ?? ''}</H2>
      {request?.message ? <Muted>{request.message}</Muted> : null}
      <XStack gap={10} marginTop={6}>
        <Btn title="Cancel" variant="ghost" flex={1} onPress={() => close(false)} />
        <Btn title={request?.confirmLabel ?? 'Confirm'} variant={request?.destructive ? 'danger' : 'dark'} flex={1} onPress={() => close(true)} />
      </XStack>
    </AppSheet>
  );
}

export function useConfirm(): Confirm {
  const confirm = useContext(ConfirmContext);
  if (!confirm) throw new Error('useConfirm must be used inside ConfirmProvider');
  return confirm;
}
