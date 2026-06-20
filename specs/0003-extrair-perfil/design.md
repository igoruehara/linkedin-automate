---
name: design
description: Technical Design Doc — 5 eixos + tabelas de dependências, solução, riscos e roadmap, com links ao repo de artefatos do time. Puxe ao desenhar feature arquitetural.
alwaysApply: false
---

# Technical Design Doc — extrair-perfil

> **Tier:** arquitetural · **Status:** rascunho
> **Autor:** Igor · **Revisores:** — · **Data:** 2026-06-20
> Responde: **como** no nível de sistema.

## Links e artefatos
| Artefato                 | Onde         | Link                                            |
|--------------------------|--------------|-------------------------------------------------|
| Spec · Product · Domínio | repositório  | `./spec.md` · `./product.md` · `./domain.md`    |
| Decisão base             | ADR          | [ADR-0003](../../docs/architecture/adr/0003-extracao-via-dom-com-acl.md) |

## Contexto da funcionalidade
Primeira feature de domínio. Materializa o bounded context **Extração de Perfil** (ver
[context-map](../../docs/architecture/context-map.md)) e produz o `Perfil` (Published Language) que a
Curadoria consumirá. Construída sobre o esqueleto da feature 0002. Problema e escopo em `product.md`.

## Goals / Non-goals
**Goals**
- Função pura de extração: `Document → Perfil` (6 Seções do núcleo, conteúdo + estado, idioma normalizado).
- ACL como único lugar que conhece o HTML do LinkedIn.
- Cobertura por fixtures PT/EN versionadas; E2E opcional valida a interação "ver mais" no DOM vivo.

**Non-goals**
- Score/Regras/Reescrita; Seções fora do núcleo; outras páginas (ver `product.md`).

## Glossário (da funcionalidade)
| Termo            | Descrição                                                                 |
|------------------|---------------------------------------------------------------------------|
| `TipoDeSeção`    | Chave canônica neutra de idioma (FOTO, HEADLINE, SOBRE, EXPERIENCIA, FORMACAO, COMPETENCIAS). |
| `EstadoDaSeção`  | `PRESENTE` (tem conteúdo) · `VAZIA` (existe no DOM, sem conteúdo) · `AUSENTE` (não há a Seção). |
| `Conteúdo`       | Texto (Headline/Sobre) ou itens estruturados (Experiência/Formação/Competências) / flag (Foto). |
| ACL de Extração  | Adapter em `infrastructure/` que traduz o DOM volátil no `Perfil`.        |

## Design proposto
**Fluxo:** content script obtém o `document` da página → caso de uso `ExtrairPerfilDaPagina` →
**porta** `ExtratorDePerfil` (implementada pelo ACL) → `Perfil`. O domínio (`Perfil`, `Seção`,
`TipoDeSeção`) é **puro**; o ACL é o único que importa seletores/DOM.

```
[interfaces/content] → [application: ExtrairPerfilDaPagina] → (porta) ExtratorDePerfil
                                                               └→ [infrastructure: ExtratorDomLinkedin (ACL)]
                                                                     ↳ produz [domain: Perfil]
```

- **Porta** `ExtratorDePerfil` declarada em `application/` (ou `domain/`): `extrair(doc: Document): Perfil`.
- **ACL** `ExtratorDomLinkedin`: mapa de seletores por `TipoDeSeção`, detecção de `Idioma` por rótulos,
  e a estratégia de "ver mais" (abaixo). Seletores num **só módulo**, fáceis de consertar.
- **Texto completo vs "ver mais":** estratégia em camadas — (1) ler o **texto pleno do nó** (o LinkedIn
  costuma manter o texto no DOM, só truncado por CSS); (2) se o texto estiver de fato **oculto/recolhido**,
  **expandir** clicando no controle "ver mais"/"…mais" **da própria página do usuário**. Expandir é
  **leitura passiva** (revela conteúdo já pertencente ao usuário; não cria conexão, mensagem, like nem
  altera dado/sinal social). **Ver "Decisão de fronteira" abaixo.**

## Cobertura dos 5 eixos
### 1. Tech stack
- Sem libs novas em produção. **Teste:** parser de DOM para rodar o ACL contra fixtures — adicionar
  **`jsdom`** como devDependency e usar `environment: 'jsdom'` nos testes de `infrastructure/`.
### 2. Arquitetura base
- Novo agregado **`Perfil`** em `domain/perfil/`; nova **porta** `ExtratorDePerfil`; novo **ACL** em
  `infrastructure/extracao/`. Padrão de integração com a Curadoria: **Published Language** (`Perfil`).
  Padrão com o LinkedIn: **Anti-Corruption Layer**. Respeita a regra de camadas (lint da 0002).
### 3. Infra
- Nenhuma. Sem rede, sem backend. Reversão = desligar a feature (o esqueleto 0002 continua válido).
### 4. Qualidade
- **Unidade/integração (Vitest + jsdom):** ACL contra **fixtures PT/EN** — um caso por AC.
  Fixtures: perfil completo, com Seção ausente, com Seção vazia, com texto recolhido (para "ver mais").
