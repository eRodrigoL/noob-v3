// lib/logger.ts
// Logger seguro: mostra logs somente em desenvolvimento e ignora no modo produção.
// Usa `EXPO_PUBLIC_APP_MODE` como chave para ativar logs (definida no `.env`).

import Constants from 'expo-constants';
import { Platform } from 'react-native';

const isDev = Constants.expoConfig?.extra?.appMode === 'development';

function log(...args: unknown[]) {
  if (isDev) console.log('[LOG]', ...args);
}

function warn(...args: unknown[]) {
  if (isDev) console.warn('[WARN]', ...args);
}

function error(...args: unknown[]) {
  if (isDev) console.error('[ERROR]', ...args);
}

function info(...args: unknown[]) {
  if (isDev) console.info('[INFO]', ...args);
}

function debug(...args: unknown[]) {
  if (isDev && Platform.OS !== 'web') console.debug('[DEBUG]', ...args);
}

export const logger = {
  log,
  warn,
  error,
  info,
  debug,
};
