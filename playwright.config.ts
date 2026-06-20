import { defineConfig } from '@playwright/test';

// E2E que carrega a extensão num Chromium persistente (ver e2e/sidepanel.spec.ts).
// Extensões MV3 exigem contexto persistente headed; cada teste lança o navegador por conta própria.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  timeout: 30_000,
});
