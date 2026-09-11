import Constants from 'expo-constants';
import { router } from 'expo-router';
import { FiCpu, FiCreditCard, FiGrid, FiLifeBuoy, FiLock, FiLogOut, FiServer, FiSliders } from 'react-icons/fi';
import { Text, XStack, YStack } from 'tamagui';
import { useConfirm } from '@/components/ConfirmDialog';
import { Card, Divider, ListRow, Muted, Screen, Tiny, Title } from '@/components/ui';
import { useCategories, useSources } from '@/hooks/queries';
import { getApiUrl } from '@/lib/api';
import { useAuth, useUser } from '@/lib/auth';
import { initials, money } from '@/lib/format';
import { runAsync } from '@/lib/log';
import type { User } from '@/lib/types';
import { C } from '@/theme/colors';

function ProfileCard({ user }: Readonly<{ user: User }>) {
  const badges = [user.currency, user.timezone, ...(user.isAdmin ? ['Admin'] : [])];
  return (
    <Card flexDirection="row" alignItems="center" gap={14}>
      <YStack width={60} height={60} borderRadius={30} backgroundColor={C.lime} alignItems="center" justifyContent="center">
        <Text fontSize={22} fontWeight="800" color={C.ink}>
          {initials(user.name)}
        </Text>
      </YStack>
      <YStack flex={1} gap={2}>
        <Text fontSize={18} fontWeight="800" color={C.ink}>
          {user.name}
        </Text>
        <Muted>{user.email}</Muted>
        <XStack gap={6} marginTop={4} flexWrap="wrap">
          {badges.map((b) => (
            <YStack key={b} backgroundColor={C.pill} borderRadius={999} paddingHorizontal={10} paddingVertical={3}>
              <Text fontSize={11} fontWeight="600" color={C.ink}>
                {b}
              </Text>
            </YStack>
          ))}
        </XStack>
      </YStack>
    </Card>
  );
}

/** Profile + settings hub */
export default function ProfileScreen() {
  const user = useUser();
  const { signOut } = useAuth();
  const confirm = useConfirm();
  const { data: categories } = useCategories();
  const { data: sources } = useSources();
  const itemCount = (categories ?? []).reduce((n, c) => n + c.items.length, 0);
  const budget = user.monthlyBudget ? ` · Budget ${money(user.monthlyBudget, user.currency, user.locale)}` : '';
  const build = Constants.expoConfig?.android?.versionCode ?? Constants.expoConfig?.ios?.buildNumber;

  const logout = runAsync('profile', async () => {
    if (await confirm({ title: 'Log out?', message: 'You can log back in any time.', confirmLabel: 'Log out', destructive: true })) await signOut();
  });

  return (
    <Screen>
      <Title>Profile</Title>
      <ProfileCard user={user} />
      <Card gap={0} paddingVertical={6}>
        <ListRow
          icon={FiSliders}
          title="Preferences"
          subtitle={`${user.currency} · ${user.timezone}${budget}`}
          onPress={() => router.push('/settings/preferences')}
        />
        <Divider />
        <ListRow
          icon={FiGrid}
          iconColor="#F2B705"
          title="Categories & Expense On"
          subtitle={categories ? `${categories.length} categories · ${itemCount} items` : 'Expense and income categories'}
          onPress={() => router.push('/settings/categories')}
        />
        <Divider />
        <ListRow
          icon={FiCreditCard}
          iconColor="#3B82F6"
          title="Expense From (payment modes)"
          subtitle={sources?.map((s) => s.name).join(', ') ?? 'Cards, UPI, cash…'}
          onPress={() => router.push('/settings/sources')}
        />
      </Card>
      {user.isAdmin ? (
        <Card gap={0} paddingVertical={6}>
          <ListRow
            icon={FiCpu}
            iconColor="#8B5CF6"
            title="Environment variables"
            subtitle="OpenAI key & model · Slack build channel"
            onPress={() => router.push('/settings/environment')}
          />
        </Card>
      ) : null}
      <Card gap={0} paddingVertical={6}>
        <ListRow
          icon={FiLifeBuoy}
          title="Help & support"
          subtitle="Report a problem or ask a question"
          onPress={() => router.push('/settings/support')}
        />
      </Card>
      <Card gap={0} paddingVertical={6}>
        <ListRow icon={FiLock} iconColor={C.sub} title="Change password" onPress={() => router.push('/settings/password')} />
        <Divider />
        <ListRow icon={FiServer} iconColor={C.sub} title="Server" subtitle={getApiUrl()} onPress={() => router.push('/server')} />
        <Divider />
        <ListRow icon={FiLogOut} iconColor={C.red} title="Log out" onPress={logout} chevron={false} />
      </Card>
      <Tiny textAlign="center">
        Spentiva v{Constants.expoConfig?.version}
        {build ? ` (${build})` : ''}
      </Tiny>
    </Screen>
  );
}
