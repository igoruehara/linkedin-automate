---
name: tasks
description: Decomposição e gates da feature. Puxe ao implementar.
alwaysApply: false
---

# Tasks — setup-extensao (walking skeleton)

> Cada task mapeia para um ou mais `AC-N` e tem um **gate executável**. `[P]` = paralelizável.
> Um commit por task. `done` só quando o gate passa (comandos em `docs/engineering/TESTING.md`).

## Plano
| #  | Task                                                                 | Cobre AC | Depende de | Gate (comando)                          | Status |
|----|----------------------------------------------------------------------|----------|------------|-----------------------------------------|--------|
| 1  | Inicializar projeto WXT + pnpm + TypeScript (`package.json`, `wxt.config.ts`, `tsconfig.json`) | AC-1 | — | `pnpm install && pnpm build`           | **done** |
| 2  | Criar estrutura `src/{domain,application,infrastructure,interfaces}/` com índices placeholder | AC-2 | 1 | `test -d src/domain && pnpm build`     | **done** |
| 3  | Configurar ESLint + Prettier **+ regra de fronteira de camadas** (import boundaries) | AC-2 | 2 | `pnpm lint`                             | **done** |
| 4  | Manifesto: `sidePanel`, content script e `host_permissions` só `*://*.linkedin.com/*` (sem `<all_urls>`) | AC-4, AC-1 | 1 | `pnpm build` + assert no `manifest.json` | **done** |
| 5  | Side panel React com placeholder ("Curador de Perfil" + "Aguardando análise do perfil") | AC-3 | 1 | `pnpm test:e2e`                         | **done** |
| 6  | Stubs do content script e service worker (registrados, **sem** extração) `[P]` | AC-3, AC-4 | 4 | `pnpm build`                           | **done** |
| 7  | Configurar Vitest + 1 teste de unidade no `domain/` (smoke de função pura) | AC-5 | 2 | `pnpm test`                             | **done** |
| 8  | Configurar Playwright + smoke E2E: carrega a extensão, abre o side panel, vê o placeholder (`data-testid`) e **observa a rede** (zero egress a terceiros) | AC-5, AC-3, AC-6 | 5 | `pnpm test:e2e`        | **done** |
| 9  | Confirmar/ajustar `docs/engineering/TESTING.md` (comandos já definidos) + hook `Stop` (lint+test) no `.claude/settings.json` | AC-5 | 3,7,8 | `pnpm lint && pnpm test` | **done** |

## Plano de teste
- **Unidade (Vitest):** ao menos uma função pura em `domain/` (smoke do harness). A massa real vem na feature de Regras.
- **Lint como gate de arquitetura:** a regra de import boundaries é o teste da regra de dependência (AC-2).
- **Aceite/E2E (Playwright):** carrega a extensão num Chromium persistente, valida o placeholder do
  side panel pelo `data-testid` (AC-3) e **observa o tráfego de rede**, falhando em qualquer egress a
  terceiros (AC-6) → cobre AC-5.
- **Build como gate (AC-1/AC-4):** `pnpm build` + asserção sobre o `manifest.json` (MV3, hosts mínimos).

> **AC↔task:** AC-1 → 1,4 · AC-2 → 2,3 · AC-3 → 5,6,8 · AC-4 → 4,6 · AC-5 → 7,8,9 · AC-6 → 8. Sem AC órfão.

## Divergências (SPEC_DEVIATION)
> Se a implementação precisar fugir da spec, registre aqui antes de seguir (ver `CLAUDE.md`).
- [ ] nenhuma até agora

## Checklist de Definition of Done
- [x] Todos os AC verdes **pelo gate executável** (lint · typecheck · vitest · playwright · build)
- [x] Nenhum `SPEC_DEVIATION` pendente
- [x] ADRs de decisões difíceis de reverter registrados (já cobertos: 0002/0003/0005)
- [x] Glossário / context-map atualizados se mudaram (não houve mudança nesta feature)
- [x] Spec reflete o que foi construído
- [x] `docs/STATE.md` atualizado (próximo passo / decisões)
- [x] Invariantes de privacidade/ToS cobertos por **gate executável**: AC-4 (manifesto sem `<all_urls>`)
      + AC-6 (zero egress no E2E), ambos verdes. Revisão extra pelo `privacy-guard` opcional.
