import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <Stack spacing={2} sx={{ alignItems: 'flex-start', py: 6 }}>
      <Typography variant="h1">Page not found</Typography>
      <Typography color="text.secondary">This page doesn’t exist in the portal.</Typography>
      <Button component={Link} to="/" variant="contained">
        Go to the dashboard
      </Button>
    </Stack>
  );
}
