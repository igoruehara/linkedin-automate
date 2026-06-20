/** Item estruturado: Experiência (cargo/empresa/período) ou Formação (curso/instituição/período). */
export type ItemDeSecao = Readonly<{
  titulo: string;
  subtitulo?: string;
  periodo?: string;
}>;

export type ConteudoTexto = Readonly<{ tipo: 'texto'; valor: string }>;
export type ConteudoItens = Readonly<{ tipo: 'itens'; itens: readonly ItemDeSecao[] }>;
export type ConteudoFlag = Readonly<{ tipo: 'flag'; valor: boolean }>;

/** O dado de uma Seção: texto (Headline/Sobre), itens (Experiência/Formação/Competências) ou flag (Foto). */
export type Conteudo = ConteudoTexto | ConteudoItens | ConteudoFlag;

export const texto = (valor: string): ConteudoTexto => ({ tipo: 'texto', valor });
export const itens = (lista: readonly ItemDeSecao[]): ConteudoItens => ({ tipo: 'itens', itens: lista });
export const flag = (valor: boolean): ConteudoFlag => ({ tipo: 'flag', valor });

/** Vazio = texto só com espaços, lista sem itens, ou flag falsa. */
export function estaVazio(conteudo: Conteudo): boolean {
  switch (conteudo.tipo) {
    case 'texto':
      return conteudo.valor.trim() === '';
    case 'itens':
      return conteudo.itens.length === 0;
    case 'flag':
      return conteudo.valor === false;
  }
}
