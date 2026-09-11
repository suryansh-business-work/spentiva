import { router } from 'expo-router';
import { FiX } from 'react-icons/fi';
import { Header, IconButton, Screen } from '@/components/ui';
import { PasswordForm } from '@/forms/password';
import { PreferencesForm } from '@/forms/preferences';
import { ServerForm } from '@/forms/server';
import { useUser } from '@/lib/auth';

export function PreferencesScreen() {
  const user = useUser();
  return (
    <Screen>
      <Header title="Preferences" back />
      <PreferencesForm user={user} onDone={() => router.back()} />
    </Screen>
  );
}

export function PasswordScreen() {
  return (
    <Screen>
      <Header title="Change password" back />
      <PasswordForm onDone={() => router.back()} />
    </Screen>
  );
}

/** Point the app at another Spentiva API (reachable from login too) */
export function ServerScreen() {
  return (
    <Screen edges={['top', 'bottom']}>
      <Header title="Server" right={<IconButton icon={FiX} plain onPress={() => router.back()} label="Close" />} />
      <ServerForm onDone={() => router.back()} />
    </Screen>
  );
}
