---
name: vision
description: Visão do produto — problema, personas, North Star.
alwaysApply: true
---

# Visão do Produto — Curador de Perfil (LinkedIn)

> Gerado no kickoff (Lean Inception) em 2026-06-20. Documento vivo: revisar a cada pivô relevante.
> **Nome provisório** ("Curador de Perfil") — definir a marca open source antes da 1ª publicação na loja.

## Elevator pitch
> Para **qualquer profissional** que **quer melhorar seu perfil do LinkedIn mas não sabe o que
> priorizar**, o **Curador de Perfil** é uma **extensão de navegador open source** que
> **analisa o perfil que você já está vendo e entrega um score, um checklist acionável e
> reescritas prontas para copiar e colar**.
> Diferente de **cursos genéricos de LinkedIn e ferramentas SaaS que pedem login/dados**, o nosso
> produto **roda 100% no seu navegador, não armazena seus dados e usa a sua própria chave de IA (BYOK)**.

## O produto É / NÃO É / FAZ / NÃO FAZ
| É                                                   | NÃO É                                                        |
|-----------------------------------------------------|-------------------------------------------------------------|
| Extensão de navegador open source                   | SaaS com backend que guarda seus dados                      |
| Curador/consultor automático do **seu** perfil      | Ferramenta de automação que age pelo LinkedIn por você      |
| Agnóstico a pessoa, cargo e senioridade             | Voltado a um nicho/cargo específico                         |
| BYOK — você usa sua própria chave de IA             | Serviço que cobra/centraliza o uso de IA                    |

| FAZ                                                  | NÃO FAZ (no MVP)                                            |
|------------------------------------------------------|-------------------------------------------------------------|
| Lê o DOM do perfil aberto e calcula uma Pontuação    | Envia conexão, mensagem, like ou qualquer ação no LinkedIn  |
| Gera checklist priorizado de melhorias               | Edita o perfil automaticamente (você copia e cola)          |
| Sugere reescrita de Headline e "Sobre" via IA        | Coleta/armazena perfis de terceiros ou faz scraping em massa|
| Funciona em PT e EN                                  | Telemetria ou rastreamento de uso                           |

## Personas
> O produto é **agnóstico** a pessoa e cargo; as personas abaixo são **contextos de uso**, não nichos.

| Persona     | Quem é / contexto                                   | Dor principal                                  | O que espera do produto |
|-------------|-----------------------------------------------------|------------------------------------------------|-------------------------|
| **Recolocação** | Profissional buscando vaga ativamente           | Não aparece nas buscas de recrutadores         | Ser encontrável e convincente para o RH |
| **Branding**    | Pessoa empregada querendo visibilidade/autoridade | Perfil "parado", baixo engajamento           | Headline e "Sobre" que atraiam rede e oportunidades |
| **Início**      | Estudante / quem está montando o 1º perfil      | Perfil incompleto, não sabe por onde começar   | Um passo a passo claro do que preencher primeiro |

## North Star / objetivo
- **North Star metric:** **% das Recomendações que o usuário marca como aplicadas** por sessão de
  curadoria (sinal de que o conselho foi útil e acionável).
- **Baseline → Alvo:** 0 (produto novo) → **≥ 50%** das recomendações aplicadas em 3 meses pós-MVP.
- **Restrição de medição (consciente):** sem telemetria (ver [ADR-0005](../architecture/adr/0005-byok-privacidade-cliente.md)),
  a North Star é medida **localmente** (check-off do checklist no aparelho do usuário) e, para o
  agregado, por **proxies públicos**: instalações nas lojas, avaliações e estrelas no GitHub.
- **Objetivos de negócio/comunidade:** adoção open source (stars/forks), reputação e base de
  contribuidores; sustentabilidade sem custo de infra (BYOK).

## Premissas e hipóteses a validar
- [ ] Um diagnóstico **determinístico por regras** já entrega valor percebido (a IA é "cereja").
- [ ] Usuários toleram **configurar a própria chave de IA** (BYOK) em troca de privacidade.
- [ ] O **DOM do perfil** expõe dados suficientes e estáveis o bastante para uma extração confiável.
- [ ] Reescrita de **Headline + "Sobre"** é o par de maior valor para começar.
- [ ] Side panel é a superfície certa (vs painel injetado) na maioria dos navegadores-alvo.
