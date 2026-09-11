import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { RefreshControl, ScrollView, type ScrollViewProps } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { FiChevronLeft } from 'react-icons/fi';
import { Text, XStack, YStack, styled } from 'tamagui';
import { C } from '@/theme/colors';
import { IconButton } from './Buttons';
import { Tiny } from './Typography';

export const Card = styled(YStack, {
  backgroundColor: C.card,
  borderRadius: 24,
  padding: 16,
  gap: 12,
  borderWidth: 1,
  borderColor: '#EEF0EA',
});

export const Row = styled(XStack, { alignItems: 'center', gap: 10 });

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  bg?: string;
  edges?: Edge[];
  refreshing?: boolean;
  onRefresh?: () => void;
  scrollProps?: ScrollViewProps;
}

const CONTENT = { padding: 16, paddingBottom: 120, gap: 14 };

/** Safe-area page with optional pull-to-refresh scroll */
export function Screen({ children, scroll = true, bg = C.bg, edges = ['top'], refreshing, onRefresh, scrollProps }: Readonly<ScreenProps>) {
  const refreshControl = onRefresh ? (
    <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={C.green} colors={[C.green]} />
  ) : undefined;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={edges}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={CONTENT}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl}
          {...scrollProps}
        >
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </SafeAreaView>
  );
}

interface HeaderProps {
  title: string;
  back?: boolean;
  right?: ReactNode;
  subtitle?: string;
}

export function Header({ title, back, right, subtitle }: Readonly<HeaderProps>) {
  return (
    <XStack alignItems="center" justifyContent="space-between" minHeight={44} gap={8}>
      <XStack width={44}>{back ? <IconButton icon={FiChevronLeft} onPress={() => router.back()} plain label="Back" /> : null}</XStack>
      <YStack flex={1} alignItems="center">
        <Text fontSize={17} fontWeight="700" color={C.ink} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? <Tiny>{subtitle}</Tiny> : null}
      </YStack>
      <XStack width={44} justifyContent="flex-end">
        {right}
      </XStack>
    </XStack>
  );
}
