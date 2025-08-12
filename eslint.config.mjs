// @ts-check

import { globalIgnores } from 'eslint/config'
import typescript from 'typescript-eslint'
import * as tsParser from '@typescript-eslint/parser'
import markdown from '@eslint/markdown'

export default typescript.config(
  globalIgnores(['**/bin', '**/cache', '**/tsdown.config.ts']),
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./packages/*/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': typescript.plugin,
    },
    rules: {
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/no-useless-empty-export': 'error',
    },
  },
  {
    files: ['**/*.md'],
    plugins: { markdown },
    language: 'markdown/gfm',
    extends: [markdown.configs.recommended],
  },
)
