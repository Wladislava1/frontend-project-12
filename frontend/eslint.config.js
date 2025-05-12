import babelEslintParser from '@babel/eslint-parser'
import stylistic from '@stylistic/eslint-plugin'
import stylisticJsx from '@stylistic/eslint-plugin-jsx'
import importPlugin from 'eslint-plugin-import'
import reactPlugin from 'eslint-plugin-react'
import globals from 'globals'

export default [
  {
    ignores: ['dist/', 'node_modules/'],
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: babelEslintParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react', '@babel/preset-env'],
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.jest,
      },
    },
    plugins: {
      '@stylistic': stylistic,
      '@stylistic/jsx': stylisticJsx,
      'import': importPlugin,
      'react': reactPlugin,
    },
    rules: {
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/keyword-spacing': 'error',
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/jsx-quotes': ['error', 'prefer-double'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/jsx-one-expression-per-line': 'error',
      '@stylistic/jsx-closing-tag-location': 'error',
      '@stylistic/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
      '@stylistic/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }],
      '@stylistic/jsx-closing-bracket-location': 'error',
      '@stylistic/jsx-tag-spacing': 'error',
      '@stylistic/eol-last': 'error',
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/semi': ['error', 'never'],
      'no-console': 'off',
      'react/react-in-jsx-scope': 'off',
      'import/extensions': 'off',
    },
  },
]
