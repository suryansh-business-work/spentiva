// The crash reporter is installed before any screen module loads, so a crash while the app
// starts still reaches the portal's Logs (see src/lib/crash).
import './src/lib/crash/install';
import 'expo-router/entry';
