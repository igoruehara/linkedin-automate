---
name: ADR-0002
description: Extensão de navegador cross-browser com WXT + React (Manifest V3, side panel). Puxe ao mexer em build, manifesto ou UI.
alwaysApply: false
---

# ADR-0002: Extensão de navegador cross-browser com WXT + React (Manifest V3)

- **Status:** aceito
- **Data:** 2026-06-20
- **Decisores:** Igor

## Contexto
O produto é uma **extensão de navegador** que precisa rodar no perfil do LinkedIn que o usuário já
está vendo, exibindo a curadoria num **side panel**. Alvos desejados: **Chrome, Brave, Firefox e
Safari**. Manifest V3 é o padrão atual das lojas. Manter quatro builds à mão (manifesto, empacotamento,
APIs divergentes) é caro e propenso a erro.

## Decisão
Vamos construir a extensão em **TypeScript** usando **WXT** (framework sobre Vite) com **React** na UI.
- O WXT gera builds para **Chromium, Firefox e Safari** a partir de uma base única, abstrai diferenças
  de manifesto/APIs e oferece HMR e empacotamento por loja.
- Alvo do MVP: **Chrome (Chromium)**; Firefox/Brave na Onda 2 e Safari (via Xcode) na Onda 3.
- Superfície de UI primária: **side panel** nativo, com fallback previsto onde a API divergir
  (Firefox `sidebar_action`, limitações do Safari).
- **Alternativas descartadas:** **Plasmo** (ótimo DX React, mas suporte a Safari menos direto);
  **Vite + config manual** (controle total, porém muito esforço de compatibilidade cross-browser);
  **popup do ícone** como UI principal (espaço pequeno, fecha ao perder foco).

## Consequências
- **+** Uma base de código cobre os 4 navegadores; menos atrito de compatibilidade.
- **+** Vite/HMR e TypeScript aceleram o desenvolvimento; React tem ecossistema amplo.
- **−** Dependência de um framework relativamente novo (WXT) — acoplamento a sua evolução.
- **−** Side panel não é uniforme entre navegadores → pode exigir camada de fallback de UI.
- **−** React tem bundle maior que Svelte/vanilla (aceitável para o ganho de produtividade).
