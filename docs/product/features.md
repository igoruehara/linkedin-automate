---
name: features
description: Inventário de funcionalidades classificadas e sequenciadas em ondas (MVP). Puxe ao priorizar o roadmap ou abrir features.
alwaysApply: false
---

# Funcionalidades do produto

> Brainstorm + classificação + **sequenciamento** (Lean Inception). Cada funcionalidade nasce de
> uma jornada (`journeys.md`). A **Onda 1 = MVP** (`mvp-canvas.md`) e alimenta o `roadmap.md`.

## Inventário e classificação
> Classifique por esforço, valor de negócio, confiança (quão certos estamos) e impacto na UX.

| #  | Funcionalidade                                        | Jornada | Esforço | Valor | Confiança | UX    | Onda |
|----|-------------------------------------------------------|---------|---------|-------|-----------|-------|------|
| 1  | Extração do Perfil via DOM (ACL) — PT/EN              | J1      | alto    | alto  | média     | —     | 1    |
| 2  | Motor de Regras + Pontuação (geral e por Seção)       | J1      | médio   | alto  | alta      | alta  | 1    |
| 3  | Checklist de Recomendações priorizado                 | J1      | baixo   | alto  | alta      | alta  | 1    |
| 4  | Side panel com diagnóstico                             | J1      | médio   | alto  | média     | alta  | 1    |
| 5  | Onboarding + Configuração da Chave de IA (BYOK)       | J3      | baixo   | médio | alta      | média | 1    |
| 6  | Reescrita Sugerida de Headline + "Sobre" (IA)         | J2      | médio   | alto  | média     | alta  | 1    |
| 7  | Check-off local de Recomendações aplicadas            | J1      | baixo   | médio | alta      | média | 2    |
| 8  | Reescrita das demais Seções (Experiência, Competências)| J2     | médio   | alto  | média     | alta  | 2    |
| 9  | Suporte a Firefox + Brave (além de Chrome)            | —       | médio   | alto  | média     | —     | 2    |
| 10 | Sugestão de palavras-chave para busca de recrutadores | J1      | médio   | alto  | baixa     | alta  | 2    |
| 11 | Comparar Pontuação ao longo do tempo (histórico local)| J1      | médio   | médio | média     | alta  | 3    |
| 12 | Empacotamento Safari (Xcode)                          | —       | alto    | médio | baixa     | —     | 3    |
| 13 | Múltiplos provedores de LLM (OpenAI, local)           | J2      | médio   | médio | média     | média | 3    |
| 14 | Reporte de erro opt-in (anônimo)                      | —       | baixo   | baixo | média     | baixa | 3    |

## Sequenciador (ondas)
> Ordene por **valor × esforço**; comece pelo menor caminho que entrega e **valida** uma hipótese.

- **Onda 1 (MVP):** #1 Extração · #2 Regras+Pontuação · #3 Checklist · #4 Side panel · #5 BYOK ·
  #6 Reescrita de Headline+"Sobre" — *valida:* "diagnóstico por regras + reescrita das 2 seções-chave
  já entrega valor percebido e as pessoas aplicam as recomendações".
- **Onda 2:** #7 Check-off local · #8 Reescrita das demais seções · #9 Firefox/Brave · #10 Palavras-chave p/ recrutadores.
- **Onda 3 / depois:** #11 Histórico de Pontuação · #12 Safari · #13 Multi-provedor · #14 Erro opt-in.

> Os itens da **Onda 1** viram o `roadmap.md` (horizonte "Agora") e specs via `/nova-feature`.
