/**
 * Chave canônica neutra de idioma de uma Seção (núcleo do MVP). O ACL traduz os rótulos PT/EN
 * para estas chaves; o domínio não conhece idioma. (Glossário: `TipoDeSeção`.)
 */
export const TipoDeSecao = {
  FOTO: 'FOTO',
  HEADLINE: 'HEADLINE',
  SOBRE: 'SOBRE',
  EXPERIENCIA: 'EXPERIENCIA',
  FORMACAO: 'FORMACAO',
  COMPETENCIAS: 'COMPETENCIAS',
} as const;

export type TipoDeSecao = (typeof TipoDeSecao)[keyof typeof TipoDeSecao];
