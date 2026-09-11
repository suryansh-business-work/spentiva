import { defaultConfig, themes as v5Themes } from '@tamagui/config/v5';
import { animations } from '@tamagui/config/v5-reanimated';
import { createTamagui } from 'tamagui';
import { C } from './src/theme/colors';

const light = {
  ...v5Themes.light,
  background: C.bg,
  color: C.ink,
  borderColor: C.line,
  placeholderColor: C.faint,
};

export const config = createTamagui({
  ...defaultConfig,
  animations,
  themes: { ...v5Themes, light, dark: { ...v5Themes.dark } },
  // Allow longhand style props (backgroundColor, borderRadius…) alongside shorthands, and
  // dynamic colour strings (category colours come from the API)
  settings: { ...defaultConfig.settings, onlyAllowShorthands: false, allowedStyleValues: false },
});

export default config;
export type Conf = typeof config;

declare module 'tamagui' {
  // Tamagui's documented module augmentation (an empty interface is intentional)
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends Conf {}
}
