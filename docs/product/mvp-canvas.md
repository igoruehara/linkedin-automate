---
name: mvp-canvas
description: Canvas do MVP. Puxe na descoberta e priorização do MVP.
alwaysApply: false
---

# MVP Canvas — Curador de Perfil (LinkedIn)

> Lean Inception (Paulo Caroli). O MVP é a menor coisa que gera aprendizado validado,
> não a versão "pequena" do produto final.

## 1. Proposta do MVP (visão)
Entregar, no side panel do perfil aberto, uma **Pontuação + checklist de Recomendações** geradas por
**regras determinísticas**, mais **reescrita por IA de Headline e "Sobre"** (BYOK) — para aprender
se as pessoas **aplicam** as recomendações e percebem valor.

## 2. Personas e segmentos do MVP
Foco inicial em quem mais sente a dor: **Recolocação** e **Branding** (ver `vision.md`). Funciona para
qualquer perfil (agnóstico), mas a comunicação e os exemplos miram esses dois contextos.

## 3. Jornadas
Cobre ponta a ponta (ver `journeys.md`):
1. **Diagnóstico rápido** (J1) — núcleo.
2. **Reescrita de Headline + "Sobre"** (J2).
3. **Onboarding / configurar Chave de IA** (J3).

## 4. Funcionalidades (sequenciadas)
> Priorize por **valor de negócio × esforço**. Só o que é indispensável para a jornada.

| # | Funcionalidade                                  | Valor | Esforço | Entra no MVP? |
|---|-------------------------------------------------|-------|---------|---------------|
| 1 | Extração do Perfil via DOM (PT/EN)              | alto  | alto    | sim           |
| 2 | Motor de Regras + Pontuação                     | alto  | médio   | sim           |
| 3 | Checklist de Recomendações priorizado           | alto  | baixo   | sim           |
| 4 | Side panel com diagnóstico                       | alto  | médio   | sim           |
| 5 | Onboarding + Chave de IA (BYOK)                 | médio | baixo   | sim           |
| 6 | Reescrita de Headline + "Sobre" (IA)            | alto  | médio   | sim           |
| 7 | Reescrita das demais seções                     | alto  | médio   | depois (Onda 2)|
| 8 | Firefox/Brave, Safari                           | alto  | médio/alto | depois     |
| 9 | Palavras-chave p/ recrutadores                  | alto  | médio   | depois (Onda 2)|

**Alvo de navegador do MVP:** **Chrome** (Chromium) primeiro — Firefox/Brave na Onda 2, Safari na Onda 3.

## 5. Resultado esperado / como validar
- **Critério de sucesso:** **≥ 50%** das Recomendações exibidas são marcadas como aplicadas
  (check-off local) numa sessão; usuários conseguem usar a reescrita sem ajuda.
- **Sinais qualitativos:** avaliações nas lojas, issues/discussions no GitHub, estrelas.
- **Medição:** local (no aparelho) + proxies públicos — **sem telemetria** ([ADR-0005](../architecture/adr/0005-byok-privacidade-cliente.md)).

## 6. Custo e cronograma
- **Custo de infra:** ~zero (sem backend; BYOK paga a IA do próprio usuário).
- **Esforço estimado:** o gargalo é a **Extração** (DOM volátil) e a malha de E2E. Janela alvo do
  MVP: algumas semanas de trabalho focado, fatiado pelas specs da Onda 1.

## 7. Hipóteses e aprendizados
| Hipótese                                                        | Como medir                          | Resultado |
|-----------------------------------------------------------------|-------------------------------------|-----------|
| Diagnóstico por regras já entrega valor (sem IA)                | uso do checklist antes de configurar chave | a preencher |
| Pessoas toleram configurar a própria Chave de IA (BYOK)         | % que conclui o onboarding da chave | a preencher |
| Headline + "Sobre" é o par certo para começar a reescrita       | reescritas geradas / aplicadas por seção | a preencher |
| O DOM do perfil é estável o bastante para extração confiável    | nº de quebras de seletor por release | a preencher |
