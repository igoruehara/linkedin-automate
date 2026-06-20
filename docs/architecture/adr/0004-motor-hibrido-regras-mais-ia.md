---
name: ADR-0004
description: Motor híbrido — regras determinísticas no domínio para o diagnóstico + IA só na reescrita de texto, com porta de LLM plugável. Puxe ao mexer em curadoria ou reescrita.
alwaysApply: false
---

# ADR-0004: Motor híbrido — Regras no domínio + IA só na Reescrita

- **Status:** aceito
- **Data:** 2026-06-20
- **Decisores:** Igor

## Contexto
O produto precisa **diagnosticar** o perfil e **sugerir textos melhores**. Depender de IA para tudo
deixaria o diagnóstico caro, lento, não-determinístico (difícil de testar) e inutilizável sem chave.
Por outro lado, gerar **texto** de qualidade (Headline/"Sobre") é exatamente onde um LLM brilha.

## Decisão
Vamos adotar um **motor híbrido**:
- **Diagnóstico = Regras determinísticas no `domain/`.** Cada **Regra** avalia uma **Seção** e emite um
  **Achado**; os Achados ponderados geram a **Pontuação** e as **Recomendações**. É puro, testável com
  Vitest e funciona **sem IA**.
- **Reescrita = IA, na borda.** A geração de **Reescrita Sugerida** usa um **Provedor de LLM** através
  de uma **porta** declarada no domínio/aplicação e implementada em `infrastructure/` (ACL ao SDK do
  provedor). **Default: Claude (Anthropic)**; a porta é **plugável** para outros provedores depois.
- A IA **nunca** decide a Pontuação nem o que está certo/errado — só redige a sugestão de texto.

**Alternativas descartadas:** **só IA** (não determinístico, caro, inútil sem chave); **só regras**
(diagnóstico bom, mas sem o valor da reescrita sob medida).

## Consequências
- **+** Diagnóstico determinístico, rápido, testável e útil mesmo sem Chave de IA.
- **+** Trocar/!adicionar provedor de LLM não afeta o domínio (porta + ACL).
- **+** Custo de IA recai só sobre a reescrita, sob demanda (combina com BYOK, [ADR-0005](0005-byok-privacidade-cliente.md)).
- **−** Duas "engrenagens" para manter (catálogo de Regras + prompts de reescrita).
- **−** Qualidade da reescrita varia conforme o provedor/modelo escolhido pelo usuário.
