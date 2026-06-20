---
name: tasks
description: Decomposição e gates da feature. Puxe ao implementar.
alwaysApply: false
---

# Tasks — extrair-perfil

> Cada task mapeia para um ou mais `AC-N` e tem um **gate executável**. `[P]` = paralelizável.
> Um commit por task. `done` só quando o gate passa (comandos em `docs/engineering/TESTING.md`).

## Plano
| #  | Task                                                                            | Cobre AC | Depende de | Gate (comando)        | Status |
|----|---------------------------------------------------------------------------------|----------|------------|-----------------------|--------|
| 1  | Modelar agregado `Perfil` + VOs (`Seção`, `TipoDeSeção`, `EstadoDaSeção`, `Conteúdo`) + invariantes em `domain/perfil/` | AC-1,3,4,6,8 | — | `pnpm test` | **done** |
| 2  | Definir porta `ExtratorDePerfil` + caso de uso `ExtrairPerfilDaPagina` (`application/`) | AC-1 | 1 | `pnpm test` | **done** |
| 3  | Configurar jsdom no Vitest p/ testes de `infrastructure/` (env por pasta) `[P]` | AC-1 | — | `pnpm test` | todo |
| 4  | Coletar **fixtures** PT/EN (completo, sem-sobre, sobre-vazio, sobre-recolhido, com/sem-foto) **+ golden `*.expected.json`** (oráculo dos valores) | AC-1..6 | — | revisão + `pnpm test` | todo |
| 5  | ACL `ExtratorDomLinkedin`: seletores + detecção de idioma (PT/EN → chaves canônicas) | AC-1,2 | 1,2,3,4 | `pnpm test` | todo |
| 6  | ACL: mapear `EstadoDaSeção` (presente/vazia/ausente) pela matriz de decisão | AC-3,4 | 5 | `pnpm test` | todo |
| 7  | ACL: estratégia "ver mais" — texto pleno do nó + expandir recolhido | AC-5 | 5 | `pnpm test` + `pnpm test:e2e` | todo |
| 8  | ACL: Foto real vs placeholder | AC-6 | 5 | `pnpm test` | todo |
| 9  | Wire content script chama `ExtrairPerfilDaPagina` (sem enviar nada) + E2E leitura/zero egress | AC-7 | 5 | `pnpm test:e2e` | todo |
| 10 | Atualizar `glossary` + `context-map` + checagem `privacy-guard` (ADR-0006) | AC-7,8 | 9 | `node scripts/audit-esteira.mjs .` | todo |

## Plano de teste
- **Unidade (Vitest, env node):** invariantes do `Perfil` e dos VOs no `domain/` (AC-1,3,4,6,8).
- **Integração (Vitest + jsdom):** o ACL contra as **fixtures** PT/EN — um caso por linha da matriz e por AC.
- **Aceite/E2E (Playwright):** "ver mais" no DOM vivo (AC-5) e leitura passiva sem egress (AC-7).
- **Lint de fronteira:** `domain/perfil` não importa DOM/infra (AC-8).

## Divergências (SPEC_DEVIATION)
- [ ] nenhuma até agora

## Checklist de Definition of Done
- [ ] Todos os AC verdes **pelo gate executável** (não por inspeção)
- [ ] Nenhum `SPEC_DEVIATION` pendente
- [ ] ADR-0006 aceito; decisões de extração refletidas
- [ ] `docs/glossary.md` e `docs/architecture/context-map.md` atualizados (Perfil/Seção/TipoDeSeção)
- [ ] Spec reflete o que foi construído
- [ ] `docs/STATE.md` atualizado
- [ ] `privacy-guard` revisou: zero egress, sem ação de escrita, expandir-UI conforme ADR-0006 (AC-7)
- [ ] `dom-extraction-auditor` revisou os seletores e as fixtures (PT/EN)
