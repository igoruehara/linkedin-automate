import { describe, it, expect } from 'vitest';
import { clamp } from './clamp';

describe('clamp', () => {
  it('mantém o valor quando já está dentro do intervalo', () => {
    expect(clamp(50, 0, 100)).toBe(50);
  });

  it('satura no mínimo e no máximo', () => {
    expect(clamp(-10, 0, 100)).toBe(0);
    expect(clamp(150, 0, 100)).toBe(100);
  });

  it('NaN cai no mínimo', () => {
    expect(clamp(Number.NaN, 0, 100)).toBe(0);
  });
});
