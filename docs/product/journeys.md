---
name: journeys
description: Resumo das jornadas do produto — etapas que a persona percorre. Puxe ao desenhar features ou priorizar o MVP.
alwaysApply: false
---

# Jornadas do produto

> As jornadas que o produto precisa cobrir ponta a ponta, do ponto de vista da persona (Lean
> Inception). Alimentam as funcionalidades (`features.md`) e o MVP (`mvp-canvas.md`).

## Jornada 1: Diagnóstico rápido do meu perfil  *(núcleo do MVP)*
- **Persona:** Recolocação / Branding / Início · **Objetivo:** entender, em segundos, o que está fraco no perfil.
- **Etapas:**
  1. Usuário abre **seu próprio perfil** no LinkedIn (logado).
  2. Abre o **side panel** da extensão (ícone / atalho).
  3. A extensão **extrai** o perfil do DOM e roda as **Regras**.
  4. Vê a **Pontuação** geral e por Seção + o **checklist de Recomendações** priorizado.
- **Dores / atritos:** hoje não sabe o que priorizar; conselhos genéricos da internet não olham *o seu* perfil.
- **Oportunidades:** diagnóstico personalizado, objetivo e imediato, sem sair da página.

## Jornada 2: Melhorar uma seção fraca com reescrita  *(MVP: Headline + "Sobre")*
- **Persona:** todas · **Objetivo:** transformar uma Recomendação em texto pronto.
- **Etapas:**
  1. No checklist, clica numa Recomendação de **Headline** ou **"Sobre"**.
  2. A extensão chama o **Provedor de LLM** (com a **Chave de IA** do usuário) e gera a **Reescrita Sugerida**.
  3. Usuário revisa, ajusta se quiser e **copia**.
  4. **Cola** manualmente no campo do LinkedIn e salva.
- **Dores / atritos:** escrever uma boa Headline/"Sobre" do zero é difícil e demorado.
- **Oportunidades:** texto sob medida ao perfil real, em PT ou EN, mantendo o usuário no controle (copiar/colar, sem ação automática).

## Jornada 3: Primeiro uso / configurar a chave de IA  *(onboarding)*
- **Persona:** todas (primeira vez) · **Objetivo:** habilitar a reescrita com IA com segurança.
- **Etapas:**
  1. Instala a extensão e abre o side panel pela primeira vez.
  2. É avisado de que o **diagnóstico funciona sem IA**; a **reescrita** exige uma **Chave de IA**.
  3. Escolhe o **Provedor** e cola a **chave**, que fica **só no armazenamento local**.
  4. Define o **idioma** (PT/EN) e começa a usar.
- **Dores / atritos:** medo de expor dados; fricção de "ter que configurar algo".
- **Oportunidades:** transparência (open source + zero telemetria) vira diferencial de confiança; diagnóstico já entrega valor antes mesmo da chave.

> Visual opcional: gere o fluxo de uma jornada em Mermaid (`sequenceDiagram`) com `/diagramar`.
