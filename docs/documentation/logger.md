<!-- markdownlint-disable-next-line MD041 -->
[← Voltar (Índice)](../index.md)

# 🧠 logger.ts

O arquivo `src/lib/logger.ts` fornece uma interface simples e segura para exibir logs no console **apenas em ambiente de desenvolvimento**.

---

## 📦 Motivo de uso

Em apps React Native com Expo, o uso de `console.log()` pode ser útil durante o desenvolvimento, mas precisa ser **removido ou controlado** na produção para não:

- Poluir o terminal
- Prejudicar a performance
- Vazamentos acidentais de dados

---

## 🔐 Controle por ambiente

O logger usa `Constants.expoConfig?.extra?.appMode` para verificar se o app está em modo `development`:

```ts
const isDev = Constants.expoConfig?.extra?.appMode === 'development';
```

Assim, logs só são exibidos quando `EXPO_PUBLIC_APP_MODE=development` no `.env`.

---

## 📂 Localização

```bash
src/lib/logger.ts
```

---

## ✅ Funções disponíveis

| Função        | Equivalente               | Quando usar                                       |
|---------------|---------------------------|---------------------------------------------------|
| `logger.log`  | `console.log`             | Mensagens genéricas                               |
| `logger.warn` | `console.warn`            | Alertas não críticos                              |
| `logger.error`| `console.error`           | Mensagens de erro ou falha                        |
| `logger.info` | `console.info`            | Informações técnicas úteis                        |
| `logger.debug`| `console.debug` (exceto Web) | Informações detalhadas (desativado no Web)   |

---

## ✍️ Exemplo de uso

```ts
import { logger } from '@lib/logger';

logger.log('App iniciado com sucesso');
logger.warn('Campo obrigatório não preenchido');
logger.error('Erro ao conectar à API');
```

---

## ⚠️ Dica para produção

Se quiser desativar **completamente** os logs em produção (mesmo se houver erro de configuração), basta alterar:

```ts
const isDev = process.env.NODE_ENV === 'development';
```

---

## 📚 Referências

- [https://docs.expo.dev/versions/latest/sdk/constants/](https://docs.expo.dev/versions/latest/sdk/constants/)
- [https://reactnative.dev/docs/debugging](https://reactnative.dev/docs/debugging)
