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

const ConfirmContext = createContext<Confirm | null>(null);

/** In-app confirmation sheet (instead of native Alert/confirm boxes). Use via `useConfirm()`. */
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

  const value = useMemo(() => confirm, [confirm]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}
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
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): Confirm {
  const confirm = useContext(ConfirmContext);
  if (!confirm) throw new Error('useConfirm must be used inside ConfirmProvider');
  return confirm;
}
