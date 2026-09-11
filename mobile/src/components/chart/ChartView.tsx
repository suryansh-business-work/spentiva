import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { buildHtml } from './html';
import type { ChartSpec } from './types';

export type { ChartSpec } from './types';

/** Chart.js chart rendered in a WebView (Chart.js is bundled inline, so it works offline) */
export const ChartView = memo(function ChartView({ spec, height = 220 }: Readonly<{ spec: ChartSpec; height?: number }>) {
  const key = useMemo(() => JSON.stringify(spec), [spec]);
  const html = useMemo(() => buildHtml(JSON.parse(key) as ChartSpec), [key]);
  return (
    <View style={[styles.box, { height }]} accessibilityRole="image" accessibilityLabel={`Chart: ${spec.labels.join(', ')}`}>
      <WebView
        key={key}
        originWhitelist={['*']}
        source={{ html }}
        style={styles.web}
        containerStyle={styles.web}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
        setSupportMultipleWindows={false}
        javaScriptEnabled
        androidLayerType="hardware"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  box: { width: '100%', overflow: 'hidden' },
  web: { backgroundColor: 'transparent', flex: 1 },
});
