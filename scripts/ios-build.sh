#!/usr/bin/env bash
# Builds an iOS .ipa from the Expo prebuild output (run on a macOS runner from mobile/).
#
#   scripts/ios-build.sh <output.ipa>
#
# Without signing secrets → unsigned IPA (Payload/*.app zipped) that can be re-signed later
# (AltStore / Sideloadly / fastlane resign).
# With IOS_P12_BASE64 + IOS_P12_PASSWORD + IOS_PROVISION_PROFILE_BASE64 → the app is signed
# with that certificate/profile (ad-hoc or App Store, depending on the profile).
set -euo pipefail

OUT="${1:?usage: ios-build.sh <output.ipa>}"
WORKSPACE="$(ls -d ios/*.xcworkspace | head -n1)"
SCHEME="$(basename "$WORKSPACE" .xcworkspace)"
BUILD_DIR="$(pwd)/build-ios"
ARCHIVE="$BUILD_DIR/$SCHEME.xcarchive"
mkdir -p "$BUILD_DIR"

echo "Archiving $SCHEME from $WORKSPACE"
set -o pipefail
xcodebuild \
  -workspace "$WORKSPACE" \
  -scheme "$SCHEME" \
  -configuration Release \
  -sdk iphoneos \
  -destination 'generic/platform=iOS' \
  -archivePath "$ARCHIVE" \
  CODE_SIGNING_ALLOWED=NO CODE_SIGNING_REQUIRED=NO CODE_SIGN_IDENTITY="" \
  archive | tee "$BUILD_DIR/xcodebuild.log" | grep -E "error:|warning: .*deprecated|\*\* ARCHIVE" || true

APP="$(ls -d "$ARCHIVE"/Products/Applications/*.app | head -n1)"
[ -d "$APP" ] || { echo "Archive failed – see xcodebuild.log"; tail -n 80 "$BUILD_DIR/xcodebuild.log"; exit 1; }

PAYLOAD="$BUILD_DIR/Payload"
rm -rf "$PAYLOAD" && mkdir -p "$PAYLOAD"
cp -R "$APP" "$PAYLOAD/"
APP_IN_PAYLOAD="$PAYLOAD/$(basename "$APP")"

if [ -n "${IOS_P12_BASE64:-}" ] && [ -n "${IOS_PROVISION_PROFILE_BASE64:-}" ]; then
  echo "Signing with the provided certificate and provisioning profile"
  KEYCHAIN="$RUNNER_TEMP/signing.keychain-db"
  KEYCHAIN_PASSWORD="$(openssl rand -hex 16)"
  echo "$IOS_P12_BASE64" | base64 --decode > "$RUNNER_TEMP/cert.p12"
  echo "$IOS_PROVISION_PROFILE_BASE64" | base64 --decode > "$RUNNER_TEMP/profile.mobileprovision"

  security create-keychain -p "$KEYCHAIN_PASSWORD" "$KEYCHAIN"
  security set-keychain-settings -lut 21600 "$KEYCHAIN"
  security unlock-keychain -p "$KEYCHAIN_PASSWORD" "$KEYCHAIN"
  security import "$RUNNER_TEMP/cert.p12" -P "${IOS_P12_PASSWORD:-}" -A -t cert -f pkcs12 -k "$KEYCHAIN"
  security set-key-partition-list -S apple-tool:,apple: -k "$KEYCHAIN_PASSWORD" "$KEYCHAIN" >/dev/null
  security list-keychains -d user -s "$KEYCHAIN" $(security list-keychains -d user | tr -d '"')

  IDENTITY="$(security find-identity -v -p codesigning "$KEYCHAIN" | head -n1 | awk -F'"' '{print $2}')"
  [ -n "$IDENTITY" ] || { echo "No signing identity found in the .p12"; exit 1; }

  security cms -D -i "$RUNNER_TEMP/profile.mobileprovision" > "$RUNNER_TEMP/profile.plist"
  /usr/libexec/PlistBuddy -x -c 'Print :Entitlements' "$RUNNER_TEMP/profile.plist" > "$RUNNER_TEMP/entitlements.plist"
  cp "$RUNNER_TEMP/profile.mobileprovision" "$APP_IN_PAYLOAD/embedded.mobileprovision"

  # Frameworks/dylibs first (no entitlements), then the app itself
  if [ -d "$APP_IN_PAYLOAD/Frameworks" ]; then
    find "$APP_IN_PAYLOAD/Frameworks" -maxdepth 1 \( -name "*.framework" -o -name "*.dylib" \) -print0 |
      xargs -0 -I{} codesign --force --timestamp=none --sign "$IDENTITY" "{}"
  fi
  codesign --force --timestamp=none --sign "$IDENTITY" --entitlements "$RUNNER_TEMP/entitlements.plist" "$APP_IN_PAYLOAD"
  codesign --verify --deep --strict "$APP_IN_PAYLOAD"
  echo "Signed with: $IDENTITY"
else
  echo "No iOS signing secrets – producing an unsigned IPA"
fi

(cd "$BUILD_DIR" && rm -f app.ipa && zip -qry app.ipa Payload)
mv "$BUILD_DIR/app.ipa" "$OUT"
ls -lh "$OUT"
