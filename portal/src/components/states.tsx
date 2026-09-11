import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import type { SxProps, Theme } from '@mui/material/styles';
import { errorMessage } from '@/lib/api';

interface ErrorAlertProps {
  error: unknown;
  onRetry?: () => void;
  sx?: SxProps<Theme>;
}

/** API / validation error with an optional retry */
export function ErrorAlert({ error, onRetry, sx }: Readonly<ErrorAlertProps>) {
  if (!error) return null;
  return (
    <Alert
      severity="error"
      sx={sx}
      action={
        onRetry ? (
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        ) : undefined
      }
    >
      {errorMessage(error)}
    </Alert>
  );
}

export function PageLoader() {
  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 240 }}>
      <CircularProgress aria-label="Loading" />
    </Box>
  );
}
