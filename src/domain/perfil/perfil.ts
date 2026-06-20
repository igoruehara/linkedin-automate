import type { Idioma } from './idioma';
import type { Secao } from './secao';
import type { TipoDeSecao } from './tipo-de-secao';

/** Snapshot imutável do perfil extraído numa Extração. (Glossário: `Perfil`.) */
export type Perfil = Readonly<{
  secoes: ReadonlyMap<TipoDeSecao, Secao>;
  idiomaDetectado: Idioma;
}>;

/**
 * Monta o Perfil. Invariante: no máximo **1 Seção por `TipoDeSecao`** — em duplicatas, mantém a
 * primeira (caso de borda "múltiplos blocos do mesmo tipo"). O Perfil resultante é congelado.
 */
export function criarPerfil(secoes: readonly Secao[], idiomaDetectado: Idioma): Perfil {
  const mapa = new Map<TipoDeSecao, Secao>();
  for (const secao of secoes) {
    if (!mapa.has(secao.tipo)) mapa.set(secao.tipo, secao);
  }
  return Object.freeze({ secoes: mapa, idiomaDetectado });
}
