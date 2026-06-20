---
name: roadmap
description: Prioridades atuais em horizontes Now/Next/Later.
alwaysApply: true
---

# Roadmap — Curador de Perfil (LinkedIn)

> Plano incremental para implementar **com o time**. Gerado no kickoff (2026-06-20).
> Greenfield: sequência de entrega do MVP. Princípio: **quick wins de baixo risco primeiro**.

## Objetivo do roadmap
Levar do zero a um **MVP utilizável no Chrome** (Pontuação + Checklist + Reescrita de Headline/"Sobre"),
provando que as pessoas **aplicam** as recomendações (≥50% — ver `mvp-canvas.md`), com base técnica
limpa (camadas DDD, ACL de extração, testes) para escalar a navegadores e seções nas ondas seguintes.

## Horizontes
> Now / Next / Later evita a falsa precisão de datas distantes. Datas só no "Agora".

### 🟢 Agora (este ciclo) — fundação + núcleo do MVP
| # | Item                                                        | Valor | Esforço | Dono | Depende de | Pronto quando |
|---|-------------------------------------------------------------|-------|---------|------|------------|---------------|
| 1 | `git init` + commit do kickoff + `LICENSE` (MIT)            | médio | baixo   | Igor | —          | Repo versionado, kickoff commitado |
| 2 | ✅ `/camada-agentica` — 6 subagentes + allowlist (feito)     | alto  | baixo   | Igor | —          | **Concluído (2026-06-20)** |
| 3 | Scaffolding da extensão (WXT + React, MV3, side panel "hello", pnpm, ESLint/Prettier/Vitest/Playwright) **+ hook `Stop` (lint+test)** | alto | médio | Igor | 1 | `pnpm dev` abre o side panel no Chrome; CI verde |
| 4 | Feature: **Extração do Perfil** via DOM + ACL + fixtures PT/EN | alto | alto  | Igor | 3          | Modelo `Perfil` extraído e testado contra fixtures |
| 5 | Feature: **Motor de Regras + Pontuação** (domínio puro)     | alto  | médio   | Igor | 4          | Pontuação geral/por Seção com testes Vitest por AC |
| 6 | Feature: **Checklist de Recomendações** no side panel       | alto  | baixo   | Igor | 5          | Recomendações priorizadas visíveis e legíveis |

### 🟡 Próximo — completar o MVP e abrir navegadores
| # | Item                                                        | Valor | Esforço | Dono | Depende de |
|---|-------------------------------------------------------------|-------|---------|------|------------|
| 1 | Onboarding + **Configuração da Chave de IA (BYOK)**         | médio | baixo   | Igor | 3 |
| 2 | **Reescrita de Headline + "Sobre"** (porta de LLM, default Claude) | alto | médio | Igor | 5, "Próximo #1" |
| 3 | **Check-off local** de Recomendações aplicadas (mede a North Star) | médio | baixo | Igor | 6 |
| 4 | `/setup-ci` — pipeline de build/test (materializa os gates) | alto  | baixo   | Igor | 3 (Agora) |
| 5 | Publicar **beta na Chrome Web Store**                       | alto  | médio   | Igor | MVP completo |
| 6 | Suporte a **Firefox + Brave**                              | alto  | médio   | Igor | MVP completo |
| 7 | **Palavras-chave para busca de recrutadores**             | alto  | médio   | Igor | 5 (Agora) |

### ⚪ Depois (hipóteses / a validar)
| # | Item                                              | Por que esperar |
|---|---------------------------------------------------|-----------------|
| 1 | Reescrita das **demais Seções** (Experiência, Competências) | Validar Headline/"Sobre" primeiro |
| 2 | **Safari** (empacotamento Xcode)                  | Exige macOS; menor alcance inicial |
| 3 | **Histórico de Pontuação** (local)                | Só após o diagnóstico provar valor |
| 4 | **Multi-provedor de LLM** (OpenAI, local)         | Depende de demanda da comunidade |
| 5 | **Reporte de erro opt-in (anônimo)**              | Avaliar sem ferir a promessa de privacidade |
| 6 | Skills do produto `/nova-regra` e `/atualizar-fixtures` | Fazem sentido após o scaffolding existir |
| 7 | `/integracoes` + skills tools-aware (`/spec-to-jira`…) | Só com MCP de Jira/Confluence/Notion conectado |

## Como rodar com o time
- **Cadência de revisão do roadmap:** a cada 2 semanas (ou ao fechar cada feature da Onda 1).
- **Quem decide prioridade:** Igor (mantenedor); issues/discussions da comunidade alimentam o "Depois".
- **Definition of Ready/Done:** ver `README.md` e `CLAUDE.md`.
- **Primeiro passo concreto:** itens 1→3 do "Agora", depois abrir a feature de Extração com `/nova-feature`.
