// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

// Flat config (ESLint 10). A regra de fronteira de camadas (DDD) materializa a regra de
// dependência do src/README.md: as setas apontam só para dentro (AC-2 da spec 0002).
export default tseslint.config(
  {
    // Lint cobre o código da extensão (src/, e2e/, configs de raiz). A tooling SDD vendada
    // (scripts Node e hooks) não é policiada por este lint — tem seu próprio gate (esteira.yml).
    ignores: [
      '.output/**',
      '.wxt/**',
      'node_modules/**',
      'dist/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'scripts/**',
      '.claude/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // domain/ não importa de NENHUMA outra camada, nem de framework/UI/IO.
  {
    files: ['src/domain/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '**/application/**',
                '**/infrastructure/**',
                '**/interfaces/**',
                '**/entrypoints/**',
              ],
              message:
                'domain/ não pode importar de outras camadas — a dependência aponta só para dentro.',
            },
            {
              group: ['react', 'react-dom', 'wxt', 'wxt/*', '#imports'],
              message: 'domain/ não pode depender de framework, UI ou APIs de extensão.',
            },
          ],
        },
      ],
    },
  },

  // application/ depende só de domain/ (não de infrastructure/interfaces).
  {
    files: ['src/application/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/infrastructure/**', '**/interfaces/**', '**/entrypoints/**'],
              message: 'application/ só depende de domain/.',
            },
          ],
        },
      ],
    },
  },

  prettier,
);
