import {
  TipoDeSecao,
  criarSecao,
  criarPerfil,
  texto,
  itens,
  flag,
  type Secao,
  type ItemDeSecao,
  type Idioma,
  type Perfil,
} from '../../domain/perfil';
import type { ExtratorDePerfil } from '../../application/extracao';
import { SELETORES, ROTULOS } from './seletores';

/**
 * Anti-Corruption Layer da Extração: traduz o DOM volátil do LinkedIn no agregado `Perfil`
 * (Published Language). É o único módulo que toca seletores/DOM — o domínio permanece puro (AC-8).
 *
 * Leitura passiva (ADR-0005/0006): lê o **texto pleno do nó**, sem rede e sem ação de escrita.
 * O clique em "ver mais" (fallback quando o texto não está no nó) é tarefa #7 / E2E — NÃO acontece
 * aqui; por isso o AC-5 verifica que nenhum clique é disparado quando o texto já está no DOM.
 */
export class ExtratorDomLinkedin implements ExtratorDePerfil {
  extrair(documento: Document): Perfil {
    const secoes: Secao[] = [
      this.extrairFoto(documento),
      this.extrairHeadline(documento),
      this.extrairSobre(documento),
      this.extrairItens(documento, TipoDeSecao.EXPERIENCIA, SELETORES.anchorExperiencia),
      this.extrairItens(documento, TipoDeSecao.FORMACAO, SELETORES.anchorFormacao),
      this.extrairCompetencias(documento),
    ];
    return criarPerfil(secoes, this.detectarIdioma(documento));
  }

  /** Container da Seção a partir da âncora language-neutral. `null` ⇒ Seção AUSENTE no DOM. */
  private secaoContainer(documento: Document, anchor: string): Element | null {
    return documento.querySelector(anchor)?.closest('section') ?? null;
  }

  /** Texto normalizado de um nó (colapsa espaços). Nó ausente ⇒ string vazia. */
  private textoLimpo(el: Element | null | undefined): string {
    return (el?.textContent ?? '').replace(/\s+/g, ' ').trim();
  }

  /** Foto: flag(true) se há `<img>` de foto real com src http e não-fantasma; senão flag(false). */
  private extrairFoto(documento: Document): Secao {
    const card = documento.querySelector(SELETORES.topCard);
    const img = card?.querySelector(SELETORES.fotoReal);
    const src = img?.getAttribute('src') ?? '';
    const real = src.startsWith('http') && !src.includes('ghost');
    return criarSecao(TipoDeSecao.FOTO, flag(real));
  }

  private extrairHeadline(documento: Document): Secao {
    const card = documento.querySelector(SELETORES.topCard);
    if (!card) return criarSecao(TipoDeSecao.HEADLINE, null);
    return criarSecao(TipoDeSecao.HEADLINE, texto(this.textoLimpo(card.querySelector(SELETORES.headline))));
  }

  private extrairSobre(documento: Document): Secao {
    const c = this.secaoContainer(documento, SELETORES.anchorSobre);
    if (!c) return criarSecao(TipoDeSecao.SOBRE, null);
    // Texto pleno do nó (sem clique). Bloco presente porém sem texto ⇒ texto('') ⇒ VAZIA.
    return criarSecao(TipoDeSecao.SOBRE, texto(this.textoLimpo(c.querySelector(SELETORES.textoSobre))));
  }

  private extrairItens(documento: Document, tipo: TipoDeSecao, anchor: string): Secao {
    const c = this.secaoContainer(documento, anchor);
    if (!c) return criarSecao(tipo, null);
    const lista = Array.from(c.querySelectorAll(SELETORES.item), (li) => this.lerItem(li));
    return criarSecao(tipo, itens(lista));
  }

  /** Competências = lista de nomes (apenas `titulo`). */
  private extrairCompetencias(documento: Document): Secao {
    const c = this.secaoContainer(documento, SELETORES.anchorCompetencias);
    if (!c) return criarSecao(TipoDeSecao.COMPETENCIAS, null);
    const lista = Array.from(c.querySelectorAll(SELETORES.item), (li) => ({
      titulo: this.textoLimpo(li.querySelector(SELETORES.itemTitulo)),
    }));
    return criarSecao(TipoDeSecao.COMPETENCIAS, itens(lista));
  }

  private lerItem(li: Element): ItemDeSecao {
    const subtitulo = this.textoLimpo(li.querySelector(SELETORES.itemSubtitulo));
    const periodo = this.textoLimpo(li.querySelector(SELETORES.itemPeriodo));
    const item: { titulo: string; subtitulo?: string; periodo?: string } = {
      titulo: this.textoLimpo(li.querySelector(SELETORES.itemTitulo)),
    };
    if (subtitulo) item.subtitulo = subtitulo;
    if (periodo) item.periodo = periodo;
    return item;
  }

  /** Idioma pela maioria dos rótulos de cabeçalho reconhecidos; empate ⇒ PT (regra da spec). */
  private detectarIdioma(documento: Document): Idioma {
    let pt = 0;
    let en = 0;
    for (const el of Array.from(documento.querySelectorAll(SELETORES.headerSecao))) {
      const h = this.textoLimpo(el).toLowerCase();
      if (ROTULOS.PT.some((r) => h.includes(r))) pt++;
      else if (ROTULOS.EN.some((r) => h.includes(r))) en++;
    }
    return en > pt ? 'EN' : 'PT';
  }
}
