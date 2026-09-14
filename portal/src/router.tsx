import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';
import { AppLayout } from './layout/AppLayout';
import { RequireAdmin } from './layout/RequireAdmin';
import LoginPage from './pages/Login';

// Each section is its own chunk, loaded when first opened
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Users = lazy(() => import('./pages/Users'));
const UserDetail = lazy(() => import('./pages/UserDetail'));
const Logs = lazy(() => import('./pages/Logs'));
const Support = lazy(() => import('./pages/Support'));
const Ticket = lazy(() => import('./pages/Ticket'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: (
      <RequireAdmin>
        <AppLayout />
      </RequireAdmin>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'users', element: <Users /> },
      { path: 'users/:id', element: <UserDetail /> },
      { path: 'logs', element: <Logs /> },
      { path: 'support', element: <Support /> },
      { path: 'support/:id', element: <Ticket /> },
      { path: 'settings', element: <Settings /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
