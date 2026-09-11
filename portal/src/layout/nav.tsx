import BugReportOutlined from '@mui/icons-material/BugReportOutlined';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import PeopleOutline from '@mui/icons-material/PeopleOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import SupportAgentOutlined from '@mui/icons-material/SupportAgentOutlined';
import type { ReactNode } from 'react';

export interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
}

/** Portal sections (sidebar + page titles) */
export const NAV: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: <DashboardOutlined /> },
  { label: 'Users', path: '/users', icon: <PeopleOutline /> },
  { label: 'Logs', path: '/logs', icon: <BugReportOutlined /> },
  { label: 'Support', path: '/support', icon: <SupportAgentOutlined /> },
  { label: 'Settings', path: '/settings', icon: <SettingsOutlined /> },
];

export const sectionOf = (pathname: string) => NAV.find((n) => (n.path === '/' ? pathname === '/' : pathname.startsWith(n.path)));
