/** Situação de uma Seção no Perfil. (Glossário: `EstadoDaSeção`.) */
export const EstadoDaSecao = {
  PRESENTE: 'PRESENTE',
  VAZIA: 'VAZIA',
  AUSENTE: 'AUSENTE',
} as const;

export type EstadoDaSecao = (typeof EstadoDaSecao)[keyof typeof EstadoDaSecao];
