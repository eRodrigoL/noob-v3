// 📄 app.config.js
import 'dotenv/config';

export default ({ config }) => ({
  ...config,

  name: 'noob',
  slug: 'noob',
  owner: 'erodrigol',
  version: '1.0.0',
  orientation: 'default',
  icon: './assets/images/ui/icon.png',
  scheme: 'noob',
  userInterfaceStyle: 'automatic',

  splash: {
    image: './assets/images/ui/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },

  updates: {
    fallbackToCacheTimeout: 0,
  },

  newArchEnabled: true,

  android: {
  package: "com.erodrigol.noob",
  adaptiveIcon: {
    foregroundImage: "./assets/images/ui/adaptive-icon.png",
    backgroundColor: "#FFFFFF",
  },
},

  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/ui/favicon.png',
  },

  plugins: [
  'expo-router',
  [
    'expo-splash-screen',
    {
      image: './assets/images/ui/splash-icon.png',
      imageWidth: 200,
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
  ],
  'expo-web-browser',
],
    experiments: {
    typedRoutes: true,
  },

  extra: {
    EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
    EXPO_PUBLIC_APP_MODE: process.env.EXPO_PUBLIC_APP_MODE || 'development',
    APP_SECRET: process.env.APP_SECRET,

    // 👇 Adicione esta parte manualmente
    eas: {
      projectId: '3fcbed8a-058d-4d94-9ef3-7fde8c930bf5',
    },
  },

  assetBundlePatterns: ['**/*'],
});
