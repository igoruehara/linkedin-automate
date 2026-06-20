---
name: product
description: PRD-lite da feature (por quê e para quem). Puxe ao abrir feature arquitetural.
alwaysApply: false
---

# Product — extrair-perfil

> **Tier:** arquitetural · **Status:** rascunho · **Dono:** Igor
> Responde: **por quê** e **para quem**. Mantenha em 1 página. (Detalhe de produto em `docs/product/vision.md` e `mvp-canvas.md`.)

## Problema
Sem ler o perfil, o plugin não faz **nada** do que promete (score, checklist, reescrita). A
**Extração** é a fundação invisível de todo o valor. O desafio: o **DOM do LinkedIn é volátil** e
**bilíngue** (PT/EN), e parte do conteúdo vem **truncado** ("ver mais") ou em **seções recolhidas**.

## Para quem
Todas as personas (Recolocação · Branding · Início — ver `vision.md`). Ninguém "usa" a extração
diretamente; ela habilita as features seguintes. Roda toda vez que o usuário pede a curadoria.

## Resultado esperado / métrica de sucesso
- **Métrica:** extração **correta** das 6 Seções do núcleo nas fixtures de perfis reais (PT **e** EN).
- **Baseline → Alvo:** 0 → **100%** dos casos cobertos pelas fixtures verdes; **robustez** medida por
  **nº de quebras de seletor por release** (alvo: baixo, conserto isolado no ACL).

## Goals
- Extrair, do perfil aberto, as Seções: **Foto, Headline, Sobre, Experiência, Formação, Competências**.
- Para cada Seção: **conteúdo + estado** (Presente / Vazia / Ausente).
- **Normalizar idioma:** chaves canônicas neutras (o domínio não conhece PT/EN).
- **Expandir "ver mais"** e **seções recolhidas** para capturar o texto completo.
- Isolar tudo num **Anti-Corruption Layer**; cobrir com **fixtures de HTML** versionadas (PT/EN).

## Non-goals
- Regras, Achados, Diagnóstico, Pontuação, Checklist (próxima feature).
- Reescrita Assistida / qualquer chamada a LLM.
- Seções fora do núcleo: **Banner, Destaques, Recomendações** (ondas posteriores).
- Páginas que não sejam o **perfil** (feed, busca, empresa).
- Idiomas além de **PT e EN**.

## Riscos / premissas
- **DOM volátil:** o LinkedIn muda o HTML sem aviso → mitigado por ACL + fixtures (ADR-0003).
- **"Ver mais" frágil:** depende de interação com a UI; risco de acoplamento → ver `design.md`.
- **Fronteira de ToS:** expandir "ver mais" precisa permanecer **leitura passiva** (sem ação que
  altere dados/sinais sociais) — **decisão consciente** a registrar (ver `design.md`).
- **Premissa:** o texto completo geralmente já está no DOM (truncado por CSS); clicar é exceção.
