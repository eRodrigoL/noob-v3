// services/apiClient.ts
import axios from 'axios';
import axiosRetry from 'axios-retry';
import Constants from 'expo-constants';

// Base URL da API, vinda do app.config.js (via .env)
const baseURL = Constants.expoConfig?.extra?.apiBaseUrl;

if (!baseURL) {
  throw new Error('❌ API base URL não definida. Verifique o .env e o app.config.js');
}

// Instância do Axios
export const apiClient = axios.create({
  baseURL,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Retry automático em caso de erro de rede/timeout
axiosRetry(apiClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => axiosRetry.isNetworkOrIdempotentRequestError(error),
});

// Interceptor opcional para logs de erro em modo dev
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (__DEV__) {
      console.error('API ERROR:', error?.response || error?.message);
    }
    return Promise.reject(error);
  }
);
