---
name: spec
description: Contrato da feature (critérios de aceite). Base enquanto a feature está ativa.
alwaysApply: true
---

# Spec — extrair-perfil

> **Fonte da verdade.** Status: rascunho | em review | aprovado | implementado
> Critérios de aceite = contrato + oráculo de teste + prompt do agente. Escreva-os executáveis.

## Resumo
A partir do documento da página de perfil aberta, montar o agregado `Perfil` com as 6 Seções do
núcleo (FOTO, HEADLINE, SOBRE, EXPERIENCIA, FORMACAO, COMPETENCIAS), cada uma com `EstadoDaSeção`
(Presente/Vazia/Ausente) e `Conteúdo`, normalizando idioma (PT/EN) para chaves canônicas — tudo via
Anti-Corruption Layer, sem rede e sem ações de escrita. Detalhe em `design.md` e `domain.md`.

## Critérios de aceite
> Given/When/Then, testável e não-ambíguo. Cada `AC-N` reaparece em `tasks.md`, no teste e no commit.

### AC-1: Extrai as 6 Seções de um perfil PT completo
- **Dado** a fixture `perfil-pt-completo.html` **e seu golden versionado `perfil-pt-completo.expected.json`**
  (o oráculo dos valores esperados, criado junto da fixture na task 4)
- **Quando** `ExtratorDePerfil.extrair(document)` roda
- **Então** o `Perfil` contém as 6 Seções do núcleo com `estado = PRESENTE` e cada `Conteúdo` **igual ao
  golden** (Headline, Sobre, itens de Experiência/Formação, lista de Competências, Foto = presente).
  O teste compara o `Perfil` extraído com o `.expected.json` — sem valores "esperados" inventados no código.

### AC-2: Idioma normalizado — EN produz as mesmas chaves canônicas
- **Dado** a fixture `perfil-en-completo.html` (rótulos em inglês)
- **Quando** extrair
- **Então** as Seções têm os **mesmos `TipoDeSeção` canônicos** do AC-1 (independem do idioma do
  rótulo) e `Perfil.idiomaDetectado = EN`.

### AC-3: Seção ausente vira AUSENTE sem Conteúdo
- **Dado** a fixture `perfil-pt-sem-sobre.html` (sem a seção "Sobre")
- **Quando** extrair
- **Então** a Seção `SOBRE` tem `estado = AUSENTE` e `conteudo = null`; as demais Seções permanecem corretas.

### AC-4: Seção presente porém vazia vira VAZIA
- **Dado** a fixture `perfil-pt-sobre-vazio.html` (bloco "Sobre" presente, sem texto)
- **Quando** extrair
- **Então** `SOBRE.estado = VAZIA` e `conteudo` é o **vazio canônico do tipo**: `ConteúdoTexto = ""`
  (string vazia), `ConteúdoItens = []` (lista vazia). `ConteúdoFlag` (Foto) não tem estado VAZIA —
  só `PRESENTE`/`AUSENTE` (ver AC-6).

### AC-5: Texto recolhido/"ver mais" é capturado por completo
- **Dado** a fixture `perfil-pt-sobre-recolhido.html` (texto truncado por CSS, com o texto pleno no DOM)
- **Quando** extrair
- **Então** `SOBRE.conteudo` é o **texto completo**, sem o sufixo "…ver mais" nem truncamento, e
  **nenhum clique ocorre** (o texto pleno já estava no nó) — o teste **falha** se houver clique desnecessário.
- **E (DOM vivo, E2E)** quando o texto **não** está no nó (só aparece após expandir), a extração **clica
  uma vez** no controle "ver mais" (leitura, [ADR-0006](../../docs/architecture/adr/0006-fronteira-leitura-expandir-ui.md))
  e captura o texto completo. **Predicado:** clicar **se e somente se** o texto pleno não estiver no DOM.

### AC-6: Foto real distinguida de placeholder
- **Dado** as fixtures `perfil-com-foto.html` e `perfil-sem-foto.html` (avatar padrão)
- **Quando** extrair
- **Então** `FOTO.estado = PRESENTE` no primeiro e `AUSENTE` no segundo.

### AC-7: Extração é leitura passiva — sem egress e sem ação de escrita
- **Dado** a extração rodando no DOM vivo (E2E)
- **Quando** o `Perfil` é montado
- **Então** **nenhuma** requisição de rede sai do navegador e **nenhuma** ação de estado é disparada
  (conexão, mensagem, like, follow, edição); a **única** interação permitida é expandir "ver mais"
  (ADR-0006). O teste **falha** se houver egress ou ação de escrita.

### AC-8: O domínio permanece puro
- **Dado** o código de `src/domain/perfil/`
- **Quando** `pnpm lint` roda
- **Então** nada em `domain/` importa DOM, framework ou `infrastructure/` (regra de fronteira da 0002);
  toda dependência de DOM vive no ACL em `infrastructure/`.

## Matriz de decisão — `EstadoDaSeção`
> Cada linha vira um caso de teste (fixtures).

| Seção presente no DOM | Conteúdo não-vazio | `EstadoDaSeção` | AC   |
|-----------------------|--------------------|-----------------|------|
| não                   | —                  | `AUSENTE`       | AC-3 |
| sim                   | não                | `VAZIA`         | AC-4 |
| sim                   | sim                | `PRESENTE`      | AC-1 |

## Casos de borda e erros
- **Rótulo desconhecido** (idioma não-PT/EN ou variação): a Seção não-mapeada é ignorada; as do núcleo
  reconhecidas são extraídas. Sem exceção não tratada.
- **HTML parcial / nó faltando:** trata como `AUSENTE`, nunca quebra a Extração das demais Seções.
- **"Ver mais" sem texto pleno no DOM e sem botão:** retorna o texto disponível e marca log de dev
  ("Seção truncada") **sem** o conteúdo (PII) — ADR-0005.
- **Múltiplos blocos do mesmo tipo:** mantém o primeiro/principal (invariante: 1 por `TipoDeSeção`).
- **Idioma misto/parcial:** `idiomaDetectado` é decidido pela **maioria dos rótulos reconhecidos** (PT
  ou EN). Perfis genuinamente bilíngues balanceados ficam **fora de escopo** — desempate fixo em PT.

## Fora de escopo
- Regras, Achados, Diagnóstico, Pontuação, Checklist (próxima feature).
- Reescrita Assistida / LLM.
- Seções Banner, Destaques, Recomendações; páginas que não sejam o perfil.
- Idiomas além de PT/EN.

## Rastreabilidade
- Product: `./product.md` · Design: `./design.md` · Domínio: `./domain.md`
- ADRs: [0003](../../docs/architecture/adr/0003-extracao-via-dom-com-acl.md) ·
  [0005](../../docs/architecture/adr/0005-byok-privacidade-cliente.md) ·
  [0006](../../docs/architecture/adr/0006-fronteira-leitura-expandir-ui.md)
