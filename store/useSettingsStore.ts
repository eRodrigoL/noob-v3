// store/useSettingsStore.ts

import { logger } from '@lib/logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@services/apiClient';
import theme from '@theme/global/theme';
import typography from '@theme/global/typography';
import { create } from 'zustand';

export type ThemeName = keyof typeof theme;
export type FontOption = keyof typeof typography.fonts;
export type FontSizeLevel = 'small' | 'base' | 'large' | 'giant';

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
  loadPreferences: (userId: string) => Promise<void>;
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
  setTheme: (theme) => set({ theme }),

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
    } catch (error) {
      logger.error('❌ Erro ao salvar preferências:', error);
      throw error;
    }
  },

  loadPreferences: async (userId: string) => {
    try {
      const response = await apiClient.get(`/usuarios/preferencias/${userId}`);
      const { fontOption, fontSize, theme } = response.data;

      set({
        fontOption: fontOption in typography.fonts ? fontOption : DEFAULTS.fontOption,
        fontSizeMultiplier:
          Math.min(
            Math.max(parseFloat(fontSize), typography.sizes.min / typography.sizes.base),
            typography.sizes.max / typography.sizes.base
          ) || DEFAULTS.fontSizeMultiplier,
        theme: theme in theme ? theme : DEFAULTS.theme,
        isLoaded: true,
      });

      logger.log('📦 Preferências carregadas da API.');
    } catch (error) {
      logger.warn('⚠️ Erro ao carregar preferências, usando padrão.', error);
      set({ ...DEFAULTS, isLoaded: true });
    }
  },
}));
