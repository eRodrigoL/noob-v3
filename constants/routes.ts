// constants/routes.ts

// Rotas organizadas por contexto, mas temporariamente apontando para a tela inicial.
// Substitua os caminhos conforme as telas forem migradas.

export const ROUTES = {
  USER: {
    LOGIN: '/', // TODO: SandwichMenu
    REGISTER: '/',
    SETTINGS: '/',
    PROFILE: '/', // TODO: SandwichMenu
  },
  GAMES: {
    LIST: '/',
    REGISTER: '/',
    DETAILS: (id: string) => `/app/boardgame/${id}`, // TODO: no futuro -> DETAILS: '/(public)/boardgame/[id]',
    EDIT: '/',
  },
  MATCHES: {
    LIST: '/',
    REGISTER: '/',
    DETAILS: '/', // TODO: SandwichMenu
  },
  PERFORMANCE: {
    DASHBOARD: '/',
  },
  TEST: '/',
  HOME: '/(legacy)/boardgameOld', // TODO: -> Header, SandwichMenu
} as const;

// Utilitário para extrair todas as rotas válidas como union type de strings
type ExtractRoutes<T> = T extends string ? T : { [K in keyof T]: ExtractRoutes<T[K]> }[keyof T];

// Tipo exportado com todas as rotas que são `string` (e apenas elas)
export type ValidRoutes = ExtractRoutes<typeof ROUTES>;
