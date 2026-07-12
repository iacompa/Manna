import { colorDark, colorLight } from './tokens';

export type ColorScheme = 'light' | 'dark';

export type SemanticColors = typeof colorLight | typeof colorDark;

export function getSemanticColors(scheme: ColorScheme): SemanticColors {
  return scheme === 'dark' ? colorDark : colorLight;
}
