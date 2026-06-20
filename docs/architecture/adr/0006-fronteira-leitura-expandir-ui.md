---
name: ADR-0006
description: Refina a fronteira "só leitura" do ADR-0003 — expandir a UI local do próprio usuário (ex.: "ver mais") é leitura; ações que criam/alteram dado ou sinal social não são. Puxe ao mexer em extração ou em qualquer interação com a página do LinkedIn.
alwaysApply: false
---

# ADR-0006: Expandir a UI local é leitura (refina o ADR-0003)

- **Status:** aceito
- **Data:** 2026-06-20
- **Decisores:** Igor

## Contexto
O [ADR-0003](0003-extracao-via-dom-com-acl.md) fixou **"só leitura do que o usuário já vê, sem ações de
automação"** como a fronteira de ToS do produto. A feature `0003-extrair-perfil` precisa capturar o
**texto completo** de Seções como "Sobre" e "Experiência", que o LinkedIn às vezes **trunca** ("ver
mais") ou entrega em **seções recolhidas**. Isso exige, em alguns casos, **clicar para expandir** —
levantando a dúvida: expandir a UI é uma "ação" proibida?

## Decisão
Vamos **refinar a fronteira**: **leitura inclui expandir, localmente, a própria UI do usuário** —
clicar "ver mais", abrir seções recolhidas, rolar a página — para revelar **conteúdo que já pertence
ao usuário** e que ele já poderia ver manualmente.
- **Continua proibido** (não é leitura): qualquer ação que **crie ou modifique dado ou sinal social** —
  conexão, mensagem, like, follow, comentário, endosso, edição do perfil, ou **qualquer requisição de
  rede que altere estado**. Expandir deve ser **interação de DOM local**, sem egress.
- O subagente **`privacy-guard`** passa a checar essa distinção (expandir UI ✓ · ação de estado ✗).
- A estratégia preferida ainda é **ler o texto pleno do nó** (sem clicar); expandir é **fallback**
  quando o conteúdo está de fato oculto.

**Alternativa descartada:** tratar qualquer clique como "ação" e proibir — perderia texto recolhido e
empobreceria o diagnóstico/reescrita, sem ganho real de conformidade (expandir não muda nada no LinkedIn).

## Consequências
- **+** Habilita extração fiel (texto completo) mantendo o produto dentro de "leitura passiva".
- **+** Fronteira explícita e verificável (lista do que é proibido) para o `privacy-guard` e revisões.
- **−** Acoplamento à UI do LinkedIn (controles de "ver mais" podem mudar) — isolado no ACL e coberto por fixtures.
- **−** Exige disciplina: a distinção "expandir vs agir" precisa ser respeitada em toda interação futura.
