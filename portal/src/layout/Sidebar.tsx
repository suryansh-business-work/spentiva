import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { NavLink, useLocation } from 'react-router';
import { APP_VERSION } from '@/config';
import { NAV, sectionOf } from './nav';

/** Brand, section links and the portal version */
export function Sidebar({ onNavigate }: Readonly<{ onNavigate: () => void }>) {
  const { pathname } = useLocation();
  const current = sectionOf(pathname)?.path;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar>
        <Box component="img" src="/favicon.png" alt="" sx={{ width: 28, height: 28, mr: 1.5 }} />
        <Typography variant="h3" component="p">
          Spentiva
        </Typography>
      </Toolbar>
      <Box component="nav" aria-label="Portal sections" sx={{ flex: 1 }}>
        <List>
          {NAV.map((item) => (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              selected={current === item.path}
              onClick={onNavigate}
              sx={{ mx: 1, borderRadius: 2 }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ p: 2 }}>
        Portal v{APP_VERSION}
      </Typography>
    </Box>
  );
}
