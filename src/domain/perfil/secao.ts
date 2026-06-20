import { EstadoDaSecao } from './estado-da-secao';
import type { TipoDeSecao } from './tipo-de-secao';
import { type Conteudo, estaVazio, itens, texto } from './conteudo';

export type Secao = Readonly<{
  tipo: TipoDeSecao;
  estado: EstadoDaSecao;
  conteudo: Conteudo | null;
}>;

/**
 * Monta uma Seção aplicando a matriz de decisão do `EstadoDaSecao` (ver spec 0003):
 * - `conteudo` nulo            → `AUSENTE` (sem conteúdo)
 * - Foto (flag)                → `PRESENTE` se true; `AUSENTE` se false (Foto não tem `VAZIA`)
 * - texto/itens vazios         → `VAZIA` com o **vazio canônico** do tipo (`""` / `[]`)
 * - caso contrário             → `PRESENTE`
 */
export function criarSecao(tipo: TipoDeSecao, conteudo: Conteudo | null): Secao {
  if (conteudo === null) {
    return { tipo, estado: EstadoDaSecao.AUSENTE, conteudo: null };
  }
  if (conteudo.tipo === 'flag') {
    return conteudo.valor
      ? { tipo, estado: EstadoDaSecao.PRESENTE, conteudo }
      : { tipo, estado: EstadoDaSecao.AUSENTE, conteudo: null };
  }
  if (estaVazio(conteudo)) {
    const vazioCanonico = conteudo.tipo === 'texto' ? texto('') : itens([]);
    return { tipo, estado: EstadoDaSecao.VAZIA, conteudo: vazioCanonico };
  }
  return { tipo, estado: EstadoDaSecao.PRESENTE, conteudo };
}
