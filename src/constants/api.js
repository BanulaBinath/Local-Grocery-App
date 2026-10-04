// Use EXPO_PUBLIC_API_URL when the device and development machine are on a
// different network. The fallback matches the current development machine LAN
// address and keeps Expo Go able to reach the local backend.
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.88:5000";
