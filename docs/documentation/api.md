<!-- markdownlint-disable-next-line MD041 -->
[← Voltar (Índice)](../index.md)

# 🌐 apiClient.ts

O arquivo `src/services/apiClient.ts` centraliza toda a comunicação com a API, usando `axios`.

---

## 🌍 Base URL

A URL base é definida via `.env` com a variável `EXPO_PUBLIC_API_BASE_URL`. Ela é lida em tempo de execução via:

```ts
Constants.expoConfig?.extra?.apiBaseUrl
```

---

## 🔁 Retry automático

A biblioteca `axios-retry` está configurada para tentar até **5 vezes**, com atraso exponencial:

```ts
axiosRetry(apiClient, {
  retries: 5,
  retryDelay: axiosRetry.exponentialDelay,
});
```

---

## 🛡️ Interceptor global

Intercepta todas as respostas da API. Se o erro estiver relacionado a token inválido (ex: "jwt expirado"), realiza:

1. Exibição de `Toast` avisando que a sessão expirou
2. Limpeza do `AsyncStorage` (`token`, `userId`)
3. Redirecionamento para `ROUTES.HOME`

---

## 🔧 Dependências utilizadas

- `axios`
- `axios-retry`
- `expo-constants`
- `expo-router`
- `react-native-toast-message`
- `@react-native-async-storage/async-storage`

---

## 📌 Local de uso

Você pode importar essa instância em qualquer serviço de API como:

```ts
import { apiClient } from '@services/apiClient';
```

---

## 📚 Referências

- [https://axios-http.com/](https://axios-http.com/)
- [https://github.com/softonic/axios-retry](https://github.com/softonic/axios-retry)
