import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { PageLoader } from '@/components/states';
import { useAuth } from '@/lib/auth';

/** Only signed-in admins get past this; everyone else lands on /login (and comes back afterwards) */
export function RequireAdmin({ children }: Readonly<{ children: ReactNode }>) {
  const { status } = useAuth();
  const location = useLocation();
  if (status === 'loading') return <PageLoader />;
  if (status === 'signedOut') return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
  return children;
}
