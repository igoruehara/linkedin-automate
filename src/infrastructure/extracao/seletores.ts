/**
 * Seletores e dicionários do ACL de Extração — o ÚNICO lugar que conhece o HTML do LinkedIn
 * (Anti-Corruption Layer, ADR-0003). Mantê-los centralizados torna o conserto barato quando o
 * DOM mudar (o `dom-extraction-auditor` mexe só aqui).
 *
 * ⚠️ PROVISÓRIO (decisão (b) da retomada da 0003, 2026-06-20): a estrutura abaixo deriva de
 * padrões conhecidos do DOM do LinkedIn, porém SEM amostra de HTML real. As fixtures em
 * `./fixtures/` espelham exatamente estes seletores — por isso os testes passam: é andaime
 * estrutural, NÃO prova de fidelidade. Recalibrar com `dom-extraction-auditor` sobre HTML real
 * antes de marcar a feature como pronta (ver docs/STATE.md).
 */
export const SELETORES = {
  /** Cartão do topo do perfil (Headline + Foto). */
  topCard: '.pv-top-card',
  /** Headline — relativo ao topCard. */
  headline: '.text-body-medium',
  /** Foto real (vs avatar fantasma/placeholder) — relativo ao topCard. */
  fotoReal: 'img.pv-top-card-profile-picture__image',

  /** Âncoras language-neutral das Seções (ids estáveis do LinkedIn → robustez entre PT/EN). */
  anchorSobre: '#about',
  anchorExperiencia: '#experience',
  anchorFormacao: '#education',
  anchorCompetencias: '#skills',

  /** Texto do "Sobre" — relativo à seção. O texto pleno já vive no nó (sem clique; ver AC-5). */
  textoSobre: '.inline-show-more-text span[aria-hidden="true"]',

  /** Item de lista (Experiência/Formação/Competências) — relativo à seção. */
  item: 'li.artdeco-list__item',
  /** Campos de um item — relativos ao item. */
  itemTitulo: '.t-bold span[aria-hidden="true"]',
  itemSubtitulo: '.t-normal span[aria-hidden="true"]',
  itemPeriodo: '.t-black--light span[aria-hidden="true"]',

  /** Rótulos de cabeçalho de Seção (document-level) — usados só para detectar o Idioma. */
  headerSecao: 'section h2 span[aria-hidden="true"]',
} as const;

/**
 * Rótulos de cabeçalho por idioma — usados SÓ para detectar o `Idioma` do Perfil. As chaves
 * (`TipoDeSeção`) continuam neutras e vêm das âncoras acima. Comparação é lowercase + `includes`.
 */
export const ROTULOS: Record<'PT' | 'EN', readonly string[]> = {
  PT: ['sobre', 'experiência', 'formação', 'educação', 'competências', 'conhecimentos'],
  EN: ['about', 'experience', 'education', 'skills'],
};
