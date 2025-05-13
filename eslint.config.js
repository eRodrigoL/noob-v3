// eslint.config.js
// ESLint Flat Config – adaptado para projeto React Native com Expo + TypeScript + Prettier

import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactNative from 'eslint-plugin-react-native';

export default [
  // Regras específicas para arquivos TS/TSX (com React Native)
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': ts,
      react,
      'react-native': reactNative,
      import: importPlugin,
      'jsx-a11y': jsxA11y,
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...ts.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactNative.configs.all.rules,
      ...jsxA11y.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,

      // Ajustes específicos do projeto
      'react/react-in-jsx-scope': 'off',
      'react-native/no-inline-styles': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },

  // Regras globais aplicadas a todos os arquivos JS/TS
  {
    files: ['**/*.js', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        process: 'readonly',
        console: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        __DEV__: 'readonly',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },

  // Integração com Prettier
  {
    rules: {
      ...prettier.rules,
    },
  },

  // Ignorar pastas que não devem ser lintadas
  {
    ignores: ['node_modules/', 'dist/', 'build/', '.expo/', 'assets/', 'coverage/', 'scripts/'],
  },
];
