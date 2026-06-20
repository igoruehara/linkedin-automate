---
name: stakeholders
description: Mapa de stakeholders — quem influencia ou é impactado pelo produto. Puxe ao priorizar, alinhar ou comunicar decisões.
alwaysApply: false
---

# Mapa de Stakeholders

> Quem tem **interesse** ou **influência** no produto (Lean Inception). Define quem engajar de
> perto vs manter informado. Atualize quando o cenário mudar.

## Stakeholders
| Stakeholder              | Papel                         | Interesse (o que quer)                          | Influência | Como engajar              |
|--------------------------|-------------------------------|-------------------------------------------------|------------|---------------------------|
| **Você (mantenedor)**    | Sponsor + dev principal       | Validar a ideia, construir e manter o projeto   | alta       | Sessões de trabalho / STATE |
| **Usuários finais**      | Profissionais no LinkedIn     | Melhorar perfil sem expor dados                 | alta       | Loja, issues, feedback opt-in |
| **Comunidade open source** | Contribuidores               | Código limpo, boas issues, docs claras          | média      | GitHub (PRs, discussions) |
| **Lojas de extensão**    | Chrome Web Store, AMO, Apple  | Conformidade com políticas de revisão           | alta       | Seguir guidelines de cada loja |
| **LinkedIn (plataforma)** | Dono da página/dados          | Que extensões não violem ToS nem prejudiquem UX | alta       | Não automatizar ações; só ler o DOM visível |
| **Provedores de LLM**    | Anthropic/OpenAI/…            | Uso conforme seus termos                        | baixa      | Adapter plugável, BYOK    |

## Matriz interesse × influência
```
Influência ▲
     alta │  Lojas · LinkedIn      │  Você · Usuários finais
          │──────────────────────┼──────────────────────
    baixa │  Provedores de LLM     │  Comunidade open source
          └──────────────────────┴──────────────────────►
                 baixo          Interesse          alto
```

## Personas-chave (resumo)
> Quem de fato usa o produto. Detalhe vive em `vision.md`.
- **Recolocação** — não aparece para recrutadores — quer ser encontrável e convincente.
- **Branding** — perfil parado / baixo engajamento — quer Headline e "Sobre" que atraiam.
- **Início** — perfil incompleto — quer um passo a passo do que preencher primeiro.

## Riscos de stakeholder a observar
- **LinkedIn/ToS:** o produto **só lê o DOM visível e não executa ações** — manter essa fronteira é
  o que mantém o projeto dentro das regras. Qualquer feature de automação reabre esse risco.
- **Políticas das lojas:** justificar permissões mínimas (host só para `linkedin.com`) e a ausência
  de coleta de dados é decisivo na aprovação.
