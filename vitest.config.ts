import { defineConfig } from 'vitest/config';

// Testes de unidade do domínio (puro, sem DOM/infra). E2E fica com o Playwright (e2e/).
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
    exclude: ['e2e/**', 'node_modules/**', '.output/**', '.wxt/**'],
    coverage: {
      provider: 'v8',
      include: ['src/domain/**'],
    },
  },
});
