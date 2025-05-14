<!-- markdownlint-disable-next-line MD041 -->
[← Voltar (Índice)](../index.md)

# 🎨 Configuração do Prettier

O Prettier é uma ferramenta de formatação automática de código usada para manter um estilo consistente em todo o projeto.

---

## 📦 Instalação

O Prettier já está incluído nas dependências do projeto:

```bash
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

---

## ⚙️ Arquivo `.prettierrc`

Este arquivo define as regras de formatação:

```json
{
  "arrowParens": "always",
  "bracketSameLine": true,
  "endOfLine": "lf",
  "semi": true,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

---

## 🚫 Arquivo `.prettierignore`

Evita que arquivos irrelevantes sejam formatados automaticamente:

```plaintext
node_modules
ios
android
.expo
.expo-shared
.vscode
.git
.env
assets
*.config.js
package-lock.json
yarn.lock
```

---

## 📜 Scripts disponíveis

No `package.json`, foram definidos os seguintes comandos:

```json
"scripts": {
  "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,md}\""
}
```

Para formatar todos os arquivos:

```bash
npm run format
```

---

## 📚 Referências

- [https://prettier.io/docs/en/options.html](https://prettier.io/docs/en/options.html)
