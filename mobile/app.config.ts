import type { ExpoConfig } from 'expo/config';
import pkg from './package.json';

/**
 * Version is driven by package.json (bumped by CI with semantic versioning).
 * CI can override with APP_VERSION / APP_VERSION_CODE.
 */
const version = process.env.APP_VERSION ?? pkg.version;

/** 1.2.3 → 1002003 (monotonic as long as minor/patch stay < 1000) */
function toVersionCode(v: string): number {
  const [major = 0, minor = 0, patch = 0] = (v.split('-')[0] ?? v).split('.').map((n) => Number.parseInt(n, 10) || 0);
  return major * 1_000_000 + minor * 1_000 + patch;
}

/** GraphQL endpoint baked into the build (GitHub secret API_URL → EXPO_PUBLIC_API_URL) */
const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? 'https://spentiva.exyconn.com/graphql';
const versionCode = Number(process.env.APP_VERSION_CODE) || toVersionCode(version);

const config: ExpoConfig = {
  name: 'Spentiva',
  slug: 'spentiva',
  version,
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'spentiva',
  userInterfaceStyle: 'light',
  backgroundColor: '#F4F5F1',
  ios: {
    bundleIdentifier: process.env.IOS_BUNDLE_ID || 'com.spentiva.app',
    buildNumber: String(versionCode),
    supportsTablet: false,
    infoPlist: { ITSAppUsesNonExemptEncryption: false },
  },
  android: {
    package: process.env.ANDROID_PACKAGE || 'com.spentiva.app',
    versionCode,
    adaptiveIcon: {
      backgroundColor: '#151515',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    softwareKeyboardLayoutMode: 'resize',
    predictiveBackGestureEnabled: false,
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    'expo-localization',
    ['expo-splash-screen', { backgroundColor: '#DDF5B3', image: './assets/images/splash-icon.png', imageWidth: 110 }],
    [
      'expo-build-properties',
      {
        android: {
          enableMinifyInReleaseBuilds: true,
          enableShrinkResourcesInReleaseBuilds: true,
          // Real devices only → smaller APK (keeps it well under GitHub's 100 MB file limit)
          buildArchs: ['armeabi-v7a', 'arm64-v8a'],
        },
      },
    ],
    './plugins/withReleaseSigning',
  ],
  extra: { apiUrl },
};

export default config;
