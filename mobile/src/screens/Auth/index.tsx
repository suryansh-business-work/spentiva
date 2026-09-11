import { router } from 'expo-router';
import { Text, XStack } from 'tamagui';
import { AuthShell } from '@/components/AuthShell';
import { H2, Muted } from '@/components/ui';
import { LoginForm } from '@/forms/login';
import { SignupForm } from '@/forms/signup';
import { C } from '@/theme/colors';

function SwitchLink({ question, action, href }: Readonly<{ question: string; action: string; href: '/login' | '/signup' }>) {
  return (
    <XStack justifyContent="center" gap={6}>
      <Muted>{question}</Muted>
      <Text fontSize={13} fontWeight="700" color={C.green} onPress={() => router.replace(href)} role="link">
        {action}
      </Text>
    </XStack>
  );
}

export function LoginScreen() {
  return (
    <AuthShell title="Track money by just chatting." subtitle="“spent 250 on lunch” — logged. Ask for charts, averages and top spends any time.">
      <H2>Welcome back</H2>
      <LoginForm />
      <SwitchLink question="New to Spentiva?" action="Create an account" href="/signup" />
    </AuthShell>
  );
}

export function SignupScreen() {
  return (
    <AuthShell title="Your money, one message away." subtitle="Create an account — categories and payment modes are set up for you.">
      <H2>Create account</H2>
      <SignupForm />
      <SwitchLink question="Already have an account?" action="Log in" href="/login" />
    </AuthShell>
  );
}
