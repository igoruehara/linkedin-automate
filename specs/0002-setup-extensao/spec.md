---
name: spec
description: Contrato da feature (critérios de aceite). Base enquanto a feature está ativa.
alwaysApply: true
---

# Spec — setup-extensao (walking skeleton)

> **Fonte da verdade.** Status: **implementado** (todos os AC-1..AC-6 verdes por gate executável — 2026-06-20)
> Os critérios de aceite são (a) o contrato com o negócio, (b) o oráculo de teste,
> (c) o prompt para o agente de IA implementar. Escreva-os para serem executáveis.

## Resumo
Montar o **esqueleto ponta a ponta** da extensão (WXT + React, Manifest V3) — content script,
service worker e **side panel** com um placeholder — sobre a estrutura de camadas DDD, com os
gates de qualidade (lint, Vitest, Playwright) verdes. **Sem lógica de negócio**: nada de extração,
regras, pontuação ou IA ainda. Materializa os [ADR-0002](../../docs/architecture/adr/0002-extensao-cross-browser-wxt-react.md)
e [ADR-0005](../../docs/architecture/adr/0005-byok-privacidade-cliente.md).

## Critérios de aceite
> Formato Given/When/Then. Cada critério deve ser testável e não-ambíguo.
> **Cada `AC-N` é um ID rastreável:** reaparece em `tasks.md`, no teste que o valida e no commit.

### AC-1: O projeto builda e gera a extensão Chrome MV3
- **Dado** o repositório com as dependências instaladas (`pnpm install`)
- **Quando** rodar `pnpm build`
- **Então** o build conclui com código de saída 0 e gera `.output/chrome-mv3/` contendo um
  `manifest.json` válido com `"manifest_version": 3`.

### AC-2: A estrutura de camadas DDD existe e a regra de dependência é aplicada por lint
- **Dado** o código-fonte em `src/`
- **Quando** inspecionar a árvore e rodar `pnpm lint`
- **Então** existem as pastas `domain/`, `application/`, `infrastructure/` e `interfaces/`, e uma
  regra de lint **falha** se `domain/` importar de `application/`, `infrastructure/`, `interfaces/`
  ou de qualquer pacote de framework/DOM (a seta de dependência aponta só para dentro — ver
  [src/README.md](../../src/README.md)).

### AC-3: O side panel renderiza o placeholder de curadoria
- **Dado** que a extensão está carregada num navegador Chromium e há uma aba de perfil do LinkedIn
  (`https://www.linkedin.com/in/*`) aberta
- **Quando** o side panel da extensão é aberto
- **Então** o painel React renderiza um elemento raiz com `data-testid="curadoria-placeholder"`
  contendo o título **"Curador de Perfil"** e o estado vazio **"Aguardando análise do perfil"**;
  o teste E2E localiza o placeholder **pelo `data-testid`** (estável) e confere os textos
  visíveis (a verificação não acopla à diagramação, só ao identificador e à cópia esperada).

### AC-4: Permissões mínimas — só LinkedIn, sem escopo amplo
- **Dado** o `manifest.json` gerado
- **Quando** inspecionar `host_permissions` e os `matches` do content script
- **Então** ambos restringem o acesso a `*://*.linkedin.com/*` e **não** contêm `<all_urls>` nem
  outros hosts; o content script não executa fora do LinkedIn (invariante de privacidade/ToS,
  [ADR-0005](../../docs/architecture/adr/0005-byok-privacidade-cliente.md) · [ADR-0003](../../docs/architecture/adr/0003-extracao-via-dom-com-acl.md)).

### AC-5: Os gates de qualidade passam
- **Dado** o projeto configurado
- **Quando** rodar `pnpm lint`, `pnpm test` (Vitest) e `pnpm test:e2e` (Playwright)
- **Então** os três terminam com sucesso: lint sem erros, **≥ 1** teste de unidade no `domain/`
  verde, e **1** teste E2E que carrega a extensão e confirma o placeholder do AC-3.

### AC-6: Zero requisição de rede a terceiros no carregamento (privacidade)
- **Dado** a extensão carregada e o side panel aberto numa aba de perfil do LinkedIn
- **Quando** o teste E2E observa o tráfego de rede durante o carregamento e a renderização do painel
- **Então** **nenhuma** requisição parte para host que não seja `*.linkedin.com`; como ainda não há
  Reescrita, **não há** chamada a Provedor de LLM nem a qualquer analytics/telemetria — o teste
  **falha** se qualquer egress a terceiros ocorrer ([ADR-0005](../../docs/architecture/adr/0005-byok-privacidade-cliente.md)).

## Casos de borda e erros
- **Aba não-LinkedIn ou não-perfil:** o side panel ainda abre e mostra o placeholder "Aguardando
  análise do perfil"; nenhuma extração ocorre (não há lógica ainda). Sem erro no console.
- **`pnpm build` sem dependências instaladas:** falha com mensagem clara (não é um caso de sucesso).
- **Conteúdo do perfil ausente/atrasado (lazy-load):** fora de escopo aqui — tratado na feature de Extração.

## Fora de escopo
> Vinculante. Não implemente nada aqui.
- Extração real do DOM e o modelo `Perfil` (feature 0003).
- Regras, Achados, Diagnóstico, Pontuação e Checklist de Recomendações.
- Reescrita Assistida e qualquer chamada a Provedor de LLM.
- UI real de Configuração / fluxo de BYOK (só o esqueleto, sem persistir chave).
- Builds de Firefox, Brave e Safari (apenas Chrome neste esqueleto).
- Publicação nas lojas.

## Rastreabilidade
- Product: n/a (tier Pequeno — sem `product.md`)
- Design: n/a (decisões já nos ADRs abaixo)
- Domínio: n/a (sem termo de domínio novo; ver [glossary](../../docs/glossary.md))
- ADRs relacionados: [0002](../../docs/architecture/adr/0002-extensao-cross-browser-wxt-react.md) ·
  [0003](../../docs/architecture/adr/0003-extracao-via-dom-com-acl.md) ·
  [0005](../../docs/architecture/adr/0005-byok-privacidade-cliente.md)
