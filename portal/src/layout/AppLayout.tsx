import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import { Suspense, useState } from 'react';
import { Outlet } from 'react-router';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PageLoader } from '@/components/states';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

const DRAWER_WIDTH = 240;

/** Responsive shell: permanent sidebar on desktop, slide-in drawer on phones */
export function AppLayout() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
      <TopBar drawerWidth={DRAWER_WIDTH} onMenu={() => setOpen(true)} />
      <Box component="aside" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={open}
          onClose={close}
          sx={{ display: { xs: 'block', md: 'none' } }}
          slotProps={{ paper: { sx: { width: DRAWER_WIDTH } } }}
        >
          <Sidebar onNavigate={close} />
        </Drawer>
        <Drawer variant="permanent" open sx={{ display: { xs: 'none', md: 'block' } }} slotProps={{ paper: { sx: { width: DRAWER_WIDTH } } }}>
          <Sidebar onNavigate={close} />
        </Drawer>
      </Box>
      <Box component="main" sx={{ flex: 1, minWidth: 0, p: { xs: 2, md: 3 } }}>
        <Toolbar />
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </Box>
    </Box>
  );
}
