---
name: STATE
description: Memória de trabalho volátil — onde paramos, próximo passo, bloqueios.
alwaysApply: true
---

# STATE — Memória viva do projeto

> Memória de trabalho **entre sessões** (humanos e agentes). É **volátil**: atualizada o tempo
> todo. Diferente do **ADR** (decisão durável e imutável). Decisão estrutural → ADR; estado do
> trabalho → aqui. Atualize ao **pausar/encerrar**; leia ao **retomar**. Use a skill `/handoff`.

**Última atualização:** 2026-06-20 por Igor — **0003 PAUSADA** após tasks #1–#2 (aguarda amostra de HTML real)

## Em andamento / próximo passo
> O que está aberto agora e a **próxima ação concreta** (não "continuar a feature" — diga o passo).
- **Kickoff concluído** — constituição do projeto gerada (vision, personas, jornadas, features, MVP,
  context-map, glossary, overview, CLAUDE.md, ADRs 0002–0005, roadmap).
- **Camada agêntica concluída** (2026-06-20) — 6 subagentes em `.claude/agents/` (spec-reviewer,
  vitest-tester, dom-extraction-auditor, privacy-guard, adr-writer, domain-modeler) + allowlist no
  `.claude/settings.json`. Hook `Stop` e CI adiados (ver roadmap). Mapa em `docs/engineering/agentic-layer.md`.
- **Diagramas gerados** (2026-06-20) — `docs/architecture/diagrams.md`: contexto (C4 L1), containers
  (C4 L2), mapa de bounded contexts (DDD) e fluxo-chave diagnóstico+reescrita (sequenceDiagram). Mermaid validado.
- **Git inicializado e publicado** (2026-06-20) — repo em https://github.com/igoruehara/linkedin-automate
  (branch `main`, commit `f154acc`). Identidade local: igoruehara / igornoriaqui@gmail.com.
- **Feature `0002-setup-extensao`: IMPLEMENTADA e COMMITADA** (`2a5ce9c`, sobre o `f154acc`).
  Walking skeleton WXT + React, AC-1..AC-6 verdes. Hook `Stop` (lint+test) ativo. **Não foi feito push.**
- **Feature ativa: `0003-extrair-perfil` (Arquitetural) — spec ABERTA / DoR cumprido.** Artefatos:
  product, design, domain, spec (8 ACs), tasks (10). **ADR-0006** criado (expandir UI = leitura, refina o
  ADR-0003). Glossário semeado (Perfil/Seção/TipoDeSeção/EstadoDaSeção/Conteúdo/Idioma/ExtratorDePerfil).
  Decisões: jsdom p/ testes do ACL; chaves canônicas neutras de idioma; núcleo de 6 Seções.
- **0003 em implementação:** **tasks #1 e #2 done** — agregado `Perfil` (`domain/perfil/`: Idioma,
  TipoDeSecao, EstadoDaSecao, Conteudo, Secao, Perfil + invariantes) e porta `ExtratorDePerfil` +
  caso de uso `ExtrairPerfilDaPagina` (`application/extracao/`). 12 testes verdes; lint/typecheck OK.
  **Nada commitado ainda.** Identificadores em ASCII (TipoDeSecao), termo acentuado fica nos docs.
- **BLOQUEIO para tasks #4–#9:** o ACL (seletores) e as fixtures precisam de **HTML real de perfil
  do LinkedIn** (PT/EN). Não dá para inventar seletores. Decisão pendente do Igor: (a) salvar o HTML
  do próprio perfil e fornecer, ou (b) seguir com fixtures representativas marcadas como provisórias
  (a calibrar depois com o `dom-extraction-auditor`).
- **PAUSADA conscientemente** (decisão do Igor): commit do progresso e retomar quando houver a amostra.
- **Como retomar a 0003 (passo a passo):**
  1. Capturar a amostra real: no perfil logado, DevTools Console → `copy(document.querySelector('main').outerHTML)`
     → salvar como `amostra-perfil.html` (deixar **fora do git** — contém PII). Idealmente PT e EN.
  2. Task #3: adicionar `jsdom` (devDep) + `// @vitest-environment jsdom` nos testes de `infrastructure/`.
  3. Task #4: derivar das amostras as fixtures **anonimizadas** (dados fake, estrutura real) + golden `*.expected.json`.
  4. Tasks #5–#8: implementar o ACL `ExtratorDomLinkedin` em `src/infrastructure/extracao/` (seletores,
     idioma→chaves canônicas, EstadoDaSecao, "ver mais" com predicado do AC-5, Foto).
  5. Tasks #9–#10: wire no content script (chama `ExtrairPerfilDaPagina`, sem egress) + E2E zero egress;
     rodar `privacy-guard` e `dom-extraction-auditor`; atualizar DoD.
- **Toolchain/decisões de impl.:** pnpm via `npm i -g pnpm` (10.34.4). WXT 0.20.26 / Vite 8 / React 19 /
  eslint 10 / vitest 4 / playwright 1.61. `srcDir: 'src'`; entrypoints finos em `src/entrypoints/`
  delegam para `src/interfaces/`. `tsconfig` precisou de `jsx: react-jsx` (o `.wxt/tsconfig` não o injeta).
  Lint ignora a tooling SDD vendada (`scripts/**`, `.claude/**`).

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
