/**
 * Runtime configuration sourced from Expo public env vars.
 *
 * `EXPO_PUBLIC_*` values are statically inlined at build time, so they must be
 * referenced with plain dot notation (never destructured or index-accessed).
 * See https://docs.expo.dev/guides/environment-variables/
 */

// Fallback works for the iOS simulator and web. Physical devices / Android
// emulator need a LAN IP supplied via .env (see .env.example).
const DEFAULT_API_URL = 'http://localhost:5001/api';

export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL
).replace(/\/+$/, '');
