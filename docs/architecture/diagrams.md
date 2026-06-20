---
name: diagrams
description: Diagramas de arquitetura de alto nível (Mermaid). Puxe ao desenhar ou rever a arquitetura. Gerado por /diagramar.
alwaysApply: false
---

# Diagramas de arquitetura

> Alto nível (C4 L1–L2 + mapa de bounded contexts). Gerado/atualizado por `/diagramar` em 2026-06-20.
> Renderiza no GitHub e no Claude Code. Mantenha em sincronia com `context-map.md` e os `design.md`.
> Rótulos na linguagem ubíqua do `glossary.md`. Fontes: `vision.md`, `context-map.md`, `overview.md`.

## 1. Contexto do sistema (C4 L1)
> O sistema no centro, com a persona e os sistemas externos. Sem detalhe interno.

```mermaid
flowchart LR
  user(["Usuário do LinkedIn"])
  sys["Curador de Perfil — extensão de navegador"]
  linkedin["LinkedIn — página do perfil / DOM"]
  llm["Provedor de LLM — default Claude, BYOK"]
  user -->|abre o próprio perfil e vê a curadoria| sys
  sys -->|lê o DOM, somente-leitura| linkedin
  sys -->|reescrita com a chave do usuário| llm
```

## 2. Containers (C4 L2)
> As peças que rodam dentro da extensão e como conversam. Sem backend — tudo no cliente.

```mermaid
flowchart TB
  subgraph ext["Curador de Perfil — extensão MV3"]
    content["Content script<br/>Extração do Perfil — ACL"]
    worker["Service worker<br/>casos de uso / orquestração"]
    panel["Side panel — React<br/>UI da curadoria"]
    storage[("Storage local<br/>Chave de IA · preferências")]
  end
  linkedin["LinkedIn — DOM do perfil"]
  llm["Provedor de LLM"]
  content -->|lê o DOM| linkedin
  content -->|Perfil extraído| worker
  worker -->|Pontuação · Checklist · Reescrita| panel
  panel -->|pede Reescrita| worker
  worker -->|chama com a Chave de IA| llm
  worker --> storage
  panel --> storage
```

## 3. Mapa de bounded contexts (DDD)
> Os contextos do sistema e o padrão de relação entre eles (ver `context-map.md`).

```mermaid
flowchart TB
  linkedin["LinkedIn — DOM"]
  llm["Provedor de LLM"]
  extr["Extração de Perfil<br/>supporting"]
  cur["Curadoria<br/>core"]
  rew["Reescrita Assistida<br/>core"]
  cfg["Configuração<br/>generic"]
  linkedin -->|ACL| extr
  extr -->|Published Language: Perfil| cur
  cur -->|Customer/Supplier: Seções fracas| rew
  cfg -->|Customer/Supplier: Chave de IA, idioma| rew
  rew -->|ACL / porta de LLM| llm
```

## 4. Fluxo-chave: diagnóstico + reescrita (jornadas 1 e 2)
> Caminho feliz ponta a ponta. O diagnóstico funciona sem IA; só a Reescrita chama o LLM.

```mermaid
sequenceDiagram
  actor U as Usuário
  participant P as Side panel
  participant W as Service worker
  participant C as Content script
  participant L as LinkedIn DOM
  participant K as Storage local
  participant M as Provedor de LLM

  U->>P: abre o painel no próprio perfil
  P->>W: solicitar curadoria
  W->>C: extrair Perfil
  C->>L: ler DOM, somente-leitura
  L-->>C: HTML das Seções
  C-->>W: Perfil
  W->>W: aplicar Regras, gerar Diagnóstico, Pontuação e Recomendações
  W-->>P: Pontuação + Checklist
  U->>P: pedir Reescrita de Headline ou Sobre
  P->>W: reescrever Seção
  W->>K: ler Chave de IA
  K-->>W: chave local
  W->>M: prompt de Reescrita
  M-->>W: Reescrita Sugerida
  W-->>P: texto para copiar
  U->>P: copiar e colar no LinkedIn
```
