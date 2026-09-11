import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Navigate, useLocation } from 'react-router';
import { PageLoader } from '@/components/states';
import { APP_VERSION } from '@/config';
import { LoginForm } from '@/forms/login';
import { useAuth } from '@/lib/auth';

const fromState = (state: unknown): string => {
  const from = (state as { from?: unknown } | null)?.from;
  return typeof from === 'string' && from.startsWith('/') ? from : '/';
};

export default function LoginPage() {
  const { status, restoreError } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <PageLoader />;
  if (status === 'signedIn') return <Navigate to={fromState(location.state)} replace />;

  return (
    <Box component="main" sx={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', p: 2 }}>
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack spacing={3}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <Box component="img" src="/favicon.png" alt="" sx={{ width: 40, height: 40 }} />
              <div>
                <Typography variant="h1">Spentiva Portal</Typography>
                <Typography color="text.secondary">Users, crash logs and support</Typography>
              </div>
            </Stack>
            {restoreError ? <Alert severity="warning">{restoreError}</Alert> : null}
            <LoginForm />
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
              Admin accounts only · v{APP_VERSION}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
