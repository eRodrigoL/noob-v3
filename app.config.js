// 📄 app.config.js
// Este arquivo define a configuração principal do Expo, podendo usar variáveis de ambiente com dotenv.
import "dotenv/config"; // Carrega as variáveis do arquivo `.env`

export default ({ config }) => ({
  ...config, // Mantém a possibilidade de sobrescrever configurações existentes se necessário

  name: "noob", // Nome do app (exibido em alguns lugares do sistema)
  slug: "noob", // Identificador único do app no Expo
  version: "1.0.0", // Versão do app (sem relação com build number)
  orientation: "default", // Permite rotação conforme o usuário girar o dispositivo
  icon: "./assets/images/ui/icon.png", // Ícone principal (para Android e iOS)
  scheme: "noob", // Esquema URI para links profundos (deep linking)
  userInterfaceStyle: "automatic", // Usa claro/escuro com base no sistema

  splash: {
    // Configuração da tela de splash (abertura)
    image: "./assets/images/ui/splash.png", // Imagem de splash
    resizeMode: "contain", // Ajuste da imagem na tela
    backgroundColor: "#ffffff", // Cor de fundo do splash
  },

  // 🚀 Configuração de atualizações OTA (Over The Air)
  updates: {
    fallbackToCacheTimeout: 0, // Usar cache imediatamente se não conseguir buscar atualizações
  },

  // ✅ Ativa nova arquitetura (aproveita melhorias de desempenho se suportado)
  newArchEnabled: true,

  // 🤖 Configurações específicas para Android
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/ui/adaptive-icon.png", // Ícone adaptável
      backgroundColor: "#FFFFFF", // Cor de fundo do ícone adaptável
    },
  },

  // 🌐 Configurações específicas para Web
  web: {
    bundler: "metro", // Usar Metro como empacotador no build web
    output: "static", // Gera arquivos estáticos para publicação em CDN/Vercel
    favicon: "./assets/images/ui/favicon.png", // Ícone da aba do navegador
  },

  // 🧩 Plugins usados no app
  plugins: [
    "expo-router", // Habilita navegação via arquivos no estilo Next.js
    [
      "expo-splash-screen",
      {
        image: "./assets/images/ui/splash-icon.png", // Ícone exibido na splash screen
        imageWidth: 200, // Largura da imagem (ajustável)
        resizeMode: "contain", // Mantém proporção da imagem
        backgroundColor: "#ffffff", // Cor de fundo da tela de splash
      },
    ],
  ],

  // 🧪 Ativa rotas tipadas no Expo Router
  experiments: {
    typedRoutes: true,
  },

  // 💡 Informações adicionais acessíveis via Constants.expoConfig.extra
  extra: {
    EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL, // URL base da sua API (deve começar com EXPO_PUBLIC_)
    EXPO_PUBLIC_APP_MODE: process.env.EXPO_PUBLIC_APP_MODE || "development", // Modo do app: development / production
  },

  // 📦 Define quais arquivos serão empacotados no build
  assetBundlePatterns: ["**/*"], // Inclui todos os arquivos da pasta `assets/`
});
