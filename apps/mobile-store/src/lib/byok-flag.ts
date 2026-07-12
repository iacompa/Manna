/** Compile-time BYOK gate — store builds keep EXPO_PUBLIC_ENABLE_BYOK=false. */
export function isByokEnabled(): boolean {
  return process.env.EXPO_PUBLIC_ENABLE_BYOK === 'true';
}
