#!/usr/bin/env bash
# Installs the release APK on the running emulator, opens it and records whether it stays up.
# Writes install.txt, logcat.txt, crash.txt and screen.png to launch-check/ (uploaded by CI).
#
#   bash scripts/android-launch-check.sh <dir-with-apk> [package]
set -uo pipefail

APK=$(find "$1" -name '*.apk' | head -n 1)
PKG="${2:-com.spentiva.app}"
OUT=launch-check
mkdir -p "$OUT"

adb logcat -c
if ! adb install -r "$APK" >"$OUT/install.txt" 2>&1; then
  cat "$OUT/install.txt"
  echo "::error::APK install failed"
  exit 1
fi

adb shell monkey -p "$PKG" -c android.intent.category.LAUNCHER 1 >/dev/null
sleep 30

PID=$(adb shell pidof "$PKG" | tr -d '\r')
adb logcat -d >"$OUT/logcat.txt"
adb logcat -d -b crash >"$OUT/crash.txt"
adb exec-out screencap -p >"$OUT/screen.png"

{
  echo "## Android launch check"
  if [ -n "$PID" ]; then echo "✅ Spentiva is running 30 s after launch (pid $PID)"; else echo "❌ Spentiva is not running 30 s after launch"; fi
  echo '```'
  grep -E "FATAL|AndroidRuntime|ReactNativeJS|Fatal signal|Exception" "$OUT/logcat.txt" | head -n 80
  echo '```'
} >>"${GITHUB_STEP_SUMMARY:-/dev/stdout}"

if [ -z "$PID" ]; then
  echo "----- crash buffer -----"
  cat "$OUT/crash.txt"
  echo "----- app log -----"
  grep -E "AndroidRuntime|ReactNativeJS|ReactNative|Expo|$PKG|DEBUG" "$OUT/logcat.txt" | tail -n 200
  exit 1
fi
echo "App is running (pid $PID)"
