// https://docs.expo.dev/guides/using-eslint/
import { defineConfig } from 'eslint/config';
import expoConfig from 'eslint-config-expo/flat';
import '@stylistic/eslint-plugin';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      '@stylistic': '@stylistic/eslint-plugin',
    },
    rules: {
      '@stylistic/indent': ['error', 2],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/semi': ['error', 'never']
    }
  },
  {
    ignores: ['dist/*'],
  },
]);

