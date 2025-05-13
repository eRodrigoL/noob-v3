// babel.config.js
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
    ],
  };
};
