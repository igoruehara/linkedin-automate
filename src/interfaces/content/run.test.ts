// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { run } from './run';

describe('content script run() — costura do ACL (AC-7)', () => {
  it('extrai o Perfil e marca o documento (não-PII), sem lançar', () => {
    document.body.innerHTML =
      '<main><section componentkey="x.RgTopcard"><div><div><div><h2>Nome</h2></div></div></div>' +
      '<p>Headline secreta</p></section></main>';

    expect(() => run(document)).not.toThrow();

    // marcador estrutural (6 tipos de Seção) — sinal de que rodou; o valor "6" não carrega PII
    expect(document.documentElement.dataset.curadorSecoes).toBe('6');
    expect(document.documentElement.dataset.curadorErro).toBeUndefined();
  });
});
