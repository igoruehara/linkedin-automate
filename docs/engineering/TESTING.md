---
name: TESTING
description: Comandos de gate e convenções de teste. Puxe ao codar, validar ou montar CI.
alwaysApply: false
---

# TESTING — Como verificar o projeto

> **Fonte única dos comandos de gate** e das convenções de teste. É o que o **DoD**, a **CI** e os
> **subagentes** consomem para provar que uma task/feature está pronta — sem inspeção visual.
> Preenchido no kickoff (eixo Qualidade) e mantido vivo. Stack: WXT + React + Vitest + Playwright (pnpm).

## Como rodar
| Nível         | Comando                       | Quando |
|---------------|-------------------------------|--------|
| Unidade       | `pnpm test`                   | sempre, rápido — Regras/Pontuação e funções puras do `domain/` (Vitest) |
| Integração    | `pnpm test`                   | adapters/ACL — Extração contra **fixtures de HTML** (PT/EN) em `infrastructure/` |
| Aceite (UAT)  | `pnpm test:e2e`               | um teste por `AC-N` que precisa do navegador — carrega a extensão (Playwright) |
| Lint / format | `pnpm lint` / `pnpm format`   | pré-commit / CI / hook `Stop` |
| Build (gate)  | `pnpm build`                  | prova que a extensão empacota (MV3) — alvo de ACs de manifesto |
| Cobertura     | `pnpm test --coverage` (alvo mín. **80% no `domain/`**) | CI |

> Os scripts acima são materializados pela feature `specs/0002-setup-extensao/` (task 1 e 9). Esta
> tabela é a **fonte canônica** que a spec e a CI referenciam — mantenha-a fiel ao `package.json`.

## Convenções
- Pirâmide: muitos testes de unidade (domínio puro), menos de integração (ACL/fixtures), poucos de aceite (E2E).
- **Cada `AC-N` da spec tem um teste de aceite que é o seu gate.** Nomeie o teste com o ID
  (`AC-1: ...`) para rastreabilidade spec → teste.
- Domínio **não sobe infra nem toca DOM/SDK**; integração usa **fixtures de HTML** salvas; E2E usa a
  extensão carregada num Chromium persistente.
- **Privacidade é testável:** o E2E observa a rede e **falha** se houver requisição a host que não
  seja `*.linkedin.com` (ou, quando existir, o Provedor de LLM sob ação explícita) — ver
  [ADR-0005](../architecture/adr/0005-byok-privacidade-cliente.md).

## Gates (Definition of Done executável)
- Uma **task** só vira `done` quando o **Gate (comando)** dela em `tasks.md` passa.
- Uma **feature** só faz merge quando todos os AC estão verdes + `pnpm lint` + cobertura mínima.
- A **CI roda exatamente estes comandos** — falhar bloqueia o merge.

## O que a CI executa
Ordem da pipeline (a montar via `/setup-ci`):
1. `pnpm lint` (inclui a **regra de fronteira de camadas** — domínio não importa para fora)
2. `pnpm test` (unidade + integração, Vitest) com cobertura
3. `pnpm test:e2e` (Playwright — aceite/E2E)
4. `pnpm build` (empacota a extensão MV3)
5. `node scripts/audit-esteira.mjs .` + `node scripts/validate-mermaid.mjs .` (gate da esteira — `esteira.yml`)
- Regra SDD: **falhar PR que altera código sem spec aprovada** (a configurar no `/setup-ci`).
