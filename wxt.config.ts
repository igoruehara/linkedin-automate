import { defineConfig } from 'wxt';

// Config do WXT. As camadas DDD e os entrypoints vivem em `src/` (ver src/README.md).
// O side panel é detectado pelo entrypoint `src/entrypoints/sidepanel/` (WXT adiciona a permissão).
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Curador de Perfil (LinkedIn)',
    description:
      'Curadoria do seu perfil do LinkedIn — score, checklist e reescrita. Open source, privacidade-first.',
    // Permissões MÍNIMAS — só LinkedIn (AC-4). NUNCA usar <all_urls> (ADR-0005/0003).
    host_permissions: ['*://*.linkedin.com/*'],
  },
});
