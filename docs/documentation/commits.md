<!-- markdownlint-disable-next-line MD041 -->
[← Voltar (Índice)](../index.md)

# 📝 Padrão de Commits

Manter um padrão claro e consistente nas mensagens de commit facilita a leitura do histórico, o entendimento das mudanças e a colaboração entre os membros do projeto.

Este projeto segue uma **estrutura inspirada no Conventional Commits**, adaptada com símbolos visuais e linguagem objetiva.

---

## ⚠️ Boas Práticas Gerais

- **Não acumule mudanças demais** em um só commit: commits menores e frequentes são mais fáceis de revisar.
- **Seja objetivo e direto** no título do commit.
- **Use tempo verbal no infinitivo**, como "adicionar", "corrigir", "refatorar".
- **Commits que envolvem várias ações** devem ser coesos e bem explicados.
- **Use emojis com moderação**, apenas se desejar destacar algo importante:
  - `⚠️` para pendências
  - `✅` para finalizações
  - `❌` para remoções
  - `🔧` para ajustes técnicos

---

## 🧰 Estrutura do Commit

```bash
<tipo>[escopo opcional]: <descrição curta>

[corpo opcional]

[rodapé opcional]
```

> ✅ Exemplo:
>
> ```bash
> chore(config): 💅 configurar Prettier com formatação consistente
>
> - Criado `.prettierrc` na raiz com as regras de formatação do projeto
> - Adicionados scripts `format` e `format:check` ao `package.json`
> - Executado `npm run format` para aplicar a formatação inicial
> - Documentado em `docs/documentation/prettierConfig.md` com instruções e justificativas
>
> Resolves: "Instalar e configurar Prettier com formatação consistente" na issue #4
> ```

---

## 🎯 Tipos de Commit

| Tipo       | Descrição                                                               |
| ---------- | ----------------------------------------------------------------------- |
| `feat`     | Adição de nova funcionalidade                                           |
| `fix`      | Correção de bug ou comportamento errado                                 |
| `refactor` | Alteração interna sem mudar funcionalidade (ex: melhorar estrutura)     |
| `style`    | Ajustes visuais ou de estilo (não afetam lógica, ex: CSS ou formatação) |
| `test`     | Adição ou ajuste de testes                                              |
| `chore`    | Tarefas de configuração ou manutenção (ex: dependências, fontes, lint)  |
| `docs`     | Criação ou alteração de documentação                                    |
| `perf`     | Melhorias de desempenho                                                 |
| `build`    | Mudanças relacionadas à build ou empacotamento                          |
| `ci`       | Configurações de integração contínua (GitHub Actions, etc.)             |

---

## 🧩 Escopo (opcional)

O escopo identifica a parte do sistema afetada pela mudança. Exemplos:

```bash
feat(configuracoes): adicionar troca de fonte
fix(api): corrigir erro ao buscar jogos públicos
chore(theme): mover estilos para arquivo próprio
```

---

## ✍️ Corpo do Commit (opcional)

Use quando for necessário **explicar com mais detalhes** o que foi feito e por quê:

```txt
feat(store): adicionar `useUserStore` com persistência

Cria o estado global do usuário com base no Zustand.
Inclui persistência automática e integração futura com autenticação.
```

---

## 📎 Rodapé (opcional)

Use para:

- Referenciar **issues ou pull requests**:

  ```bash
  Closes #12
  ```

- Indicar mudanças que quebram compatibilidade:

  ```bash
  BREAKING CHANGE: muda a estrutura da resposta da API
  ```

---

[← Voltar (Índice)](../index.md)
