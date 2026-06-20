/**
 * Restringe um número ao intervalo [min, max]. Função pura, sem dependências —
 * base futura da Pontuação (0–100). Domínio não toca DOM, framework nem IO.
 */
export function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}
