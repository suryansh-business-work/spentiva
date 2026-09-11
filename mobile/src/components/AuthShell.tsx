import Constants from 'expo-constants';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FiServer } from 'react-icons/fi';
import { Text, XStack, YStack } from 'tamagui';
import { getApiUrl } from '@/lib/api';
import { C } from '@/theme/colors';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { Muted, Tiny, Title } from './ui';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

function hostOf(url: string) {
  const match = /^[a-z]+:\/\/([^/]+)/i.exec(url);
  return match?.[1] ?? url;
}

function ServerLink() {
  return (
    <XStack
      justifyContent="center"
      alignItems="center"
      gap={6}
      paddingVertical={6}
      onPress={() => router.push('/server')}
      pressStyle={{ opacity: 0.6 }}
      role="button"
    >
      <Icon as={FiServer} size={13} color={C.faint} />
      <Text fontSize={12} color={C.faint}>
        Server: {hostOf(getApiUrl())}
      </Text>
    </XStack>
  );
}

/** Lime header + white card layout shared by login and signup (shows app version + server) */
export function AuthShell({ title, subtitle, children }: Readonly<AuthShellProps>) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.lime }} edges={['top']}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <YStack paddingHorizontal={24} paddingTop={32} paddingBottom={28} gap={10}>
            <Logo />
            <Title marginTop={20}>{title}</Title>
            <Muted fontSize={14}>{subtitle}</Muted>
          </YStack>
          <YStack flex={1} backgroundColor={C.white} borderTopLeftRadius={32} borderTopRightRadius={32} padding={24} gap={16}>
            {children}
            <ServerLink />
            <Tiny textAlign="center">Spentiva v{Constants.expoConfig?.version}</Tiny>
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
