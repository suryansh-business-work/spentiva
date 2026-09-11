/**
 * Expo config plugin: sign Android release builds with an upload keystore when
 * ANDROID_KEYSTORE_PATH (+ password/alias env vars) is present, otherwise fall back
 * to the debug keystore so CI can always produce an installable APK.
 */
const { withAppBuildGradle } = require('expo/config-plugins');

const RELEASE_SIGNING = `
        if (System.getenv("ANDROID_KEYSTORE_PATH")) {
            release {
                storeFile file(System.getenv("ANDROID_KEYSTORE_PATH"))
                storePassword System.getenv("ANDROID_KEYSTORE_PASSWORD")
                keyAlias System.getenv("ANDROID_KEY_ALIAS")
                keyPassword System.getenv("ANDROID_KEY_PASSWORD") ?: System.getenv("ANDROID_KEYSTORE_PASSWORD")
            }
        }`;

module.exports = function withReleaseSigning(config) {
  return withAppBuildGradle(config, (cfg) => {
    if (cfg.modResults.language !== 'groovy') {
      console.warn('[withReleaseSigning] build.gradle is not Groovy, skipping');
      return cfg;
    }
    let gradle = cfg.modResults.contents;
    if (!gradle.includes('ANDROID_KEYSTORE_PATH')) {
      gradle = gradle.replace(/signingConfigs\s*\{/, (m) => `${m}${RELEASE_SIGNING}`);
      gradle = gradle.replace(
        /(buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?)signingConfig\s+signingConfigs\.debug/,
        '$1signingConfig(System.getenv("ANDROID_KEYSTORE_PATH") ? signingConfigs.release : signingConfigs.debug)',
      );
    }
    cfg.modResults.contents = gradle;
    return cfg;
  });
};
