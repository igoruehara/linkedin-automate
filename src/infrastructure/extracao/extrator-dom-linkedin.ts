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
import { SECOES, SELETORES, ROTULOS } from './seletores';

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
      this.extrairItens(documento, TipoDeSecao.EXPERIENCIA, SECOES.experiencia),
      this.extrairItens(documento, TipoDeSecao.FORMACAO, SECOES.formacao),
      this.extrairCompetencias(documento),
    ];
    return criarPerfil(secoes, this.detectarIdioma(documento));
  }

  /** Elemento de uma Seção pelo sufixo do `componentkey`. `null` ⇒ Seção AUSENTE no DOM. */
  private secao(documento: Document, sufixo: string): Element | null {
    return documento.querySelector(SELETORES.secaoPorChave(sufixo));
  }

  /** Texto normalizado de um nó (colapsa espaços). Nó ausente ⇒ string vazia. */
  private textoLimpo(el: Element | null | undefined): string {
    return (el?.textContent ?? '').replace(/\s+/g, ' ').trim();
  }

  /** Texto preservando parágrafos: `<br>` → quebra de linha; linhas vazias removidas. */
  private textoComParagrafos(el: Element | null): string {
    if (!el) return '';
    const partes: string[] = [];
    const visitar = (no: Node): void => {
      for (const filho of Array.from(no.childNodes)) {
        if (filho.nodeType === 3) partes.push(filho.textContent ?? '');
        else if (filho.nodeType === 1) {
          if ((filho as Element).tagName === 'BR') partes.push('\n');
          else visitar(filho);
        }
      }
    };
    visitar(el);
    return partes
      .join('')
      .split('\n')
      .map((linha) => linha.replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .join('\n');
  }

  /** Foto: flag(true) se há `<img>` de foto real (profile-displayphoto) no topcard; senão flag(false). */
  private extrairFoto(documento: Document): Secao {
    const top = this.secao(documento, SECOES.topcard);
    return criarSecao(TipoDeSecao.FOTO, flag(!!top?.querySelector(SELETORES.fotoReal)));
  }

  private extrairHeadline(documento: Document): Secao {
    const top = this.secao(documento, SECOES.topcard);
    if (!top) return criarSecao(TipoDeSecao.HEADLINE, null);
    return criarSecao(TipoDeSecao.HEADLINE, texto(this.textoLimpo(top.querySelector(SELETORES.headline))));
  }

  private extrairSobre(documento: Document): Secao {
    const sec = this.secao(documento, SECOES.sobre);
    if (!sec) return criarSecao(TipoDeSecao.SOBRE, null);
    // Texto pleno do nó (sem clique). Bloco presente porém sem texto ⇒ texto('') ⇒ VAZIA.
    return criarSecao(TipoDeSecao.SOBRE, texto(this.textoComParagrafos(sec.querySelector(SELETORES.textoExpansivel))));
  }

  private extrairItens(documento: Document, tipo: TipoDeSecao, sufixo: string): Secao {
    const sec = this.secao(documento, sufixo);
    if (!sec) return criarSecao(tipo, null);
    const lista = Array.from(sec.querySelectorAll(SELETORES.item), (it) => this.lerItem(it)).filter(
      (i) => i.titulo !== '',
    );
    return criarSecao(tipo, itens(lista));
  }

  /** Item de Experiência/Formação: 3 primeiras linhas relevantes = título, subtítulo, período. */
  private lerItem(item: Element): ItemDeSecao {
    const linhas = this.linhasRelevantes(item);
    const r: { titulo: string; subtitulo?: string; periodo?: string } = { titulo: linhas[0] ?? '' };
    if (linhas[1]) r.subtitulo = linhas[1];
    if (linhas[2]) r.periodo = linhas[2];
    return r;
  }

  /** Competências = nome de cada item (1ª linha relevante). */
  private extrairCompetencias(documento: Document): Secao {
    const sec = this.secao(documento, SECOES.competencias);
    if (!sec) return criarSecao(TipoDeSecao.COMPETENCIAS, null);
    const lista = Array.from(sec.querySelectorAll(SELETORES.item), (it) => ({
      titulo: this.linhasRelevantes(it)[0] ?? '',
    })).filter((i) => i.titulo !== '');
    return criarSecao(TipoDeSecao.COMPETENCIAS, itens(lista));
  }

  /**
   * Linhas de texto de um item, em ordem, ignorando chips de competência (`a[href*="/overlay/"]`)
   * e sublistas (`role="list"`); deduplica textos consecutivos iguais (o LinkedIn às vezes repete
   * o texto visível + a cópia para leitor de tela).
   */
  private linhasRelevantes(item: Element): string[] {
    const linhas: string[] = [];
    const coletar = (no: Node): void => {
      for (const filho of Array.from(no.childNodes)) {
        if (filho.nodeType === 3) {
          const t = (filho.textContent ?? '').replace(/\s+/g, ' ').trim();
          if (t && linhas[linhas.length - 1] !== t) linhas.push(t);
        } else if (filho.nodeType === 1) {
          const e = filho as Element;
          if (e.matches(SELETORES.overlay) || e.getAttribute('role') === 'list') continue;
          coletar(e);
        }
      }
    };
    coletar(item);
    return linhas;
  }

  /** Idioma pela maioria dos cabeçalhos de Seção reconhecidos; empate ⇒ PT (regra da spec). */
  private detectarIdioma(documento: Document): Idioma {
    let pt = 0;
    let en = 0;
    for (const sufixo of Object.values(SECOES)) {
      const h = this.textoLimpo(this.secao(documento, sufixo)?.querySelector(SELETORES.cabecalho)).toLowerCase();
      if (!h) continue;
      if (ROTULOS.PT.some((r) => h.includes(r))) pt++;
      else if (ROTULOS.EN.some((r) => h.includes(r))) en++;
    }
    return en > pt ? 'EN' : 'PT';
  }
}
