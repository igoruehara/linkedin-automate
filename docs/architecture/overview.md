---
name: architecture-overview
description: Arquitetura do sistema nos 5 eixos + segurança e operacional. Puxe ao trabalhar em arquitetura, infra, qualidade, observabilidade ou segurança.
alwaysApply: false
---

# Arquitetura do sistema

> Visão **consolidada** do sistema pelos 5 eixos (+ segurança e operacional). Cada seção é um
> **resumo curto + link** para o detalhe (ADRs, context-map, diagrams, TESTING). Gerado/atualizado
> no `/kickoff`. **Mantenha enxuto** — o detalhe vive nos docs linkados, aqui é o mapa.

## 1. Tech stack
Extensão de navegador em **TypeScript**, construída com **WXT** (sobre Vite) e UI em **React** no
side panel. Cross-browser (Chromium → Firefox → Safari) a partir de uma base. Sem backend.
- Decisão: [ADR-0002](adr/0002-extensao-cross-browser-wxt-react.md)

## 2. Arquitetura base
**Cliente-only** (extensão MV3): content script (Extração) + service worker (orquestração) +
side panel (UI). Internamente segue **DDD em camadas** (ver [src/](../../src/README.md)).
Bounded contexts: **Extração de Perfil**, **Curadoria** (core), **Reescrita Assistida**, **Configuração**.
- Mapa de contextos: [context-map.md](context-map.md) · Diagramas: [diagrams.md](diagrams.md)
- Decisões: [ADR-0002](adr/0002-extensao-cross-browser-wxt-react.md) · [ADR-0003](adr/0003-extracao-via-dom-com-acl.md) · [ADR-0004](adr/0004-motor-hibrido-regras-mais-ia.md)

## 3. Infra
**Sem servidor.** A IA roda via **BYOK** (chave do próprio usuário). "Deploy" = build por navegador
e publicação nas lojas (Chrome Web Store, Firefox AMO, Apple). CI no GitHub Actions, além do gate
de conformidade da esteira (`.github/workflows/esteira.yml`).
- Decisão: [ADR-0005](adr/0005-byok-privacidade-cliente.md) · Operacional: ver seção 7.

## 4. Qualidade
Pirâmide: **Vitest** para as Regras/Pontuação (domínio puro), **fixtures de HTML** de perfis reais
para a Extração, e **Playwright** E2E carregando a extensão num navegador real. Lint/format com
ESLint + Prettier no gate.
- Comandos e gates: [TESTING.md](../engineering/TESTING.md)

## 5. Observabilidade
**Zero telemetria por padrão.** Nada de uso/erros sai do navegador. Em desenvolvimento, logs
estruturados locais. Sem métricas/tracing remotos (coerente com privacidade-first).
- Decisão: [ADR-0005](adr/0005-byok-privacidade-cliente.md)

## 6. Segurança
- **Sem autenticação própria** — a extensão usa a sessão logada do usuário no navegador.
- **Dados pessoais (LGPD/GDPR):** o Perfil é processado **em memória, no cliente**; nada é
  transmitido a servidores nossos. A **Chave de IA** fica só no `storage` local da extensão.
- **Saída de dados:** a única chamada externa é ao **Provedor de LLM** escolhido, com a chave do
  usuário, e somente quando ele pede uma Reescrita — deixar isso explícito na UI.
- **Permissões mínimas:** host restrito a `linkedin.com`; justificar cada permissão na loja.
- **Sem ações no LinkedIn:** o produto só lê o DOM visível — manter essa fronteira (ToS).

## 7. Operacional
- **Deploy/rollback:** versionar o pacote por loja; rollback = republicar a versão anterior.
- **Quebra de DOM do LinkedIn** é o incidente mais provável → fixtures versionadas + seletores no ACL
  isolados num único lugar para conserto rápido (ver [ADR-0003](adr/0003-extracao-via-dom-com-acl.md)).
- **Sem telemetria:** detecção de problemas depende de issues da comunidade e avaliações nas lojas.
