// utils/sanitize.ts

import { Platform } from 'react-native';

let DOMPurify: any = null;

if (Platform.OS === 'web') {
  // Usa require para evitar erro no ambiente mobile
  // Força uso da versão compatível com CommonJS
  DOMPurify = require('dompurify').default ?? require('dompurify');
}

/**
 * Sanitiza entradas de texto com base no ambiente.
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';

  if (Platform.OS === 'web' && DOMPurify) {
    return DOMPurify.sanitize(input.trim(), {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });
  }

  return input
    .trim()
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s{2,}/g, ' ');
}

