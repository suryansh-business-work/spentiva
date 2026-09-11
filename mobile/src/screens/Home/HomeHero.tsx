import { router } from 'expo-router';
import { FiPlus } from 'react-icons/fi';
import { Text, XStack, YStack } from 'tamagui';
import { ChartView } from '@/components/chart/ChartView';
import { MonthPicker } from '@/components/MonthPicker';
import { IconButton, Muted } from '@/components/ui';
import { initials } from '@/lib/format';
import type { Report, User } from '@/lib/types';
import { C } from '@/theme/colors';

const LEGEND = [
  { label: 'Income', color: C.income },
  { label: 'Expense', color: C.expense },
];

function Legend() {
  return (
    <XStack gap={12} alignItems="center">
      {LEGEND.map((l) => (
        <XStack key={l.label} alignItems="center" gap={5}>
          <YStack width={7} height={7} borderRadius={4} backgroundColor={l.color} />
          <Text fontSize={12} color={C.ink}>
            {l.label}
          </Text>
        </XStack>
      ))}
    </XStack>
  );
}

function AvatarButton({ name }: Readonly<{ name: string }>) {
  return (
    <YStack
      width={44}
      height={44}
      borderRadius={22}
      backgroundColor={C.ink}
      alignItems="center"
      justifyContent="center"
      onPress={() => router.push('/profile')}
      pressStyle={{ opacity: 0.7 }}
      role="button"
      aria-label="Profile"
    >
      <Text color={C.limeStrong} fontWeight="800">
        {initials(name)}
      </Text>
    </YStack>
  );
}

interface HomeHeroProps {
  user: User;
  month: string;
  onMonthChange: (month: string) => void;
  trend?: Report;
}

/** Lime header: greeting, month picker and the weekly income/expense bars (design reference) */
export function HomeHero({ user, month, onMonthChange, trend }: Readonly<HomeHeroProps>) {
  return (
    <YStack backgroundColor={C.lime} paddingHorizontal={16} paddingTop={6} paddingBottom={72} gap={12}>
      <XStack alignItems="center" justifyContent="space-between">
        <YStack>
          <Muted>Hello,</Muted>
          <Text fontSize={20} fontWeight="800" color={C.ink}>
            {user.name.split(' ')[0]}
          </Text>
        </YStack>
        <XStack gap={8}>
          <IconButton icon={FiPlus} label="Add transaction" onPress={() => router.push('/transaction')} />
          <AvatarButton name={user.name} />
        </XStack>
      </XStack>
      <XStack alignItems="center" justifyContent="space-between">
        <MonthPicker compact value={month} onChange={onMonthChange} settings={user} bg="transparent" />
        <Legend />
      </XStack>
      {trend ? (
        <ChartView
          height={200}
          spec={{
            type: 'bar',
            labels: trend.labels,
            datasets: trend.datasets,
            currency: trend.currency,
            locale: user.locale,
            overlap: true,
            textColor: '#3E4A2C',
            gridColor: 'rgba(21,21,21,0.08)',
          }}
        />
      ) : (
        <YStack height={200} />
      )}
    </YStack>
  );
}
