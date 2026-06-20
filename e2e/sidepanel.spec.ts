import { test, expect, chromium, type BrowserContext } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Aponta para o build da extensão (pnpm build → .output/chrome-mv3).
const extPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.output/chrome-mv3');

async function launch(): Promise<BrowserContext> {
  return chromium.launchPersistentContext('', {
    headless: false,
    args: [`--disable-extensions-except=${extPath}`, `--load-extension=${extPath}`],
  });
}

async function getExtensionId(ctx: BrowserContext): Promise<string> {
  let [sw] = ctx.serviceWorkers();
  if (!sw) sw = await ctx.waitForEvent('serviceworker');
  return new URL(sw.url()).host;
}

test('AC-3/AC-6: side panel mostra o placeholder e não faz egress a terceiros', async () => {
  const ctx = await launch();
  try {
    const extId = await getExtensionId(ctx);

    // AC-6: observa a rede — registra qualquer egress que não seja LinkedIn ou a própria extensão.
    const offenders: string[] = [];
    ctx.on('request', (req) => {
      const u = new URL(req.url());
      const allowed =
        u.protocol === 'chrome-extension:' ||
        u.protocol === 'data:' ||
        u.protocol === 'blob:' ||
        u.hostname === '' ||
        u.hostname.endsWith('linkedin.com');
      if (!allowed) offenders.push(u.href);
    });

    const page = await ctx.newPage();
    await page.goto(`chrome-extension://${extId}/sidepanel.html`);

    // AC-3: localiza pelo data-testid estável e confere a cópia esperada.
    const root = page.getByTestId('curadoria-placeholder');
    await expect(root).toBeVisible();
    await expect(root).toContainText('Curador de Perfil');
    await expect(root).toContainText('Aguardando análise do perfil');

    // AC-6: nenhuma requisição saiu para terceiros durante o carregamento.
    expect(offenders, `egress a terceiros detectado: ${offenders.join(', ')}`).toEqual([]);
  } finally {
    await ctx.close();
  }
});
