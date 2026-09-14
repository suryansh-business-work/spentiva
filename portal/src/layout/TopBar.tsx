import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useLocation } from 'react-router';
import { useAuth, useMe } from '@/lib/auth';
import { initials } from '@/lib/format';
import { sectionOf } from './nav';

interface TopBarProps {
  drawerWidth: number;
  onMenu: () => void;
}

export function TopBar({ drawerWidth, onMenu }: Readonly<TopBarProps>) {
  const me = useMe();
  const { signOut } = useAuth();
  const { pathname } = useLocation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{ width: { md: `calc(100% - ${drawerWidth}px)` }, ml: { md: `${drawerWidth}px` }, borderBottom: 1, borderColor: 'divider' }}
    >
      <Toolbar>
        <IconButton edge="start" onClick={onMenu} aria-label="Open navigation" sx={{ mr: 1, display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h3" component="p" sx={{ flex: 1 }}>
          {sectionOf(pathname)?.label ?? 'Spentiva'}
        </Typography>
        <IconButton onClick={(e) => setAnchor(e.currentTarget)} aria-label="Account menu" aria-haspopup="menu">
          <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: 14 }}>{initials(me.name)}</Avatar>
        </IconButton>
        <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
          <MenuItem disabled>
            <div>
              <Typography variant="body2">{me.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {me.email}
              </Typography>
            </div>
          </MenuItem>
          <Divider />
          <MenuItem onClick={signOut}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Sign out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
