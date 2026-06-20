// @vitest-environment jsdom
//
// Convenção (task #3): os testes de `infrastructure/` rodam em jsdom — o ACL de
// Extração precisa de um `document` para parsear as fixtures de HTML. O default do
// Vitest é `node` (ver vitest.config.ts), para manter os testes de `domain/` puros.
// Todo novo teste de `infrastructure/` que toca o DOM deve repetir o docblock acima.
import { describe, it, expect } from 'vitest';

describe('ambiente jsdom para a camada infrastructure', () => {
  it('expõe um document para parsear fixtures de HTML', () => {
    expect(typeof document).not.toBe('undefined');
    document.body.innerHTML = '<main><h1>Perfil</h1></main>';
    expect(document.querySelector('main h1')?.textContent).toBe('Perfil');
  });
});
