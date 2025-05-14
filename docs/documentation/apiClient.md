<!-- markdownlint-disable-next-line MD041 -->
[← Voltar (Índice)](../index.md)

# 🌐 apiClient.ts

O `apiClient.ts` é o ponto central de comunicação com a API. Ele encapsula o `axios`, adiciona retry automático e interceptores para lidar com autenticação.

---

## 🧱 Base técnica

- **Linguagem**: TypeScript
- **Framework**: React Native (Expo)
- **Ferramentas**:
  - `axios` para requisições HTTP
  - `axios-retry` para tolerância a falhas
  - `expo-constants` para carregar variáveis do `app.config.js`
  - `expo-router` para navegação automática
  - `AsyncStorage` para persistência
  - `Toast` para mensagens visuais

---

## 📂 Localização

```bash
src/services/apiClient.ts
```

---

## 🧰 O que está implementado

### 🔗 Instância Axios

```ts
export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

---

### 🔁 Retry automático

```ts
axiosRetry(apiClient, {
  retries: 5,
  retryDelay: axiosRetry.exponentialDelay,
});
```

Isso garante que erros temporários (como falta de conexão) sejam automaticamente tratados.

---

### 🛡️ Interceptor de token expirado

Intercepta respostas que contenham mensagens como `token inválido` ou `jwt expirado`:

1. Exibe um `Toast` de sessão expirada
2. Limpa o `AsyncStorage` (`token`, `userId`)
3. Redireciona o usuário para `ROUTES.HOME`

```ts
if (isTokenError) {
  Toast.show({ type: 'error', text1: 'Sessão expirada' });
  await AsyncStorage.multiRemove(['token', 'userId']);
  router.replace(ROUTES.HOME);
}
```

---

## 📚 Como usar

```ts
import { apiClient } from '@services/apiClient';

apiClient.get('/usuarios/123');
apiClient.post('/login', { email, senha });
```

---

## 🧩 Próximos passos recomendados

- Criar serviços específicos (ex: `services/users.ts`, `services/games.ts`) que usam `apiClient`
- Centralizar o token com `interceptors.request` no futuro

---

## 📚 Referências

- [https://axios-http.com/](https://axios-http.com/)
- [https://github.com/softonic/axios-retry](https://github.com/softonic/axios-retry)
- [https://docs.expo.dev/versions/latest/sdk/constants/](https://docs.expo.dev/versions/latest/sdk/constants/)
