// hooks/useTheme.ts

import { useSettingsStore } from '@store/useSettingsStore';
import theme from '@theme/global/theme';
import typography from '@theme/global/typography';

interface FontSizes {
  small: number;
  base: number;
  large: number;
  giant: number;
}

export function useTheme() {
  const { fontOption, fontSizeMultiplier, theme: themeName } = useSettingsStore();

  const currentTheme = theme[themeName];
  const fontFamily = typography.fonts[fontOption];

  const { base, smallMultiplier, largeMultiplier, giantMultiplier, min, max } = typography.sizes;

  const clamp = (value: number) => Math.min(Math.max(value, min), max);

  const fontSizes: FontSizes = {
    small: clamp(base * smallMultiplier * fontSizeMultiplier),
    base: clamp(base * fontSizeMultiplier),
    large: clamp(base * largeMultiplier * fontSizeMultiplier),
    giant: clamp(base * giantMultiplier * fontSizeMultiplier),
  };

  return {
    colors: currentTheme,
    fontFamily,
    fontSizes,
  };
}
