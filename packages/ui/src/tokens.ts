/** PLAN.md §3 visual system — semantic color tokens (WCAG validation deferred to design QA). */
export const colorLight = {
  background: '#F8F4ED',
  surface: '#FFFDF8',
  textPrimary: '#2C1810',
  textSecondary: '#6B554A',
  interactive: '#2F5597',
  accent: '#8A681A',
} as const;

export const colorDark = {
  background: '#0F1220',
  surface: '#1A1F35',
  textPrimary: '#F5F0E8',
  textSecondary: '#BCC1D0',
  interactive: '#9CB7FF',
  accent: '#E8C56A',
} as const;

export type SemanticColors = typeof colorLight;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
} as const;

export const typography = {
  title: { fontSize: 28, lineHeight: 34, fontWeight: '600' as const },
  headline: { fontSize: 22, lineHeight: 28, fontWeight: '600' as const },
  body: { fontSize: 17, lineHeight: 24, fontWeight: '400' as const },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
  scripture: { fontSize: 19, lineHeight: 30, fontWeight: '400' as const },
} as const;

export const motion = {
  durationMs: { fast: 180, normal: 300, slow: 400 },
} as const;

export const hitSlop = {
  iosMinTouch: 44,
  androidMinTouch: 48,
} as const;
