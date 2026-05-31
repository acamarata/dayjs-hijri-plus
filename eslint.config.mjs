import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier';
import { typescript } from '@acamarata/eslint-config';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: { '@typescript-eslint': tsPlugin },
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: true, tsconfigRootDir: import.meta.dirname },
    },
  },
  ...typescript.map((cfg) => ({ ...cfg, files: ['**/*.ts', '**/*.tsx'] })),
  eslintConfigPrettier,
  {
    ignores: ['dist/', 'node_modules/', 'test.mjs', 'test-cjs.cjs'],
  },
];
