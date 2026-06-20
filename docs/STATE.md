---
name: STATE
description: Memória de trabalho volátil — onde paramos, próximo passo, bloqueios.
alwaysApply: true
---

# STATE — Memória viva do projeto

> Memória de trabalho **entre sessões** (humanos e agentes). É **volátil**: atualizada o tempo
> todo. Diferente do **ADR** (decisão durável e imutável). Decisão estrutural → ADR; estado do
> trabalho → aqui. Atualize ao **pausar/encerrar**; leia ao **retomar**. Use a skill `/handoff`.

**Última atualização:** 2026-06-20 por Igor — **0003**: andaime do ACL pronto (tasks #1–#6,#8 done, seletores/fixtures PROVISÓRIOS); faltam #7/#9 (E2E) e #10 + recalibração com HTML real

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
- **0003 em implementação — tasks #1,#2,#3,#4,#5,#6,#8 done; commitadas** (`04a5da3` #1–#2; `6c83873`
  jsdom #3; `20c3b1c` ACL #4–#6,#8). 19 testes verdes; lint/typecheck OK. **(branch ainda sem push.)**
  - #1/#2: agregado `Perfil` (`domain/perfil/`) + porta `ExtratorDePerfil` + caso de uso `ExtrairPerfilDaPagina`.
  - #3: `jsdom` (devDep) via docblock `// @vitest-environment jsdom`; default do Vitest segue `node`.
  - #4: fixtures PT/EN em `src/infrastructure/extracao/fixtures/` (completo, sem-sobre, sobre-vazio,
    sobre-recolhido, com/sem-foto) + golden `perfil-pt-completo.expected.json`. Carregadas via Vite `?raw`.
  - #5/#6/#8: ACL `ExtratorDomLinkedin` + `seletores.ts` — seletores por âncora language-neutral
    (`#about/#experience/#education/#skills`), idioma por rótulos PT/EN (empate→PT), matriz
    EstadoDaSecao e Foto real vs placeholder. AC-5 coberto só na metade jsdom (lê texto pleno do nó,
    **não clica**); o clique/expandir é E2E (#7).
- **DECISÃO (2026-06-20): caminho (b) — fixtures/seletores PROVISÓRIOS.** Igor optou por seguir sem
  HTML real agora. ⚠️ **Confiança falsa**: as fixtures espelham os seletores que escrevi, então passam
  por construção — NÃO provam fidelidade ao DOM real. **Bloqueio aberto: recalibrar com HTML real**
  (ver "Bloqueios") antes do DoD.
- **Como retomar a 0003 (o que falta):**
  1. **Recalibrar (crítico):** capturar HTML real (perfil logado, DevTools → `copy(document.querySelector('main').outerHTML)`,
     salvar **fora do git** — PII; PT e EN). Rodar `dom-extraction-auditor` para ajustar `seletores.ts` e
     re-derivar as fixtures/goldens a partir da estrutura real. Tirar o "PROVISÓRIO".
  2. **Task #7:** estratégia "ver mais" no DOM vivo — quando o texto pleno **não** está no nó, clicar 1x
     (predicado do AC-5, ADR-0006). Gate `pnpm test:e2e` (precisa de navegador).
  3. **Task #9:** wire do content script chamando `ExtrairPerfilDaPagina` (sem egress) + E2E zero egress (AC-7).
  4. **Task #10:** atualizar `glossary` + `context-map`; rodar `privacy-guard`; fechar o DoD.
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
- [ ] **0003 — recalibração com HTML real (alto).** Seletores e fixtures são provisórios (caminho (b));
      passam por construção, sem prova de fidelidade. Destrava com: amostra de HTML real (PT/EN) do
      Igor + passada do `dom-extraction-auditor`. Não marcar o DoD da 0003 antes disso.
- [ ] (baixo) Decisões pendentes: nome/marca open source definitivo; licença — proposta MIT.

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
