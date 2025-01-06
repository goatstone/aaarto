const globals = require('globals');
const pluginJs = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const parser = require('@typescript-eslint/parser');
const pluginReact = require('eslint-plugin-react');

module.exports = [
  {
    files: ['src/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: { globals: globals.browser },
    rules: {
      semi: ['error', 'always'],
    },
  },
  {
    files: ['src/**/*.{js,mjs,cjs}'],
    ...pluginJs.configs.recommended,
  },
  {
    files: ['src/**/*.ts?(x)'],
    languageOptions: {
      parser: parser,
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
    },
  },
  {
    files: ['src/**/*.{jsx,tsx}'],
    plugins: {
      react: pluginReact,
    },
    settings: {
      react: {
        version: 'detect', // Automatically detects the React version
      },
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
    },
  },
];
