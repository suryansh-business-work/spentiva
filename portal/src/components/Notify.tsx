import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { errorMessage } from '@/lib/api';

type Severity = 'success' | 'error' | 'info';
interface Toast {
  id: number;
  severity: Severity;
  message: string;
}

interface Notify {
  success(message: string): void;
  error(err: unknown): void;
  info(message: string): void;
}

const NotifyContext = createContext<Notify | null>(null);

/** Snackbar feedback for actions (saved, deleted, failed…). Use via `useNotify()`. */
export function NotifyProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [toast, setToast] = useState<Toast | null>(null);

  const show = useCallback((severity: Severity, message: string) => setToast({ id: Date.now(), severity, message }), []);

  const value = useMemo<Notify>(
    () => ({
      success: (m) => show('success', m),
      error: (err) => show('error', errorMessage(err)),
      info: (m) => show('info', m),
    }),
    [show],
  );

  return (
    <NotifyContext.Provider value={value}>
      {children}
      <Snackbar
        key={toast?.id}
        open={toast !== null}
        autoHideDuration={toast?.severity === 'error' ? 8000 : 4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toast?.severity ?? 'info'} variant="filled" onClose={() => setToast(null)} sx={{ width: '100%' }}>
          {toast?.message}
        </Alert>
      </Snackbar>
    </NotifyContext.Provider>
  );
}

export function useNotify(): Notify {
  const notify = useContext(NotifyContext);
  if (!notify) throw new Error('useNotify must be used inside NotifyProvider');
  return notify;
}
