import type { ErrorBoundaryProps } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { reportLog } from '@/lib/crash';
import { C } from '@/theme/colors';

/**
 * Root error boundary (exported from app/_layout). A render error shows this screen instead of
 * closing the app, and is reported to the portal's Logs. Plain React Native on purpose: the
 * Tamagui / query providers live inside the layout that just failed, so they can't be used here.
 */
export function CrashScreen({ error, retry }: Readonly<ErrorBoundaryProps>) {
  useEffect(() => {
    reportLog('FATAL', error, { boundary: 'root' });
  }, [error]);

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.body}>Spentiva hit a problem and it has been reported. Your data is safe.</Text>
      <Text style={styles.detail} numberOfLines={3}>
        {error.message}
      </Text>
      <Pressable
        onPress={() => {
          retry().catch((err: unknown) => reportLog('ERROR', err, { boundary: 'retry' }));
        }}
        style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>Try again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 12 },
  title: { fontSize: 22, fontWeight: '800', color: C.ink, textAlign: 'center' },
  body: { fontSize: 15, color: C.sub, textAlign: 'center' },
  detail: { fontSize: 12, color: C.faint, textAlign: 'center' },
  button: { marginTop: 12, backgroundColor: C.ink, borderRadius: 18, paddingHorizontal: 28, paddingVertical: 14 },
  buttonText: { color: C.white, fontSize: 15, fontWeight: '700' },
});
