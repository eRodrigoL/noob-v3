<!-- markdownlint-disable-next-line MD041 -->
[← Voltar (Índice)](../index.md)

# 🌐 Deploy Web com Vercel

Esta aplicação Expo foi configurada para ser publicada como site estático (SPA) utilizando a plataforma [Vercel](https://vercel.com/).

---

## ✅ Requisitos atendidos

- Projeto criado com **Expo + TypeScript + Expo Router**
- Geração de build web com **output static**
- Repositório hospedado no GitHub
- Conta ativa na [Vercel](https://vercel.com/)
- Pasta `dist/` gerada por `expo export --platform web`

---

## ⚙️ Configurações no projeto

### 1. `package.json`

Foi adicionado o script de build:

```json
"scripts": {
  "build:web": "expo export --platform web"
}
```

---

### 2. `app.config.js`

O campo `web` foi configurado com:

```js
web: {
  bundler: 'metro',
  output: 'static',
  favicon: './assets/images/ui/favicon.png',
},
```

---

### 3. Arquivo `vercel.json`

Criado com as configurações:

```json
{
  "buildCommand": "npm run build:web",
  "outputDirectory": "dist",
  "framework": null,
  "cleanUrls": true,
  "rewrites": [
    {
      "source": "/:path*",
      "destination": "/index.html"
    }
  ]
}
```

---

## 🚀 Etapas realizadas na Vercel

### 1. Projeto criado na plataforma

- O projeto foi iniciado via [https://vercel.com/new](https://vercel.com/new).
- O repositório (`noob-v3`) foi selecionado como origem.
- As configurações utilizadas foram:
  - **Framework Preset**: `Other`
  - **Build Command**: `npm run build:web`
  - **Output Directory**: `dist`

---

### 2. Domínio personalizado configurado

- O domínio (`noob.app.br`) foi adicionado em **Settings > Domains**.
- A verificação DNS foi realizada com sucesso.
- O domínio foi definido como principal para o projeto.

---

## 💡 Observações

- A build gera arquivos estáticos com rotas como SPA.
- As `rewrites` garantem que o Expo Router trate a navegação corretamente na web.
- Todo o processo foi feito com base na exportação estática (`expo export --platform web`) com Metro bundler (sem Webpack).

---

## 📚 Referências

- [https://docs.expo.dev/](https://docs.expo.dev/)
- [https://vercel.com/docs](https://vercel.com/docs)
