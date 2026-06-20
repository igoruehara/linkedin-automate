/**
 * Seletores e dicionários do ACL de Extração — o ÚNICO lugar que conhece o HTML do LinkedIn
 * (Anti-Corruption Layer, ADR-0003). Centralizados para baratear o conserto quando o DOM mudar.
 *
 * CALIBRADO contra HTML real (perfil "SDUI" do LinkedIn, 2026-06). As classes CSS são hasheadas
 * e voláteis (`_3d4c77c2`…) — NÃO usar. Os hooks estáveis são:
 *   - `componentkey` (ex.: `…RgAbout`, `entity-collection-item-…`)
 *   - `data-testid`  (ex.: `expandable-text-box`)
 * Ao quebrar, recalibrar com `dom-extraction-auditor` sobre nova amostra (ver docs/STATE.md).
 */

/** Sufixos de `componentkey` que ancoram cada Seção do núcleo (o prefixo `ref<id>` varia por perfil). */
export const SECOES = {
  topcard: 'RgTopcard',
  sobre: 'RgAbout',
  experiencia: 'RgExperienceTopLevelSection',
  formacao: 'RgEducationTopLevelSection',
  competencias: 'RgSkills',
} as const;

export const SELETORES = {
  /** Encontra uma Seção pelo sufixo estável do `componentkey`. */
  secaoPorChave: (sufixo: string) => `[componentkey$="${sufixo}"]`,
  /** Headline = primeiro parágrafo do topcard. */
  headline: 'p',
  /** Foto real (≠ capa `displaybackgroundimage` e ≠ logos de empresa). Ausência ⇒ placeholder. */
  fotoReal: 'img[src*="profile-displayphoto"]',
  /** Texto expansível (Sobre, descrições) — hook estável. */
  textoExpansivel: '[data-testid="expandable-text-box"]',
  /** Controle "ver mais" do texto expansível. */
  botaoVerMais: '[data-testid="expandable-text-button"]',
  /** Item de coleção (Experiência/Formação/Competências). */
  item: '[componentkey^="entity-collection-item-"]',
  /** Chip de competência associada / link de overlay — texto a IGNORAR dentro de um item. */
  overlay: 'a[href*="/overlay/"]',
  /** Cabeçalho da Seção (para detectar idioma). */
  cabecalho: 'h2',
} as const;

/**
 * Rótulos de cabeçalho por idioma — usados SÓ para detectar o `Idioma` do Perfil. As chaves
 * (`TipoDeSeção`) continuam neutras (vêm do `componentkey`). Comparação lowercase + `includes`.
 */
export const ROTULOS: Record<'PT' | 'EN', readonly string[]> = {
  PT: ['sobre', 'experiência', 'formação', 'educação', 'competências', 'conhecimentos'],
  EN: ['about', 'experience', 'education', 'skills'],
};
