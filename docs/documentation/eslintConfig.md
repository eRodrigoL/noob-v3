<!-- markdownlint-disable-next-line MD041 -->
[← Voltar (Índice)](../index.md)

# 🔍 Configuração do ESLint

O ESLint é uma ferramenta de análise estática para identificar e corrigir problemas no código JavaScript/TypeScript.

---

## 📦 Instalação

Usamos o novo formato Flat Config do ESLint v9+, com as seguintes dependências:

```bash
npm install --save-dev eslint eslint-config-prettier eslint-plugin-prettier
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install --save-dev eslint-plugin-react eslint-plugin-react-native eslint-plugin-import eslint-plugin-jsx-a11y
```

---

## 📁 Arquivo `eslint.config.js`

Utiliza o novo formato Flat Config, suportando:

- TypeScript
- React Native
- Prettier (sem conflitos)
- Acessibilidade (`jsx-a11y`)
- Plugins para imports e ambiente Expo

Além disso, ignora automaticamente arquivos como:

```plaintext
node_modules/
dist/
build/
.expo/
assets/
coverage/
scripts/
```

---

## 🧪 Scripts disponíveis

```json
"scripts": {
  "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
  "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix"
}
```

Para rodar o lint:

```bash
npm run lint
```

---

## 📚 Referências

- [https://eslint.org/docs/latest/use/configure](https://eslint.org/docs/latest/use/configure)
- [https://typescript-eslint.io/](https://typescript-eslint.io/)
