import { Stack } from 'expo-router';
import { C } from '@/theme/colors';

export const unstable_settings = { initialRouteName: 'login' };

export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.lime }, animation: 'fade' }} />;
}
