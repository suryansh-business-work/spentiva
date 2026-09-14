import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { reportError } from '@/lib/errorReporter';

interface State {
  error: Error | null;
}

/** Catches render crashes, reports them to Logs (source PORTAL, level Crash) and offers a reload */
export class ErrorBoundary extends Component<Readonly<{ children: ReactNode }>, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    error.stack = `${error.stack ?? ''}\n\nComponent stack:${info.componentStack ?? ''}`;
    reportError(error, 'ErrorBoundary', 'FATAL');
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <Box sx={{ p: 3, maxWidth: 640, mx: 'auto' }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" onClick={() => globalThis.location.reload()}>
              Reload
            </Button>
          }
        >
          <AlertTitle>Something went wrong</AlertTitle>
          {this.state.error.message} — it has been reported to the Logs.
        </Alert>
      </Box>
    );
  }
}