- **E2E (Playwright):** valida a interação "ver mais" num DOM vivo servido localmente (fixture HTML),
  e reafirma **zero egress** (privacidade) durante a extração.
- **Lint de fronteira:** garante que `domain/perfil` não importa DOM/infra.
### 5. Observabilidade
- Zero telemetria (ADR-0005). Em dev, log estruturado opcional de "Seção não encontrada" para depurar
  quebra de seletor — **sem** conteúdo do perfil no log.

## Mapa de dependências
| Dependência | Tipo        | Descrição                          | Principais métodos |
|-------------|-------------|------------------------------------|--------------------|
| DOM da página | navegador | fonte do `Perfil` (somente leitura)| `document.querySelector*` (dentro do ACL) |
| jsdom       | lib (dev)   | parsear fixtures nos testes        | `JSDOM`/`window.document` |

## Solução
| # | Bloco                                   | Descrição                                            | Status     |
|---|-----------------------------------------|------------------------------------------------------|------------|
| 1 | Agregado `Perfil` + VOs no domínio      | `Perfil`, `Seção`, `TipoDeSeção`, `EstadoDaSeção`     | definido   |
| 2 | Porta `ExtratorDePerfil` + caso de uso  | `ExtrairPerfilDaPagina`                              | definido   |
| 3 | ACL `ExtratorDomLinkedin`               | seletores + detecção de idioma + "ver mais"          | definido   |
| 4 | Fixtures PT/EN + testes por AC          | completo / ausente / vazia / recolhido               | definido   |
| 5 | Wire no content script                  | invoca o caso de uso (sem enviar nada)               | definido   |
| 6 | Política de "ver mais" (fronteira ToS)  | passiva; clicar só quando o texto não está no DOM    | definido — [ADR-0006](../../docs/architecture/adr/0006-fronteira-leitura-expandir-ui.md) |

## Alternativas consideradas
| Alternativa | Prós | Contras | Por que (não) escolhida |
|-------------|------|---------|-------------------------|
| **ACL: ler texto pleno do nó, expandir só se oculto (escolhida)** | robusto, menos clique, menos frágil | precisa detectar "oculto vs truncado" | melhor relação robustez × fidelidade |
| Sempre clicar "ver mais" | conteúdo completo garantido | frágil, lento, mais perto da fronteira de ToS | descartada como padrão (só fallback) |
| Só ler o renderizado (sem expandir) | mais simples e seguro | perde texto recolhido | descartada (usuário pediu o texto completo) |
| **Parser de teste: `jsdom` (escolhida)** | maduro, fiel ao DOM real (eventos/"ver mais") | mais pesado/lento que happy-dom | escolhido pela fidelidade ao DOM (importa para AC-5); reversível |

## Trade-offs e consequências
- Ganhamos fidelidade (texto completo, PT/EN unificado) ao custo de **acoplamento à UI** ("ver mais")
  e de manutenção de fixtures. Dívida aceita: a estratégia de expandir pode quebrar e exigir conserto
  no ACL — isolada e coberta por fixture.

## Riscos
| Risco | Descrição | Prob. × Impacto | Mitigação |
|-------|-----------|-----------------|-----------|
| DOM volátil | seletores quebram | alto × médio | ACL isolado + fixtures + `dom-extraction-auditor` |
| "Ver mais" muda | controle de expandir muda | médio × médio | preferir texto pleno do nó; clique é fallback |
| Fronteira de ToS | expandir é "ação"? | baixo × alto | definir e documentar a fronteira (abaixo) |
| PII em log | logar conteúdo ao depurar | baixo × alto | logar só o tipo da Seção, nunca o conteúdo (ADR-0005) |

## Decisão de fronteira — "ver mais" e o "só leitura" — RESOLVIDA
Decidido: **expandir a UI local é leitura** — formalizado no
[ADR-0006](../../docs/architecture/adr/0006-fronteira-leitura-expandir-ui.md). Continua proibido qualquer
ato que crie/modifique dado ou sinal social (conexão, mensagem, like, follow, edição). Estratégia
preferida: ler o **texto pleno do nó**; **clicar para expandir é fallback**. O `privacy-guard` checa a
distinção (expandir ✓ · ação de estado ✗) e o AC-7 a verifica por E2E (zero egress).

## Roadmap da feature
| Fase | Entrega | Quando | Depende de |
|------|---------|--------|------------|
| 1 (MVP) | Extração das 6 Seções (PT/EN) com texto pleno do nó | agora | 0002 |
| 2 | Expandir "ver mais"/recolhido (se aprovado) | depois da fronteira | 1 |

## Questões em aberto
- [x] **Fronteira "ver mais":** resolvido — [ADR-0006](../../docs/architecture/adr/0006-fronteira-leitura-expandir-ui.md) (expandir é leitura).
- [x] Parser de teste: resolvido — **jsdom** (fidelidade ao DOM para o AC-5).
