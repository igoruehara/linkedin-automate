---
name: context-map
description: Bounded contexts e relações. Puxe ao modelar ou cruzar contextos.
alwaysApply: false
---

# Context Map

> Visão DDD estratégica: os bounded contexts do sistema e como se relacionam.
> Atualize quando uma feature cria/move fronteiras. Combine com diagramas C4 se útil.

## Bounded Contexts
| Contexto              | Subdomínio (core/supporting/generic) | Responsabilidade                                                       | Dono |
|-----------------------|--------------------------------------|------------------------------------------------------------------------|------|
| **Extração de Perfil**| supporting                           | Ler o DOM do LinkedIn e montar o modelo `Perfil`, isolando o domínio da volatilidade do HTML. | Mantenedor |
| **Curadoria**         | **core**                             | Aplicar Regras → Achados, Diagnóstico, Pontuação (geral/por Seção) e Recomendações (Checklist). | Mantenedor |
| **Reescrita Assistida**| core                                | Gerar Reescrita Sugerida de Seções fracas via porta de LLM (BYOK).      | Mantenedor |
| **Configuração**      | generic                              | Gerenciar Chave de IA, Provedor, idioma e preferências (storage local). | Mantenedor |

## Relações entre contextos
> Padrões de integração DDD: Customer/Supplier, Conformist, Anti-Corruption Layer (ACL),
> Shared Kernel, Open Host Service, Published Language.

```
            [LinkedIn DOM]
                  │ (ACL)
                  ▼
        [Extração de Perfil] ──(Published Language: Perfil)──► [Curadoria]
                                                                    │
                                                  (Customer/Supplier: Seções fracas)
                                                                    ▼
        [Configuração] ──(fornece Chave de IA + idioma)──► [Reescrita Assistida] ──(ACL/porta)──► [Provedor de LLM]
```

| Upstream             | Downstream           | Padrão                  | Por quê |
|----------------------|----------------------|-------------------------|---------|
| LinkedIn (DOM)       | Extração de Perfil   | Anti-Corruption Layer   | O DOM é volátil e externo; o ACL traduz HTML instável → modelo `Perfil` estável e protege o domínio. |
| Extração de Perfil   | Curadoria            | Published Language      | `Perfil` é o contrato publicado que a Curadoria consome; muda só por decisão consciente. |
| Curadoria            | Reescrita Assistida  | Customer/Supplier       | A Curadoria aponta quais Seções estão fracas; a Reescrita atende essa demanda. |
| Configuração         | Reescrita Assistida  | Customer/Supplier       | A Reescrita depende da Chave de IA, do Provedor e do idioma definidos na Configuração. |
| Reescrita Assistida  | Provedor de LLM      | Anti-Corruption Layer   | Porta de LLM em `infrastructure/`; troca de provedor não vaza para o domínio (ver [ADR-0004](adr/0004-motor-hibrido-regras-mais-ia.md)). |

## Mapa para as camadas (`src/`)
- **domain/** — núcleo de Curadoria (Perfil, Seção, Regra, Achado, Pontuação, Recomendação) e os
  contratos (portas) de Extração e de LLM. Sem dependência de framework/DOM/SDK.
- **application/** — casos de uso: *curar perfil*, *reescrever seção*, *configurar chave*.
- **infrastructure/** — adapters: extrator de DOM (ACL do LinkedIn), cliente de LLM (BYOK), storage local.
- **interfaces/** — borda da extensão: content script, service worker e o side panel (React).

## Diagramas
Os diagramas de arquitetura de alto nível (contexto C4, containers, mapa de contextos) ficam em
[`diagrams.md`](./diagrams.md) — gere/atualize com a skill `/diagramar`.
