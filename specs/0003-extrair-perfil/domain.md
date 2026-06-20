---
name: domain
description: Modelo DDD da feature. Puxe ao modelar agregados e linguagem.
alwaysApply: false
---

# Domain Model (DDD) — extrair-perfil

> Responde: qual a **linguagem** e o **modelo** do negócio.
> DDD tático dentro do bounded context. Termos aqui aparecem iguais no código e no `docs/glossary.md`.

## Bounded Context
**Extração de Perfil** — subdomínio **supporting** (necessário, não é o diferencial; o diferencial é a
Curadoria). Traduz o DOM volátil do LinkedIn no modelo `Perfil` e o publica para a Curadoria.

## Linguagem ubíqua
> Mesmo vocabulário entre negócio, spec e código. Promovido ao `docs/glossary.md` global.

| Termo            | Definição                																					   | NÃO confundir com |
|------------------|-----------------------------------------------------------------------------------|-------------------|
| `Perfil`         | Agregado raiz: o snapshot do perfil extraído numa Extração.                        | Conta do LinkedIn |
| `Seção`          | Bloco do Perfil identificado por um `TipoDeSeção`, com `EstadoDaSeção` e `Conteúdo`. | Aba do LinkedIn |
| `TipoDeSeção`    | Chave **canônica neutra de idioma**: FOTO · HEADLINE · SOBRE · EXPERIENCIA · FORMACAO · COMPETENCIAS. | Rótulo exibido (PT/EN) |
| `EstadoDaSeção`  | `PRESENTE` · `VAZIA` · `AUSENTE`.                                                  | `Conteúdo` |
| `Conteúdo`       | O dado da Seção: texto (Headline/Sobre), itens (Experiência/Formação/Competências) ou flag (Foto). | `Seção` |
| `Idioma do Perfil` | Idioma detectado dos rótulos (PT/EN); **metadado**, não entra nas chaves.        | `TipoDeSeção` |
| `ExtratorDePerfil` | **Porta** (interface) que produz um `Perfil` a partir do documento da página.    | ACL (implementação) |

## Agregados, entidades e value objects
- **Agregado `Perfil`** (raiz: `Perfil`)
  - **Value objects:**
    - `Seção` = { `tipo: TipoDeSeção`, `estado: EstadoDaSeção`, `conteudo: Conteúdo | null` }
    - `TipoDeSeção` (enum canônico)
    - `EstadoDaSeção` (enum)
    - `Conteúdo` (união): `ConteúdoTexto` (string) · `ConteúdoItens` (lista) · `ConteúdoFlag` (bool, p/ Foto)
  - **Estrutura:** `Perfil` = { `secoes: ReadonlyMap<TipoDeSeção, Seção>`, `idiomaDetectado: Idioma` }
  - **Invariantes (sempre verdadeiras):**
    - Cada `TipoDeSeção` aparece **no máximo uma vez** no Perfil.
    - `estado = AUSENTE` ⇒ `conteudo = null`.
    - `estado = VAZIA` ⇒ a Seção existe no DOM mas `conteudo` é o **vazio canônico do tipo**:
      `ConteúdoTexto = ""` · `ConteúdoItens = []`. (`ConteúdoFlag`/Foto não tem VAZIA — só PRESENTE/AUSENTE.)
    - `estado = PRESENTE` ⇒ `conteudo` não vazio.
    - `Perfil` é **imutável** após montado (snapshot de uma Extração).
  - **Fronteira de consistência:** o Perfil é montado **de uma vez** pela Extração; não há mutação parcial.

> Conteúdo por Seção (núcleo do MVP): FOTO=flag (tem foto real?) · HEADLINE=texto · SOBRE=texto ·
> EXPERIENCIA/FORMACAO=itens (cargo/instituição, período) · COMPETENCIAS=lista de strings.

## Eventos de domínio
| Evento (passado) | Disparado quando            | Quem reage                 |
|------------------|-----------------------------|----------------------------|
| `PerfilExtraido` | a Extração conclui o `Perfil`| Curadoria (feature futura) — opcional; hoje o caso de uso só retorna o `Perfil`. |

## Relações com outros contextos
- **LinkedIn (DOM) → Extração de Perfil:** **Anti-Corruption Layer** — o ACL traduz HTML instável em
  `Perfil`. Expandir "ver mais" é leitura ([ADR-0006](../../docs/architecture/adr/0006-fronteira-leitura-expandir-ui.md)).
- **Extração de Perfil → Curadoria:** **Published Language** — `Perfil` é o contrato estável publicado.
  Mudança em `Perfil` é decisão consciente (afeta a Curadoria). Atualizar `docs/architecture/context-map.md` se a fronteira mudar.
