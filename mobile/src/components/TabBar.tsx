import * as Haptics from 'expo-haptics';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';
import type { IconType } from 'react-icons';
import { FiBarChart2, FiCreditCard, FiHome, FiMessageCircle, FiPieChart, FiUser } from 'react-icons/fi';
import { Text, XStack, YStack } from 'tamagui';
import { logError } from '@/lib/log';
import { C } from '@/theme/colors';
import { Icon } from './Icon';

const TAB_ICONS: Record<string, IconType> = {
  index: FiHome,
  budget: FiPieChart,
  reports: FiBarChart2,
  chat: FiMessageCircle,
  spending: FiCreditCard,
  profile: FiUser,
};

const SHOW_EVENT = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
const HIDE_EVENT = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

function useKeyboardVisible() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const show = Keyboard.addListener(SHOW_EVENT, () => setVisible(true));
    const hide = Keyboard.addListener(HIDE_EVENT, () => setVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return visible;
}

interface TabItemProps {
  name: string;
  label: string;
  focused: boolean;
  onPress: () => void;
}

function TabItem({ name, label, focused, onPress }: Readonly<TabItemProps>) {
  const color = focused ? C.ink : C.faint;
  return (
    <YStack
      flex={1}
      alignItems="center"
      gap={4}
      paddingVertical={4}
      onPress={onPress}
      pressStyle={{ opacity: 0.6 }}
      role="tab"
      aria-selected={focused}
      aria-label={label}
    >
      <Icon as={TAB_ICONS[name] ?? FiHome} size={22} color={color} strokeWidth={focused ? 2.3 : 1.8} />
      <Text fontSize={11} fontWeight={focused ? '700' : '500'} color={color}>
        {label}
      </Text>
    </YStack>
  );
}

/** Bottom tab bar styled like the reference design (icon + label, ink when active) */
export function TabBar({ state, descriptors, navigation, insets }: Readonly<BottomTabBarProps>) {
  const keyboard = useKeyboardVisible();
  if (keyboard) return null;
  return (
    <XStack
      backgroundColor={C.white}
      borderTopWidth={1}
      borderColor={C.line}
      paddingTop={8}
      paddingBottom={Math.max(insets.bottom, 10)}
      paddingHorizontal={6}
      role="tablist"
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const title = descriptors[route.key]?.options.title;
        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (focused || event.defaultPrevented) return;
          Haptics.selectionAsync().catch(logError('haptics'));
          navigation.navigate(route.name, route.params);
        };
        return <TabItem key={route.key} name={route.name} label={title ?? route.name} focused={focused} onPress={onPress} />;
      })}
    </XStack>
  );
}
