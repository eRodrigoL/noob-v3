// babel.config.js
// Configuração do Babel com suporte ao Expo e aliases personalizados

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          alias: {
            '@app': './app',
            '@assets': './assets',
            '@components': './components',
            '@constants': './constants',
            '@docs': './docs',
            '@hooks': './hooks',
            '@lib': './lib',
            '@services': './services',
            '@store': './store',
            '@theme': './theme',
            '@tests': './tests',
            '@utils': './utils',
          },
        },
      ],
      'expo-router/babel', // Plugin obrigatório para Expo Router
    ],
  };
};
