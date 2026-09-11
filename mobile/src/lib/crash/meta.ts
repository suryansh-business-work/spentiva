import Constants from 'expo-constants';
import { Platform } from 'react-native';

const text = (v: unknown) => (typeof v === 'string' ? v : '');

/** "Samsung SM-S918B" on Android; iOS doesn't expose the model name, so the system name */
function deviceName(): string | null {
  const c = Platform.constants as unknown as Record<string, unknown>;
  const name = Platform.OS === 'android' ? [text(c.Manufacturer) || text(c.Brand), text(c.Model)].filter(Boolean).join(' ') : text(c.systemName);
  return name || null;
}

const build = Constants.expoConfig?.android?.versionCode ?? Constants.expoConfig?.ios?.buildNumber;

/** This build and device: attached to every crash report and sent as X-App-* headers */
export const APP_META = {
  appVersion: Constants.expoConfig?.version ?? null,
  buildNumber: build ? String(build) : null,
  platform: Platform.OS,
  osVersion: String(Platform.Version),
  device: deviceName(),
};
