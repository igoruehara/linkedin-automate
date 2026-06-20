---
name: ADR-0003
description: Extração dos dados do perfil via DOM (sem API oficial) isolada por Anti-Corruption Layer. Puxe ao mexer em extração/seletores.
alwaysApply: false
---

# ADR-0003: Extração do perfil via DOM com Anti-Corruption Layer

- **Status:** aceito
- **Data:** 2026-06-20
- **Decisores:** Igor

## Contexto
A curadoria precisa dos dados do perfil. A **API oficial do LinkedIn** é restrita (exige parceria/
aprovação) e inviável para um projeto open source pessoal. A extensão, por outro lado, **já vê** a
página do perfil renderizada. O DOM do LinkedIn é **volátil**: classes e estrutura mudam sem aviso,
o que pode quebrar a extração.

## Decisão
Vamos **extrair os dados lendo o DOM da página do perfil aberta**, sem usar API oficial e **sem ações
de automação** (só leitura do que o usuário já vê — fronteira de ToS).
- A extração fica atrás de um **Anti-Corruption Layer**: todos os seletores e o parsing de HTML vivem
  num único módulo de `infrastructure/`, que traduz o HTML instável no modelo `Perfil` (Published
  Language) consumido pela Curadoria. O domínio **não conhece** o DOM.
- A robustez é garantida por **fixtures de HTML** de perfis reais (PT e EN) versionadas, usadas nos
  testes — quando o LinkedIn mudar, conserta-se o ACL e atualizam-se as fixtures, sem tocar no domínio.
- **Alternativas descartadas:** **API oficial** (acesso negado na prática); **colar texto manual**
  (atrito alto, menos automático) — pode virar fallback futuro.

## Consequências
- **+** Funciona com a sessão logada, sem credenciais de API.
- **+** O domínio fica protegido da volatilidade do DOM; quebras se concentram num só lugar.
- **−** Manutenção recorrente quando o LinkedIn altera o HTML (incidente operacional esperado).
- **−** Cobertura depende do que a página renderiza (lazy-load/expandir seções exige cuidado).
- **−** Sensível a ToS: a fronteira "só leitura, sem ação" é inegociável para mitigar risco.
