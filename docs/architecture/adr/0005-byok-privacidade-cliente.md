---
name: ADR-0005
description: Privacidade-first — BYOK (chave de IA local), processamento 100% no cliente e zero telemetria por padrão. Puxe ao mexer em chave, storage, rede ou logging.
alwaysApply: false
---

# ADR-0005: Privacidade-first — BYOK, cliente-only e zero telemetria

- **Status:** aceito
- **Data:** 2026-06-20
- **Decisores:** Igor

## Contexto
A extensão lê **dados pessoais** do perfil do LinkedIn e é **open source**. Confiança é o ativo central:
qualquer envio de dados a servidores nossos, ou telemetria, mina a proposta e cria ônus de LGPD/GDPR,
custo de infra e superfície de risco. Ao mesmo tempo, a Reescrita precisa de um LLM (que é pago).

## Decisão
Vamos ser **privacidade-first, sem backend**:
- **BYOK (Bring Your Own Key):** o usuário fornece a **Chave de IA** do seu Provedor; ela é armazenada
  **apenas no `storage` local** da extensão e usada só para chamar o LLM nas Reescritas que ele pedir.
- **Processamento 100% no cliente:** o **Perfil** é extraído e curado **em memória, no navegador**.
  Nenhum dado do perfil trafega para servidores nossos (não temos servidor).
- **Única saída de dados:** a chamada ao **Provedor de LLM** escolhido, explicitada na UI no momento
  da Reescrita.
- **Zero telemetria por padrão:** nenhum dado de uso ou erro sai do navegador. Em dev, apenas logs
  locais. Reporte de erro **opt-in e anônimo** fica como possibilidade futura (Onda 3), nunca padrão.

**Alternativas descartadas:** **backend proxy** que guarda a chave (UX mais simples, mas custo de
infra, escala e responsabilidade sobre dados/segredos); **telemetria opt-out** (incompatível com a
promessa de privacidade).

## Consequências
- **+** Confiança máxima; coerente com open source; sem custo de infra nem de IA para o mantenedor.
- **+** Escopo de LGPD/GDPR minúsculo (nada é coletado/armazenado por nós).
- **−** **Sem visibilidade de erros/uso em produção** → depende de issues e avaliações nas lojas.
- **−** Fricção de onboarding (o usuário precisa obter e colar uma chave) — mitigada porque o
  **diagnóstico funciona sem IA**.
- **−** A chave vive no cliente; mitigar com storage adequado da extensão e avisos claros de escopo.
