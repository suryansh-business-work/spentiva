const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettier = require('eslint-config-prettier');

module.exports = defineConfig([
  expoConfig,
  prettier,
  {
    ignores: ['dist/*', 'android/*', 'ios/*', '.expo/*', '.tamagui/*', 'src/gql/*', 'src/components/chart/chartjs.generated.ts'],
  },
  {
    rules: {
      'react/prop-types': 'off',
    },
  },
  {
    files: ['scripts/**/*.js', 'plugins/**/*.js', '*.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { __dirname: 'readonly', require: 'readonly', module: 'writable', process: 'readonly', console: 'readonly' },
    },
  },
]);
