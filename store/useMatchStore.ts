// store/useMatchStore.ts
import { logger } from '@lib/logger';
import { apiClient } from '@services/apiClient';
import axios from 'axios';
import { create } from 'zustand';
import { storage } from './storage';

interface MatchStore {
  hasOpenMatch: boolean;
  isChecking: boolean;
  checkOpenMatch: () => Promise<void>;
  setHasOpenMatch: (value: boolean) => void;
}

export const useMatchStore = create<MatchStore>((set) => ({
  hasOpenMatch: false,
  isChecking: false,

  setHasOpenMatch: (value: boolean) => set({ hasOpenMatch: value }),

  checkOpenMatch: async () => {
    set({ isChecking: true });

    try {
      const userId = await storage.getItem('userId');
      const token = await storage.getItem('token');

      if (!userId || !token) {
        logger.warn('[MatchStore] Usuário não autenticado.');
        set({ hasOpenMatch: false, isChecking: false });
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const url = `/partidas/filtro?registrador=${userId}&fim=null`;
      const response = await apiClient.get(url, config);

      if (Array.isArray(response.data)) {
        const encontrou = response.data.length > 0;
        logger.info(`[MatchStore] Partidas abertas encontradas: ${response.data.length}`);
        set({ hasOpenMatch: encontrou });
      } else {
        logger.warn('[MatchStore] Resposta inesperada:', response.data);
        set({ hasOpenMatch: false });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        logger.info('[MatchStore] Nenhuma partida em aberto.');
        set({ hasOpenMatch: false });
      } else {
        logger.error('[MatchStore] Erro ao verificar partidas abertas:', error);
        set({ hasOpenMatch: false });
      }
    } finally {
      set({ isChecking: false });
    }
  },
}));
