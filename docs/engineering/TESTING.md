---
name: TESTING
description: Comandos de gate e convenções de teste. Puxe ao codar, validar ou montar CI.
alwaysApply: false
---

# TESTING — Como verificar o projeto

> **Fonte única dos comandos de gate** e das convenções de teste. É o que o **DoD**, a **CI** e os
> **subagentes** consomem para provar que uma task/feature está pronta — sem inspeção visual.
> Preenchido no kickoff (eixo Qualidade) e mantido vivo.

## Como rodar
| Nível         | Comando                   | Quando |
|---------------|---------------------------|--------|
| Unidade       | `<comando>`               | sempre, rápido |
| Integração    | `<comando>`               | adapters / repos / contratos |
| Aceite (UAT)  | `<comando>`               | um teste por `AC-N` da spec |
| Lint / format | `<comando>`               | pré-commit / CI |
| Cobertura     | `<comando>` (mín. `<X>%`) | CI |

## Convenções
- Pirâmide: muitos testes de unidade, menos de integração, poucos de aceite.
- **Cada `AC-N` da spec tem um teste de aceite que é o seu gate.** Nomeie o teste com o ID
  (`test_AC_1_*` / `AC-1: ...`) para rastreabilidade spec → teste.
- Domínio não sobe infra; integração usa `<testcontainer / mock de borda>`.

## Gates (Definition of Done executável)
- Uma **task** só vira `done` quando o **Gate (comando)** dela em `tasks.md` passa.
- Uma **feature** só faz merge quando todos os AC estão verdes + lint + cobertura mínima.
- A **CI roda exatamente estes comandos** — falhar bloqueia o merge.

## O que a CI executa
<Pipeline em ordem: lint → unidade → integração → aceite → cobertura. Mais a regra SDD:
falhar PR que altera código sem spec aprovada.>
