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
            '@app': './src/app',
            '@assets': './src/assets',
            '@components': './src/components',
            '@constants': './src/constants',
            '@docs': './docs',
            '@hooks': './src/hooks',
            '@lib': './src/lib',
            '@services': './src/services',
            '@store': './src/store',
            '@theme': './src/theme',
            '@tests': './src/tests',
          },
        },
      ],
      'expo-router/babel', // Plugin obrigatório para Expo Router
    ],
  };
};
