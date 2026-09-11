module.exports = function (api) {
  api.cache(true);
  const tamagui = process.env.TAMAGUI_COMPILER !== '0';
  return {
    presets: ['babel-preset-expo'],
    plugins: tamagui
      ? [
          [
            '@tamagui/babel-plugin',
            {
              components: ['tamagui'],
              config: './tamagui.config.ts',
              logTimings: false,
              disableExtraction: process.env.NODE_ENV === 'development',
            },
          ],
        ]
      : [],
  };
};
