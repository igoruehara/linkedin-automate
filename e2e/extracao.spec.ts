import { test, expect, chromium, type BrowserContext } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import path from 'node:path';

// Build da extensão (pnpm build → .output/chrome-mv3) e a fixture servida como página do LinkedIn.
const dir = path.dirname(fileURLToPath(import.meta.url));
const extPath = path.resolve(dir, '../.output/chrome-mv3');
const fixtureHtml = readFileSync(path.resolve(dir, 'fixtures/perfil-linkedin.html'), 'utf-8');

async function launch(): Promise<BrowserContext> {
  return chromium.launchPersistentContext('', {
    headless: false, // MV3 exige contexto persistente headed
    args: [
      `--disable-extensions-except=${extPath}`,
      `--load-extension=${extPath}`,
      // silencia tráfego de fundo do próprio Chrome p/ não poluir a checagem de egress
      '--disable-background-networking',
      '--disable-component-update',
      '--disable-sync',
      '--no-first-run',
      '--no-default-browser-check',
    ],
  });
}

test('AC-7: content script extrai o Perfil em leitura passiva, sem egress a terceiros', async () => {
  const ctx = await launch();
  try {
    // Observa a rede: registra qualquer egress que não seja LinkedIn/CDN ou a própria extensão.
    const offenders: string[] = [];
    ctx.on('request', (req) => {
      const u = new URL(req.url());
      const allowed =
        u.protocol === 'chrome-extension:' ||
        u.protocol === 'data:' ||
        u.protocol === 'blob:' ||
        u.hostname === '' ||
        u.hostname.endsWith('linkedin.com') ||
        u.hostname.endsWith('licdn.com');
      if (!allowed) offenders.push(u.href);
    });

    const page = await ctx.newPage();
    // Serve a fixture na URL do perfil; qualquer outro request é cortado (204) p/ não tocar a rede.
    await page.route('**/*', (route) =>
      route.request().url().includes('/in/teste-curador')
        ? route.fulfill({ contentType: 'text/html; charset=utf-8', body: fixtureHtml })
        : route.fulfill({ status: 204, body: '' }),
    );

    await page.goto('https://www.linkedin.com/in/teste-curador/');

    // Sinal de que a Extração rodou: marcador local não-PII posto pelo content script (sempre "6").
    await page.waitForFunction(() => document.documentElement.dataset.curadorSecoes === '6', null, {
      timeout: 15_000,
    });
    expect(await page.evaluate(() => document.documentElement.dataset.curadorErro)).toBeUndefined();

    // AC-7: nenhuma requisição saiu para terceiros durante a Extração.
    expect(offenders, `egress a terceiros detectado: ${offenders.join(', ')}`).toEqual([]);
  } finally {
    await ctx.close();
  }
});
