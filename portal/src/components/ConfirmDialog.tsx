import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export interface ConfirmOptions {
  title: string;
  message?: ReactNode;
  confirmLabel?: string;
  destructive?: boolean;
}

type Confirm = (options: ConfirmOptions) => Promise<boolean>;
type Request = ConfirmOptions & { resolve: (ok: boolean) => void };

const ConfirmContext = createContext<Confirm | null>(null);

/** MUI confirmation dialog (instead of the browser's confirm()). Use via `useConfirm()`. */
export function ConfirmProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [request, setRequest] = useState<Request | null>(null);

  const confirm = useCallback<Confirm>((options) => new Promise<boolean>((resolve) => setRequest({ ...options, resolve })), []);

  const close = (ok: boolean) => {
    request?.resolve(ok);
    setRequest(null);
  };

  const value = useMemo(() => confirm, [confirm]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      <Dialog open={request !== null} onClose={() => close(false)} aria-labelledby="confirm-title" maxWidth="xs" fullWidth>
        <DialogTitle id="confirm-title">{request?.title}</DialogTitle>
        {request?.message ? (
          <DialogContent>
            <DialogContentText component="div">{request.message}</DialogContentText>
          </DialogContent>
        ) : null}
        <DialogActions>
          <Button onClick={() => close(false)}>Cancel</Button>
          <Button variant="contained" color={request?.destructive ? 'error' : 'primary'} onClick={() => close(true)} autoFocus>
            {request?.confirmLabel ?? 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): Confirm {
  const confirm = useContext(ConfirmContext);
  if (!confirm) throw new Error('useConfirm must be used inside ConfirmProvider');
  return confirm;
}
