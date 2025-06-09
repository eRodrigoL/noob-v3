// src/services/apiClient.ts
import { logger } from '@lib/logger';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Section } from 'react-native-paper/lib/typescript/components/Drawer/Drawer';
import { storage } from '@store/storage';

// Recupera a URL base da API definida em app.config.js (extra.apiBaseUrl)
const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!baseURL) {
  throw new Error(
    '❌ A variável de ambiente API_BASE_URL não foi definida no app.config.js ou .env'
  );
}

// Cria uma instância Axios personalizada para uso em toda a aplicação
export const apiClient = axios.create({
  baseURL,
  timeout: 10000, // Reduzido para 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Aplica o mecanismo de retry automático
axiosRetry(apiClient, {
  retries: 5,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) =>
    error.code === 'ECONNABORTED' || axiosRetry.isNetworkOrIdempotentRequestError(error),
});

// Interceptor global para tratamento de token expirado
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error)) {
      const msg = error.response?.data?.msg?.toLowerCase?.() ?? '';
      const isTokenError = msg.includes('token inválido') || msg.includes('jwt');

      if (isTokenError) {
        logger.warn('🔒 Token inválido detectado. Redirecionando para login...');
        Toast.show({
          type: 'error',
          text1: 'Sessão expirada',
          text2: 'Faça login novamente.',
        });

        await storage.clear(['token', 'userId']);
        router.replace('/boardgame');
      }
    }

    return Promise.reject(error);
  }
);
