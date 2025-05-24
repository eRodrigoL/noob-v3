// store/useSettingsStore.ts

import { logger } from '@lib/logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@services/apiClient';
import theme from '@theme/global/theme';
import typography from '@theme/global/typography';
import { create } from 'zustand';

export type ThemeName = keyof typeof theme;
export type FontOption = keyof typeof typography.fonts;

interface SettingsState {
  fontOption: FontOption;
  fontSizeMultiplier: number;
  theme: ThemeName;
  isLoaded: boolean;

  // Ações
  setFont: (font: FontOption) => void;
  setFontSizeMultiplier: (multiplier: number) => void;
  setTheme: (theme: ThemeName) => void;

  restoreDefaults: () => void;
  confirmChanges: (userId: string) => Promise<void>;
  loadPreferences: () => Promise<void>;
}

const DEFAULTS: Pick<SettingsState, 'fontOption' | 'fontSizeMultiplier' | 'theme'> = {
  fontOption: 'roboto',
  fontSizeMultiplier: 1,
  theme: 'light',
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...DEFAULTS,
  isLoaded: false,

  setFont: (font) => set({ fontOption: font }),

  setFontSizeMultiplier: (multiplier) => {
    const clamped = Math.min(
      Math.max(multiplier, typography.sizes.min / typography.sizes.base),
      typography.sizes.max / typography.sizes.base
    );
    set({ fontSizeMultiplier: clamped });
  },

  setTheme: (themeName) => set({ theme: themeName }),

  restoreDefaults: () => {
    set({ ...DEFAULTS });
    logger.info('🎯 Preferências restauradas para o padrão.');
  },

  confirmChanges: async (userId: string) => {
    const { fontOption, fontSizeMultiplier, theme } = get();
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token de autenticação não encontrado.');

      await apiClient.put(
        `/usuarios/preferencias/${userId}`,
        {
          fontOption,
          fontSize: String(fontSizeMultiplier),
          theme,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      logger.log('✅ Preferências salvas com sucesso!');

      // Atualiza o localStorage
      await AsyncStorage.multiSet([
        ['fontOption', fontOption],
        ['fontSize', String(fontSizeMultiplier)],
        ['theme', theme],
      ]);
    } catch (error) {
      logger.error('❌ Erro ao salvar preferências:', error);
      throw error;
    }
  },

  loadPreferences: async () => {
    try {
      const entries = await AsyncStorage.multiGet(['fontOption', 'fontSize', 'theme']);

      const fontOptionValue = entries[0][1];
      const fontSizeValue = entries[1][1];
      const themeValue = entries[2][1];

      const validFontOptions = Object.keys(typography.fonts);
      const validThemeOptions = Object.keys(theme);

      const fontOption: FontOption =
        validFontOptions.includes(fontOptionValue ?? '')
          ? (fontOptionValue as FontOption)
          : DEFAULTS.fontOption;

      const themeName: ThemeName =
        validThemeOptions.includes(themeValue ?? '')
          ? (themeValue as ThemeName)
          : DEFAULTS.theme;

      const fontSize = parseFloat(fontSizeValue ?? '');
      const fontSizeMultiplier =
        Math.min(
          Math.max(fontSize, typography.sizes.min / typography.sizes.base),
          typography.sizes.max / typography.sizes.base
        ) || DEFAULTS.fontSizeMultiplier;

      set({
        fontOption,
        fontSizeMultiplier,
        theme: themeName,
        isLoaded: true,
      });

      logger.log('📦 Preferências carregadas do armazenamento local.');
    } catch (error) {
      logger.warn('⚠️ Erro ao carregar preferências, usando padrão.', error);
      set({ ...DEFAULTS, isLoaded: true });
    }
  },
}));

