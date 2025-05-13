// src/constants/routes.ts

// Rotas organizadas por contexto, mas temporariamente apontando para a tela inicial.
// Substitua os caminhos conforme as telas forem migradas.

export const ROUTES = {
  USER: {
    LOGIN: '/', // TODO: substituir por '/(auth)/login'
    REGISTER: '/', // TODO: substituir por '/(auth)/register'
    SETTINGS: '/', // TODO: substituir por '/(app)/settings'
    PROFILE: '/', // TODO: substituir por '/(app)/profile'
  },
  GAMES: {
    LIST: '/', // TODO: substituir por '/(app)/boardgame'
    REGISTER: '/', // TODO: substituir por '/(app)/boardgame/register'
    DETAILS: '/', // TODO: substituir por '/(app)/boardgame/[id]'
    EDIT: '/', // TODO: substituir por '/(app)/boardgame/[id]/edit'
  },
  MATCHES: {
    LIST: '/', // TODO: substituir por '/(app)/matches'
    REGISTER: '/', // TODO: substituir por '/(app)/matches/new'
    DETAILS: '/', // TODO: substituir por '/(app)/matches/[id]'
  },
  PERFORMANCE: {
    DASHBOARD: '/', // TODO: substituir por '/(app)/performance'
  },
  TEST: '/', // Rota temporária usada durante desenvolvimento
  HOME: '/', // A futura lista de jogos (será GAMES.LIST)
} as const;

// Utilitário para extrair todas as rotas válidas como union type de strings
type ExtractRoutes<T> = T extends string ? T : { [K in keyof T]: ExtractRoutes<T[K]> }[keyof T];

// Tipo exportado com todas as rotas que são `string` (e apenas elas)
export type ValidRoutes = ExtractRoutes<typeof ROUTES>;
