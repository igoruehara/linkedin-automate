---
name: STATE
description: Memória de trabalho volátil — onde paramos, próximo passo, bloqueios.
alwaysApply: true
---

# STATE — Memória viva do projeto

> Memória de trabalho **entre sessões** (humanos e agentes). É **volátil**: atualizada o tempo
> todo. Diferente do **ADR** (decisão durável e imutável). Decisão estrutural → ADR; estado do
> trabalho → aqui. Atualize ao **pausar/encerrar**; leia ao **retomar**. Use a skill `/handoff`.

**Última atualização:** 2026-06-20 por Igor

## Em andamento / próximo passo
> O que está aberto agora e a **próxima ação concreta** (não "continuar a feature" — diga o passo).
- **Kickoff concluído** — constituição do projeto gerada (vision, personas, jornadas, features, MVP,
  context-map, glossary, overview, CLAUDE.md, ADRs 0002–0005, roadmap).
- **Camada agêntica concluída** (2026-06-20) — 6 subagentes em `.claude/agents/` (spec-reviewer,
  vitest-tester, dom-extraction-auditor, privacy-guard, adr-writer, domain-modeler) + allowlist no
  `.claude/settings.json`. Hook `Stop` e CI adiados (ver roadmap). Mapa em `docs/engineering/agentic-layer.md`.
- **Diagramas gerados** (2026-06-20) — `docs/architecture/diagrams.md`: contexto (C4 L1), containers
  (C4 L2), mapa de bounded contexts (DDD) e fluxo-chave diagnóstico+reescrita (sequenceDiagram). Mermaid validado.
- Feature ativa: **nenhuma ainda**.
- **Próximo passo:** `git init` + commit da fundação; depois abrir a **1ª feature** com
  `/nova-feature` → *Scaffolding da extensão (WXT + React + side panel "hello") + hook `Stop`*.

## Decisões recentes
> Resumo cronológico. Se for difícil de reverter, vire um ADR e linke aqui.
- 2026-06-20: Extensão cross-browser WXT + React (MV3, side panel) — [ADR-0002](architecture/adr/0002-extensao-cross-browser-wxt-react.md)
- 2026-06-20: Extração via DOM com Anti-Corruption Layer (sem API oficial) — [ADR-0003](architecture/adr/0003-extracao-via-dom-com-acl.md)
- 2026-06-20: Motor híbrido — Regras no domínio + IA só na Reescrita (default Claude) — [ADR-0004](architecture/adr/0004-motor-hibrido-regras-mais-ia.md)
- 2026-06-20: Privacidade-first — BYOK, cliente-only, zero telemetria — [ADR-0005](architecture/adr/0005-byok-privacidade-cliente.md)
- 2026-06-20: MVP = Pontuação + Checklist + Reescrita de Headline/"Sobre"; PT+EN; Chrome primeiro.

## Bloqueios
- [ ] Nenhum bloqueio. (Decisões pendentes de baixo risco: nome/marca open source definitivo; licença — proposta MIT.)

## Ideias adiadas / backlog técnico
- Reporte de erro **opt-in anônimo** → reconsiderar na Onda 3 (sinal de bugs sem ferir privacidade).
- **Multi-provedor de LLM** (OpenAI, modelo local) → quando houver demanda da comunidade.
- **Histórico de Pontuação** (local) → após o MVP validar o diagnóstico.
- **Safari** (empacotamento Xcode) → Onda 3, exige macOS.

## Todos soltos
- [ ] Escolher nome/marca open source (substituir "Curador de Perfil" provisório).
- [ ] Confirmar licença (proposta: MIT) e adicionar `LICENSE`.
- [ ] Rodar `/setup-ci` para o pipeline de build/test (complementa o gate `esteira.yml`).
- [ ] Rodar `/integracoes` se/quando ferramental do time (GitHub etc.) entrar no fluxo.

> Spec da feature ativa: veja "Em andamento" no STATE e leia `specs/NNNN-*/spec.md`.
