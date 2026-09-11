import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider, YStack } from 'tamagui';
import { config } from '../../tamagui.config';
import { ConfirmHost, ConfirmProvider } from '@/components/ConfirmDialog';
import { StartupError } from '@/components/StartupError';
import { Loading } from '@/components/ui';
import { AuthProvider, useAuth } from '@/lib/auth';
import { setCurrentRoute } from '@/lib/crash';
import { logError, runAsync } from '@/lib/log';
import { TrackerProvider, useTrackers } from '@/lib/tracker';
import { C } from '@/theme/colors';

export { CrashScreen as ErrorBoundary } from '@/components/CrashScreen';

SplashScreen.preventAutoHideAsync().catch(logError('splash'));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000, refetchOnWindowFocus: false } },
});

function RootNavigator() {
  const { status, signOut } = useAuth();
  const trackers = useTrackers();
  const pathname = usePathname();
  const signedIn = status === 'signedIn';
  // Signed-in screens need the active tracker, so they wait for the tracker list
  const waiting = status === 'loading' || (signedIn && trackers.status === 'loading');

  useEffect(() => {
    if (!waiting) SplashScreen.hideAsync().catch(logError('splash'));
  }, [waiting]);

  useEffect(() => {
    setCurrentRoute(pathname);
  }, [pathname]);

  if (waiting) {
    return (
      <YStack flex={1} backgroundColor={C.bg}>
        <Loading />
      </YStack>
    );
  }
  if (signedIn && trackers.status === 'error') {
    return <StartupError error={trackers.error} onRetry={trackers.retry} onSignOut={runAsync('auth', signOut)} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.bg }, animation: 'slide_from_right' }}>
      <Stack.Protected guard={signedIn}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="transaction" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="settings" />
      </Stack.Protected>
      <Stack.Protected guard={!signedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Screen name="server" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
    </Stack>
  );
}

/**
 * App state providers (auth, tracker, confirm) sit ABOVE TamaguiProvider: bottom sheets render in
 * Tamagui's root portal host, which only sees the contexts above it. A sheet whose content used a
 * provider placed below it crashed with "useAuth must be used inside AuthProvider".
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TrackerProvider>
              <ConfirmProvider>
                <TamaguiProvider config={config} defaultTheme="light">
                  <StatusBar style="dark" />
                  <RootNavigator />
                  <ConfirmHost />
                </TamaguiProvider>
              </ConfirmProvider>
            </TrackerProvider>
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
