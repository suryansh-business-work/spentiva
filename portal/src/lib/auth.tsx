import { useQueryClient } from '@tanstack/react-query';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { TOKEN_KEY } from '@/config';
import type { MeFieldsFragment } from '@/gql/graphql';
import { LoginMutation, MeQuery } from '@/graphql/auth';
import { ApiError, errorMessage, gql, setAuthToken, setUnauthenticatedHandler } from './api';

export type Me = MeFieldsFragment;
type Status = 'loading' | 'signedOut' | 'signedIn';

interface AuthValue {
  status: Status;
  user: Me | null;
  /** Why the saved session could not be restored (shown on the login page) */
  restoreError: string | null;
  signIn(email: string, password: string): Promise<void>;
  signOut(): void;
  setUser(user: Me): void;
}

const ADMIN_ONLY = 'This portal is for Spentiva admins. Ask an admin to give your account access.';

const AuthContext = createContext<AuthValue | null>(null);

/** Admin session: token in localStorage, profile refreshed from the API on start */
export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const qc = useQueryClient();
  const [status, setStatus] = useState<Status>(() => (localStorage.getItem(TOKEN_KEY) ? 'loading' : 'signedOut'));
  const [user, setUser] = useState<Me | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);

  const signOut = useCallback(() => {
    setAuthToken(null);
    localStorage.removeItem(TOKEN_KEY);
    qc.clear();
    setUser(null);
    setStatus('signedOut');
  }, [qc]);

  useEffect(() => {
    setUnauthenticatedHandler(signOut);
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      setAuthToken(token);
      gql(MeQuery)
        .then(({ me }) => {
          if (me?.isAdmin) {
            setUser(me);
            setStatus('signedIn');
          } else {
            setRestoreError(ADMIN_ONLY);
            signOut();
          }
        })
        .catch((err: unknown) => {
          setRestoreError(errorMessage(err));
          signOut();
        });
    }
    return () => setUnauthenticatedHandler(null);
  }, [signOut]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { login } = await gql(LoginMutation, { input: { email, password } });
    if (!login.user.isAdmin) throw new ApiError(ADMIN_ONLY, 'FORBIDDEN');
    setAuthToken(login.token);
    localStorage.setItem(TOKEN_KEY, login.token);
    setRestoreError(null);
    setUser(login.user);
    setStatus('signedIn');
  }, []);

  const value = useMemo(() => ({ status, user, restoreError, signIn, signOut, setUser }), [status, user, restoreError, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

/** The signed-in admin (only used under the protected layout) */
export function useMe(): Me {
  const { user } = useAuth();
  if (!user) throw new Error('No signed-in admin');
  return user;
}
