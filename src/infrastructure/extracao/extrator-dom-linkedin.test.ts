// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { ExtratorDomLinkedin } from './extrator-dom-linkedin';
import { EstadoDaSecao, TipoDeSecao, type Perfil } from '../../domain/perfil';
import goldenPtCompleto from './fixtures/perfil-pt-completo.expected.json';
// Fixtures como string (Vite `?raw`) — sem resolução de caminho em runtime (frágil sob jsdom).
import htmlPtCompleto from './fixtures/perfil-pt-completo.html?raw';
import htmlEnCompleto from './fixtures/perfil-en-completo.html?raw';
import htmlSemSobre from './fixtures/perfil-pt-sem-sobre.html?raw';
import htmlSobreVazio from './fixtures/perfil-pt-sobre-vazio.html?raw';
import htmlSobreRecolhido from './fixtures/perfil-pt-sobre-recolhido.html?raw';
import htmlComFoto from './fixtures/perfil-com-foto.html?raw';
import htmlSemFoto from './fixtures/perfil-sem-foto.html?raw';

/** Parseia uma fixture de HTML num Document (parser real do jsdom). */
function carregar(html: string): Document {
  return new DOMParser().parseFromString(html, 'text/html');
}

/** Serializa o Perfil (Map) para comparar com o golden `.expected.json`. */
function perfilParaJson(p: Perfil) {
  return { idiomaDetectado: p.idiomaDetectado, secoes: Object.fromEntries(p.secoes) };
}

const extrator = new ExtratorDomLinkedin();
const NUCLEO = [
  TipoDeSecao.FOTO,
  TipoDeSecao.HEADLINE,
  TipoDeSecao.SOBRE,
  TipoDeSecao.EXPERIENCIA,
  TipoDeSecao.FORMACAO,
  TipoDeSecao.COMPETENCIAS,
];

describe('ExtratorDomLinkedin (ACL) — fixtures provisórias', () => {
  it('AC-1: extrai as 6 Seções de um perfil PT completo, igual ao golden', () => {
    const perfil = extrator.extrair(carregar(htmlPtCompleto));
    expect(perfilParaJson(perfil)).toEqual(goldenPtCompleto);
  });

  it('AC-2: EN produz as mesmas chaves canônicas e idiomaDetectado = EN', () => {
    const perfil = extrator.extrair(carregar(htmlEnCompleto));
    expect(perfil.idiomaDetectado).toBe('EN');
    expect(new Set(perfil.secoes.keys())).toEqual(new Set(NUCLEO));
    for (const tipo of NUCLEO) {
      expect(perfil.secoes.get(tipo)?.estado).toBe(EstadoDaSecao.PRESENTE);
    }
  });

  it('AC-3: Seção ausente vira AUSENTE sem conteúdo; as demais permanecem corretas', () => {
    const perfil = extrator.extrair(carregar(htmlSemSobre));
    const sobre = perfil.secoes.get(TipoDeSecao.SOBRE);
    expect(sobre?.estado).toBe(EstadoDaSecao.AUSENTE);
    expect(sobre?.conteudo).toBeNull();
    expect(perfil.secoes.get(TipoDeSecao.EXPERIENCIA)?.estado).toBe(EstadoDaSecao.PRESENTE);
  });

  it('AC-4: Seção presente porém vazia vira VAZIA com o vazio canônico ("")', () => {
    const perfil = extrator.extrair(carregar(htmlSobreVazio));
    const sobre = perfil.secoes.get(TipoDeSecao.SOBRE);
    expect(sobre?.estado).toBe(EstadoDaSecao.VAZIA);
    expect(sobre?.conteudo).toEqual({ tipo: 'texto', valor: '' });
  });

  it('AC-5: texto recolhido é capturado por completo, sem clicar em "ver mais"', () => {
    const doc = carregar(htmlSobreRecolhido);
    const botao = doc.querySelector<HTMLButtonElement>('[data-testid="expandable-text-button"]');
    const spy = vi.spyOn(botao!, 'click');

    const sobre = extrator.extrair(doc).secoes.get(TipoDeSecao.SOBRE);

    expect(sobre?.estado).toBe(EstadoDaSecao.PRESENTE);
    const valor = (sobre?.conteudo as { tipo: 'texto'; valor: string }).valor;
    expect(valor).toBe(
      'Engenheira de software com 8 anos construindo produtos web. Apaixonada por DDD, testes, mentoria e por levar qualidade da spec à produção.',
    );
    expect(valor).not.toContain('ver mais');
    expect(spy).not.toHaveBeenCalled();
  });

  it('AC-6: foto real ⇒ FOTO PRESENTE; placeholder ⇒ FOTO AUSENTE', () => {
    const comFoto = extrator.extrair(carregar(htmlComFoto));
    expect(comFoto.secoes.get(TipoDeSecao.FOTO)?.estado).toBe(EstadoDaSecao.PRESENTE);

    const semFoto = extrator.extrair(carregar(htmlSemFoto));
    expect(semFoto.secoes.get(TipoDeSecao.FOTO)?.estado).toBe(EstadoDaSecao.AUSENTE);
  });
});
