# 🎲 Noob

Esta é a aplicação desenvolvida como **Trabalho de Conclusão de Curso (TCC)** do curso superior de **Tecnologia em Desenvolvimento de Software Multiplataforma** da **Fatec Mauá**.

O desenvolvimento visa o uso nas plataformas **Android (APK)** e **Web (hospedagem em domínio público)**.

A aplicação tem como objetivo facilitar o **registro de partidas em jogos de tabuleiro**, oferecendo ao usuário um **histórico de partidas** e **análise de desempenho**.

---

## 🚀 Tecnologias Utilizadas

- [React Native](https://reactnative.dev) com TypeScript
- [Expo Router](https://expo.github.io/router/) (navegação baseada em arquivos)
- [Zustand](https://github.com/pmndrs/zustand) (estado global)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) (persistência local)
- [Axios](https://axios-http.com) com `axios-retry` (requisições API)
- [Render](https://render.com) (hospedagem da API REST)
- [Vercel](https://vercel.com) (deploy web gratuito)
- Testes com `@testing-library/react-native` e `jest`

---

## 🎯 Funcionalidades

- Cadastro e edição de usuários e jogos
- Registro e visualização de partidas
- Estatísticas e gráficos de desempenho
- Ajuste de cores, fonte e tamanho para acessibilidade
- Sistema de autenticação e denúncias

---

## 📁 Estrutura de Pastas

A navegação é gerenciada por **Expo Router**, e cada tela corresponde a um arquivo dentro de `src/app`.

> Estrutura completa disponível em [`docs/documentation/folderTree.md`](./docs/documentation/folderTree.md)

```plaintext
src/
├── app/               // Rotas por arquivos
├── assets/            // Fontes, imagens e recursos estáticos
├── components/        // Componentes reutilizáveis
├── constants/         // Constantes globais do projeto
├── docs/              // Documentação técnica (Markdown)
├── hooks/             // Hooks personalizados
├── lib/               // Funções auxiliares (formatação, validações, logger)
├── services/          // Integração com a API (apiClient, rotas)
├── store/             // Zustand stores
├── theme/             // Tipografia, cores e estilos globais
├── tests/             // Testes unitários, integração e e2e
```

---

## ⚙️ Inicialização do Projeto

A aplicação foi iniciado com o comando `npx create-expo-app@latest` dando origem auma aplicação básica de exemplo.

Em seguida, foi executado o script `npm run reset-project` para trazer a aplicação à uma estrutura base limpa e padronizada.

> O projeto é construído com base na documentação oficial do Expo:  
> [https://docs.expo.dev](https://docs.expo.dev)

---

## ⚙️ Instruções de Uso

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/seu-usuario/noob-v3.git
   cd noob-v3
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Crie o arquivo `.env` na raiz:**

   ```env
   EXPO_PUBLIC_API_BASE_URL=trocar-pelo-link-da-api
   EXPO_PUBLIC_APP_MODE=development
   ```

4. **Execute o projeto:**

   ```bash
   npm start
   ```

---

## 📚 Documentação

> Toda a documentação pode (ou poderá) no [`Sumário`](./docs/index.md).

### 📁 [`docs/documentation/`](./docs/documentation/)

| Arquivo             | Conteúdo                                                                  |
| ------------------- | ------------------------------------------------------------------------- |
| `folderTree.md`     | Estrutura completa de pastas e organização do projeto                     |
| `dependencies.md`   | Lista detalhada de dependências, com número, descrição e agrupamento      |
| `eslintConfig.md`   | Regras e configurações do ESLint                                          |
| `prettierConfig.md` | Regras aplicadas no Prettier e justificativas                             |
| `styling.md`        | Estratégia de temas, tipografia, estilos locais e globais                 |
| `commits.md`        | Padrão de mensagens de commit com exemplos                                |
| `tsconfig.md`       | Explicações sobre os caminhos e configurações do TypeScript               |
| `api.md`            | Explicação das rotas da API, autenticação, exemplos de uso                |
| `themeTokens.md`    | Tokens de cor e tipografia disponíveis via `useTheme`                     |
| `screens.md`        | Resumo de cada tela com propósito e funcionalidades                       |
| `tests.md`          | Estratégia de testes e exemplos por tipo: unitário, integração e e2e      |
| `authFlow.md`       | Explicação do fluxo de autenticação: login, registro, token, logout       |
| `vercelConfig.md`   | Etapas para publicação no Vercel, domínio personalizado, problemas comuns |
| `assetsGuide.md`    | Organização das imagens, nomes de arquivos e boas práticas                |
| `splashAndIcons.md` | Como alterar splash, ícones e favicon em diferentes plataformas           |
| `migrationPlan.md`  | Mapeamento da migração do app antigo para a nova estrutura                |

---

## 📁 Estrutura de pasta <!-- TODO: mover para arquivo prórpio: folderTree.md -->

### Emojis para o status de implementação

[✅] - Arquivo/pasta existente e pronto
[❗] - Arquivo/pasta existente e importante
[✖️] - Arquivo/pasta ainda não existe

### Emoji para tipos de Arquivo

📄 - Arquivo geral de código (TypeScript, TSX, JS)
🧩 - Componente reutilizável, layout ou hook
🎨 - Arquivo de estilo (style.ts, styles.tsx)
🧪 - Teste (.test.tsx, .test.ts)
⚙️ - Configuração (config.js, .prettierrc, .eslintrc, tsconfig.json, etc.)
📓 - Documentação de arquivos (.md)
📚 - Documentação de processos (.md)
📦 - Arquivo de dependências (package.json, package-lock.json)
🗑️ - Arquivo de ignore (.gitignore, .eslintignore, .prettierignore)
🔑 - Arquivo de variáveis de ambiente (.env)
🖼️ - Imagem (png, jpg, gif, svg, etc.)
🅰️ - Arquivo de tipagem (.d.ts)
🗂️ - Barrel file (index.tsx em components, layouts, etc.)

```plaintext
📁 [✅] noob/                               |> Código-fonte principal do aplicativo
├── 📁 [✅] app/                            |> Arquivos de rotas do Expo Router
│   ├── [❗] 🧩 _layout.tsx                 |> Layout raiz que engloba todas as páginas (SafeArea, ThemeProvider etc.)
│   ├── [❗] 📄 index.tsx                   |> Tela inicial da aplicação (landing ou redirecionamento)
│   ├── [✖️] 📄 +not-found.tsx              |> Página de erro 404 para rotas não encontradas

│   ├── 📁 [✅] (legacy)/                   |> telas antigas e temporárias
│   ├── 📁 [✅] boardgame/             |> Telas de informações dos jogos
│   │   ├── [✅] index.tsx
│   │   ├── 📄 Analises.tsx
│   │   ├── 📄 Avaliacao.tsx
│   │   ├── 📄 Classificacao.tsx
│   │   ├── 📄 Descricao.tsx
│   │   ├── [✅] EditGame.tsx
│   │   ├── [✅] RegisterGame.tsx
│   │   └── 📁 (userProfile)/     |> Abas do perfil dentro de jogo
│   │       ├── [✅] index.tsx
│   │       ├── [✅] Descricao.tsx
│   │       ├── [✅] Desempenho.tsx
│   │       └── [✅] Historico.tsx
│   ├── 📁 matches/
│   │   ├── [✅] index.tsx
│   │   ├── [✅] MatchFinish.tsx
│   │   └── [✅] RegisMatchStart.tsx
│   └── 📁 [✅] user/
│       ├── [✅] index.tsx
│       ├── [✅] EditUser.tsx
│       ├── [✅] Login.tsx
│       ├── [✅] RegisterUser.tsx
│       ├── [✅] UserProfile.tsx
│       └── 📁 (userProfile)/
│           ├── [✅] _layout.tsx
│           ├── [✅] Descricao.tsx
│           ├── [✅] Desempenho.tsx
│           └── [✅] Historico.tsx

│   ├── 📁 [✅] (auth)/                     |> Rotas públicas: login e registro
│   │   ├── 📁 [✖️] login/                  |> Tela de login do usuário
│   │   │   ├── [✖️] 📄 index.tsx           |> Componente de tela
│   │   │   ├── [✖️] 🎨 style.ts            |> Estilos específicos da tela
│   │   │   └── [✖️] 🧪 login.test.tsx      |> Testes unitários da tela
│   │   └── 📁 [✖️] register/               |> Tela de cadastro de usuário
│   │       ├── [✖️] 📄 index.tsx
│   │       ├── [✖️] 🎨 style.ts
│   │       └── [✖️] 🧪 register.test.tsx
│   ├── 📁 [✅] (public)/                   |> Rotas acessíveis sem login
│   │   └── 📁 [✅] boardgame/              |> Lista de jogos e visualização pública
│   │       ├── [✖️] 📄 index.tsx           |> Lista pública de jogos
│   │       └── 📁 [✖️] [id]/               |> Perfil público do jogo
│   │           ├── [✖️] 📄 index.tsx       |> Info e avaliações públicas
│   │           └── [✖️] 🎨 style.ts
│   └── 📁 [✖️] (app)/                      |> Rotas privadas (usuário autenticado)
│       ├── [✖️] 🧩 _layout.tsx             |> Layout das rotas internas após login
│       ├── 📁 [✖️] boardgame/              |> Gerenciamento de jogos (usuário logado)
│       │   ├── 📁 [✖️] register/           |> Tela para cadastrar novo jogo
│       │   │   ├── [✖️] 📄 index.tsx
│       │   │   └── [✖️] 🎨 style.ts
│       │   └── 📁 [✖️] [id]/               |> Funções privadas do jogo
│       │       ├── [✖️] 📄 edit.tsx        |> Aba: editar informações
│       │       ├── [✖️] 📄 rate.tsx        |> Aba: avaliar ou editar avaliação
│       │       ├── [✖️] 📄 performance.tsx |> Aba: desempenho dos usuários
│       │       └── [✖️] 🎨 style.ts
│       ├── 📁 [✖️] profile/                |> Perfil do usuário logado
│       │   ├── [✖️] 📄 index.tsx           |> Tela principal com abas
│       │   ├── [✖️] 📄 edit.tsx            |> Aba: editar dados pessoais
│       │   ├── [✖️] 📄 history.tsx         |> Aba: histórico de partidas
│       │   ├── [✖️] 📄 performance.tsx     |> Aba: desempenho geral
│       │   └── [✖️] 🎨 style.ts
│       ├── 📁 [✖️] matches/                |> Tela de partidas (listagem, nova, editar)
│       │   ├── [✖️] 📄 index.tsx
│       │   ├── 📁 [✖️] new/                |> Nova partida
│       │   │   ├── [✖️] 📄 index.tsx
│       │   │   └── [✖️] 🎨 style.ts
│       │   └── 📁 [✖️] [id]/               |> Detalhes de partida específica
│       │       ├── [✖️] 📄 index.tsx
│       │       └── [✖️] 🎨 style.ts
│       ├── 📁 [✖️] performance/            |> Dashboard geral do sistema
│       │   ├── [✖️] 📄 index.tsx
│       │   └── [✖️] 🎨 style.ts
│       ├── 📁 [✖️] reports/                |> Tela de denúncias
│       │   ├── [✖️] 📄 index.tsx
│       │   └── [✖️] 🎨 style.ts
│       ├── 📁 [✖️] settings/               |> Tela de configurações visuais
│       │   ├── [✖️] 📄 index.tsx
│       │   └── [✖️] 🎨 style.ts
│       └── 📁 [✖️] test/                   |> Tela de teste/experimentos
│           ├── [✖️] 📄 index.tsx
│           └── [✖️] 🎨 style.ts
├── 📁 [✅] assets/                        |> Recursos estáticos do projeto (imagens, fontes)
│   ├── 📁 [✅] fonts/                     |> Fontes personalizadas da aplicação
│   └── 📁 [✅] images/                    |> Imagens organizadas por contexto
│       ├── 📁 [✖️] boardgame/             |> Imagens relacionadas a jogos
│       │   └── [✖️] 🖼️ loading.gif
│       ├── 📁 [✖️] users/                 |> Imagens de usuário (foto de perfil, capa)
│       │   └── [✖️] 🖼️ userCover.png
│       ├── 📁 [✖️] games/                 |> Capa de jogos cadastrados
│       ├── 📁 [✅] ui/                    |> Ícones e imagens da interface
│       │   ├── [❗] 🖼️ splash.png
│       │   ├── [❗] 🖼️ icon.png
│       │   ├── [❗] 🖼️ favicon.png
│       │   └── [❗] 🖼️ adaptive-icon.png
│       ├── 📁 [✖️] placeholders/          |> Imagens de falha ou ausentes
│       │   └── [❗] 🖼️ unavailable.png
│       └── 📁 [✖️] backgrounds/           |> Imagens de fundo ou wallpapers
├── 📁 [✅] components/                    |> Componentes reutilizáveis da interface
│   ├── [✖️] index.tsx                  |> Barrel file para exportação centralizada
│   ├── 📁 [✖️] 🧩 buttons/                   |> Botões personalizados
│   │   ├── 📁 [❗] ButtonHighlight/       |> Botão com destaque visual
│   │   │   ├── [✖️] 🧩 index.tsx
│   │   │   ├── [✖️] 🎨 style.ts
│   │   │   └── [✖️] 🧪 ButtonHighlight.test.tsx
│   │   ├── 📁 [✖️] ButtonSemiHighlight/
│   │   │   ├── [✖️] 🧩 index.tsx
│   │   │   ├── [✖️] 🎨 style.ts
│   │   │   └── [✖️] 🧪 ButtonSemiHighlight.test.tsx
│   │   └── 📁 [❗] SandwichMenu/          |> Menu lateral (hambúrguer)
│   │       ├── [✖️] 🧩 index.tsx
│   │       ├── [✖️] 🎨 styles.tsx
│   │       └── [✖️] 🧪 SandwichMenu.test.tsx
│   ├── 📁 [✖️] cards/
│   │   └── 📁 [✖️] GameCard/              |> Cartão de exibição de jogo
│   │       ├── [✖️] 🧩 index.tsx
│   │       ├── [✖️] 🎨 styles.tsx
│   │       └── [✖️] 🧪 GameCard.test.tsx
│   ├── 📁 [✖️] layouts/
│   │   └── 📁 [❗] HeaderLayout/          |> Cabeçalho da aplicação
│   │       ├── [✖️] 🧩 index.tsx
│   │       ├── [✖️] 🎨 styles.tsx
│   │       └── [✖️] 🧪 HeaderLayout.test.tsx
│   └── 📁 [✖️] feedback/
│       ├── 📁 [✖️] LoadingIndicator/      |> Tela de carregamento local (em uma tela)
│       │   ├── [✖️] 🧩 index.tsx
│       │   └── [✖️] 🎨 style.ts
│       └── 📁 [✅] Splash/                |> Tela de carregamento global (ao iniciar o app)
│           ├── [❗] 🧩 index.tsx
│           └── [✖️] 🎨 style.ts
├── 📁 [✅] constants/                     |> Constantes reutilizadas (rotas, imagens)
│   ├── [❗] 📄 images.ts
│   ├── [✖️] 📄 index.ts
│   └── [❗] 📄 routes.ts
├── 📁 [✅] docs/                          |> Documentação do projeto
│   ├── [❗] 📓 index.md                   |> Introdução geral
│   └── 📁 [✅] documentation/
│       ├── [✖️] 📓 commits.md             |> Padrão de commits
│       ├── [✖️] 📚 dependencies.md        |> Lista de dependências
│       ├── [✖️] 📓 eslintConfig.md        |> Regras do ESLint
│       ├── [✖️] 📚 folderTree.md          |> Estrutura de pastas
│       ├── [✖️] 📓 prettierConfig.md      |> Regras do Prettier
│       ├── [✖️] 📓 styling.md             |> Explicação da estilização
│       └── [✖️] 📚 tsconfig.md            |> Configuração TypeScript
├── 📁 [✅] hooks/                         |> Hooks personalizados
│   ├── [✅] 🧩 useKeepApiAwake.ts         |> Mantém a API acordada no fundo
│   ├── [✖️] 🧩 useTheme.ts                |> Retorna tema e tamanhos de fonte ajustados
│   └── [✅] 🧩 useWarmUpApi.ts            |> Alternativa de "wake-up" da API
├── 📁 [✅] lib/                           |> Funções utilitárias reutilizáveis
│   ├── [✖️] 📄 formatDate.ts
│   ├── [✅] ⚙️ logger.ts                  |> Logger central (desativa logs em produção)
│   └── [✖️] 📄 validations.ts             |> Validações comuns (ex: email, senha)
├── 📁 [✅] services/                       |> Comunicação com a API
│   ├── [✅] ⚙️ apiClient.ts               |> Axios configurado
│   ├── [✖️] 📄 users.ts
│   ├── [✖️] 📄 games.ts
│   ├── [✖️] 📄 matches.ts
│   └── [✖️] 📄 ratings.ts
├── 📁 [✖️] store/                          |> Zustand stores (estado global)
│   ├── [✖️] 🧩 useSettingsStore.ts         |> Tema, fonte, acessibilidade
│   └── [✖️] 🧩 useUserStore.ts             |> Informações do usuário logado
├── 📁 [✅] theme/                          |> Tema global da aplicação
│   ├── [✖️] 📄 index.ts                    |> Exportação unificada
│   └── 📁 [✅] global/
│       ├── [✅] 📄 theme.ts                |> Paletas de cores (claro, escuro, daltônico)
│       ├── [✅] 📄 typography.ts           |> Tamanhos de fonte e multiplicadores
│       └── [✖️] 🎨 globalStyles.ts         |> Estilos globais reaproveitáveis
├── 📁 [✖️] tests/                          |> Testes não acoplados aos componentes
│   ├── 📁 [✖️] unit/                       |> Testes unitários (ex: store, utils)
│   │   └── [✖️] 🧪 store.test.ts
│   ├── 📁 [✖️] integration/                |> Testes de integração entre componentes
│   │   └── [✖️] 🧪 Header.test.tsx
│   └── 📁 [✖️] e2e/                        |> Testes de fluxo completo (end-to-end)
│       └── [✖️] 🧪 login-flow.test.ts
├── [✅] 🔑 .env                            |> Variáveis de ambiente
├── [✅] 🗑️ .eslintignore
├── [✅] 🗑️ .gitignore                      |> Arquivos ignorados no Git
├── [✅] 🗑️ .prettierignore                 |> Arquivos ignorados pelo Prettier
├── [✅] ⚙️ .prettierrc                     |> Configuração de formatação Prettier
├── [✅] ⚙️ app.config.js                   |> Configuração do Expo com variáveis dinâmicas
├── [✅] ⚙️ babel.config.js                 |> Babel para transpilar código moderno
├── [✅] 🅰️ declarations.d.ts               |> Tipagens globais (ex: módulos não tipados)
├── [✅] ⚙️ eslint.config.js                |> Configuração ESLint moderna (v9+)
├── [✅] 📦 package-lock.json
├── [✅] 📦 package.json                    |> Dependências e scripts do projeto
├── [✅] 📑 README.md                       |> Introdução e instruções do projeto
├── [✅] ⚙️ tsconfig.json                   |> Configuração do TypeScript
└── [✅] ⚙️ vercel.json                     |> Configuração para deploy no Vercel
```

---

## 🛠️ Passo a Passo Detalhado

### [✅] Iniciar novo app com Expo + TS + Router

- [✔️] Iniciada aplicação com: `npx create-expo-app@latest`
- [✔️] Executado script de limpeza: `npm run reset-project`
- [✔️] Criar repositório no GitHub
- [✔️] Criar branch de desenvolvimento

### [✅] Configurações iniciais

- [✔️] `app.json` convertido em `app.config.js`
- [✔️] `.env` criado e listado no `.gitignore`
- [✔️] Escrito README.md
- [✔️] configurado o Prettier, `.prettierignore`, ESLint e `.eslintignore`
- [✔️] Criado arquivo `logger`
- [✔️] Aliases configurado
- [✔️] Criado arquivo `apiClient.ts`
- [✔️] Documentado cada arquivo

---

### [✅] **Hospedar repositório na web via Vercel**

- [✔️] Linkado GitHub à Vercel e importado o repositório
- [✔️] Definido `output directory` como `dist/`
- [✔️] Publicado usando domínio `noob.app.br`
- [✔️] Documentado arquivo vercelConfig.md

---

### [✅] Copiar o app do ZIP para a estrutura nova

- [✔️] Copiar arquivos do repositório `https://github.com/eRodrigoL/noob`:
  - componentes (origem)
    - [✔️] `componments/ButtonGoBack.tsx`
    - [✔️] `componments/ButtonPrimary.tsx`
    - [✔️] `componments/Header.tsx`
    - [✔️] `componments/ParallaxProfile.tsx`
    - [✔️] `componments/SandwichMenu.tsx`
    - [✔️] `componments/SearchBar.tsx`
    - [✔️] `componments/Splash.tsx`
    - telas (origem)
    - [✔️] `scrreen/user/UserProfile.tsx`
    - [✔️] `scrreen/user/RegisterUser.tsx`
    - [✔️] `scrreen/user/Login.tsx`
    - [✔️] `scrreen/user/EditUser.tsx`
    - [✔️] `scrreen/user/(userProfile)/Descricao.tsx`
    - [✔️] `scrreen/user/(userProfile)/Desempenho.tsx`
    - [✔️] `scrreen/user/(userProfile)/Historico.tsx`
    - [✔️] `scrreen/user/(userProfile)/UserProfile.tsx`
    - [✔️] `scrreen/matches/MatchFinish.tsx`
    - [✔️] `scrreen/matches/MatchStart.tsx`
    - [✔️] `scrreen/matches/Matches.tsx`
    - [✔️] `scrreen/boardgame/RegisterGame.tsx`
    - [✔️] `scrreen/boardgame/List.tsx`
    - [✔️] `scrreen/boardgame/EditGame.tsx`
    - [✔️] `scrreen/boardgame/(gameProfile)/GameDashboard.tsx`
    - [✔️] `scrreen/boardgame/(gameProfile)/GameReview.tsx`
    - [✔️] `scrreen/boardgame/(gameProfile)/Ranking.tsx`
    - [✔️] `scrreen/boardgame/(gameProfile)/Descricao.tsx`
    - [✔️] `scrreen/boardgame/(gameProfile)/GameProfile.tsx`

---

### [ ] Migrar estilos comuns para globais

- Crie ou preencha:
  - [] `theme/global/theme.ts`
  - [] `theme/global/typography.ts`
  - [] `theme/global/globalStyles.ts`
  - [] `theme/index.ts`
- importar com: import { globalStyles } from '@theme/index';
- Unifique tokens de cor, fontes, tamanhos e use com hook `useTheme.ts`.
- [] Documentar cada etapa/processo

---

### [ ] Migrar estilos próprios para `style.ts`

- [] Para cada tela/componente, crie o arquivo style.ts
- [] Nas telas/componentes, importar com: import { localStyles } from './styles';
- [] Documentar cada etapa/processo

---

### [ ] Transformar blocos repetidos em componentes reutilizáveis

- [] Identifique padrões: botões, cards, modais etc.
- [] Se necessário, crie dentro de 📁 components/ categorias:

```plaintext
📁 components/
├── 📁 buttons/
├── 📁 cards/
├── 📁 layouts/
├── 📁 [...]
```

- [] dentro das pastas de categorias as pastas dos respectivos componentes e mover código repetido para lá
- [] Testar visual e funcionalmente
- [] Documentar cada etapa/processo

---

### [ ] Implementar tema dinâmico com tela de configurações

- [] Criar store `useSettingsStore.ts` com tema, fonte e modo daltônico
- [] Criar `theme.ts`, `typography.ts` e `globalStyles.ts` para centralizar
- [] Criar `useTheme.ts` para retornar `colors`, `fontSizes`, `fontFamily` dinâmicos
- [] Criar tela `settings/index.tsx` com botões de ajuste
- [] Documentar cada etapa/processo

---

### [ ] Sincronizar tema com API do usuário

- [] Ao carregar/recaggerar app:
  - Carregar as preferências do usuário da API (`GET /usuarios/:id`)
  - Atualizar Zustand com os dados carregados
- [] Ao confirmar na tela de configurações:
  - Enviar para API (`PUT /usuarios/:id`)
- [] Documentar cada etapa/processo

---

### [ ] Detalhes visuais e comportamentais

- [] Splash screen personalizada:
  - [] Substituir imagem em `assets/images/ui/splash.png` <!-- aparece logo ao abrir o app, antes de qualquer código JS ser executado -->
  - [] Configurar `app.config.js` <!-- se necessário. Para ler a imagem correta -->
  - [] Criar componente Splash <!-- aparece depois, quando seu app React já está rodando e pode mostrar algo enquanto a API desperta e o tema dinâmico vigora -->
- [] Ícone e favicon:
  - Substituir `assets/images/ui/icon.png`, `favicon.png`, `adaptive-icon.png`
- [] Carregamento ao iniciar:
  - Mostrar `<Splash />` enquanto `useSettingsStore().isLoaded` for `false` <!-- TODO: talvez seja melhor criar um componente LoadingIndicator -->
- [] Carregamento ao atualizar (F5 web):
  - Usar `SplashScreen.preventAutoHideAsync()` + `useEffect` no `_layout.tsx`
- [] Documentar cada etapa/processo

---

### [ ] Implementar testes

- [] realizar instalações necessárias
- [] Criar testes:
  - Componentes: `components/MeuComponente/MeuComponente.test.tsx`
  - Store/hooks: `tests/unit/store.test.ts`
  - Integração: `tests/integration/Header.test.tsx`
  - Fluxo completo: `tests/e2e/login-flow.test.ts`
  - Unitários: `tests/unit/`
  - Integração: `tests/integration/`
  - End-to-end (opcional): `tests/e2e/`
  - [...]
- [] Configurar `jest.config.js` com suporte ao Expo + TypeScript
- [] Documentar cada etapa/processo

---

## 👥 Autores

- [eRodrigoL](https://github.com/eRodrigoL)
- [Xketh](https://github.com/Xketh)
- [motathais](https://github.com/motathais)

Alunos da Fatec Mauá — Turma 2022–2025  
Curso: Tecnologia em Desenvolvimento de Software Multiplataforma
