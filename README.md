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

```ts
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

## 🛠️ Passo a Passo Detalhado

### [✅] Iniciar novo app com Expo + TS + Router

- [✔️] Iniciada aplicação com: `npx create-expo-app@latest`
- [✔️] Executado script de limpeza: `npm run reset-project`
- [✔️] Criar repositório no GitHub
- [✔️] Criar branch de desenvolvimento

### [ ] Configurações iniciais

- [✔️] `app.json` convertido em `app.config.js`
- [✔️] `.env` criado e listado no `.gitignore`
- [✔️] Escrever README.md
- [✔️] configurado o Prettier, `.prettierignore`, ESLint e `.eslintignore`
- [✔️] Criar arquivo `logger`
- [✔️] Configurar aliases
- [] Criar arquivos `apiClient.ts`
- [] Documentar cada etapa/processo

---

### [ ] **Hospedar repositório na web via Vercel**

- [] Linkar seu GitHub à Vercel e importar o repositório
- [] Definir `output directory` como `dist/` (ou deixar vazio se for projeto Expo Web)
- [] Publicar usando domínio gratuito ou personalizado (como `meuapp.vercel.app`)- []
- [] Documentar cada etapa/processo

---

### [ ] Copiar o app do ZIP para a estrutura nova

- [] Extraia o `.zip`.
- [] Copie os arquivos por categoria **apenas o necessário**:
  - respeitando novas pastas (auth, app, etc.)
    - [] Telas > `src/app/`
    - [] Componentes > `src/components/`
    - [] Estilos > `src/theme/`
    - [] Hooks > `src/hooks/`
    - [] Stores > `src/store/`
    - [] API > `src/services/`
    - [] Constantes > `src/constants/`
    - [] Utils > `src/lib/`
    - [] Testes > `src/tests/`
    - [...]
- [] Documentar cada etapa/processo

---

### [ ] Migrar estilos comuns para globais

- Crie ou preencha:
  - [] `src/theme/global/theme.ts`
  - [] `src/theme/global/typography.ts`
  - [] `src/theme/global/globalStyles.ts`
  - [] `src/theme/index.ts`
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
  - Substituir imagem em `assets/images/ui/splash.png`
  - Configurar `app.config.js`
- [] Ícone e favicon:
  - Substituir `assets/images/ui/icon.png`, `favicon.png`, `adaptive-icon.png`
- [] Carregamento ao iniciar:
  - Mostrar `<Splash />` enquanto `useSettingsStore().isLoaded` for `false`
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
  - Unitários: `src/tests/unit/`
  - Integração: `src/tests/integration/`
  - End-to-end (opcional): `src/tests/e2e/`
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
