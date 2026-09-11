import { useQueryClient } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { SignupInput } from '@/gql/graphql';
import { MeQuery } from '@/graphql/queries';
import { LoginMutation, SignupMutation } from '@/graphql/mutations';
import { gql, loadApiUrl, setAuthToken, setUnauthenticatedHandler } from './api';
import { logError } from './log';
import type { User } from './types';

const TOKEN_KEY = 'spentiva.token';
const USER_KEY = 'spentiva.user';

type Status = 'loading' | 'signedOut' | 'signedIn';

interface AuthContextValue {
  status: Status;
  user: User | null;
  signIn(email: string, password: string): Promise<void>;
  signUp(input: SignupInput): Promise<void>;
  signOut(): Promise<void>;
  setUser(user: User): void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Session = token + profile in SecureStore; the profile is refreshed from the API on start */
export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const qc = useQueryClient();
  const [status, setStatus] = useState<Status>('loading');
  const [user, setUser] = useState<User | null>(null);

  const saveUser = useCallback((u: User) => {
    setUser(u);
    SecureStore.setItemAsync(USER_KEY, JSON.stringify(u)).catch(logError('auth'));
  }, []);

  const signOut = useCallback(async () => {
    setAuthToken(null);
    await Promise.all([SecureStore.deleteItemAsync(TOKEN_KEY), SecureStore.deleteItemAsync(USER_KEY)]);
    qc.clear();
    setUser(null);
    setStatus('signedOut');
  }, [qc]);

  useEffect(() => {
    setUnauthenticatedHandler(() => {
      signOut().catch(logError('auth'));
    });
    const restore = async () => {
      await loadApiUrl();
      const [token, stored] = await Promise.all([SecureStore.getItemAsync(TOKEN_KEY), SecureStore.getItemAsync(USER_KEY)]);
      if (!token || !stored) {
        setStatus('signedOut');
        return;
      }
      setAuthToken(token);
      setUser(JSON.parse(stored) as User);
      setStatus('signedIn');
      const { me } = await gql(MeQuery);
      if (me) saveUser(me);
      else await signOut();
    };
    restore().catch(logError('auth'));
    return () => setUnauthenticatedHandler(null);
  }, [saveUser, signOut]);

  const finish = useCallback(
    async (token: string, u: User) => {
      setAuthToken(token);
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      saveUser(u);
      setStatus('signedIn');
    },
    [saveUser],
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { login } = await gql(LoginMutation, { input: { email, password } });
      await finish(login.token, login.user);
    },
    [finish],
  );

  const signUp = useCallback(
    async (input: SignupInput) => {
      const { signup } = await gql(SignupMutation, { input });
      await finish(signup.token, signup.user);
    },
    [finish],
  );

  const value = useMemo(() => ({ status, user, signIn, signUp, signOut, setUser: saveUser }), [status, user, signIn, signUp, signOut, saveUser]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

/** The signed-in user (screens under (tabs) only render when signed in) */
export function useUser(): User {
  const { user } = useAuth();
  if (!user) throw new Error('No signed-in user');
  return user;
}
