import { describe, it, expect } from 'vitest';
import {
  criarSecao,
  criarPerfil,
  texto,
  itens,
  flag,
  TipoDeSecao,
  EstadoDaSecao,
} from './index';

describe('criarSecao — matriz de decisão do EstadoDaSecao', () => {
  it('texto não-vazio → PRESENTE (AC-1)', () => {
    const s = criarSecao(TipoDeSecao.SOBRE, texto('Engenheira de software focada em...'));
    expect(s.estado).toBe(EstadoDaSecao.PRESENTE);
  });

  it('texto só com espaços → VAZIA com texto("") (AC-4)', () => {
    const s = criarSecao(TipoDeSecao.SOBRE, texto('   '));
    expect(s.estado).toBe(EstadoDaSecao.VAZIA);
    expect(s.conteudo).toEqual(texto(''));
  });

  it('itens vazios → VAZIA com itens([]) (AC-4)', () => {
    const s = criarSecao(TipoDeSecao.EXPERIENCIA, itens([]));
    expect(s.estado).toBe(EstadoDaSecao.VAZIA);
    expect(s.conteudo).toEqual(itens([]));
  });

  it('conteudo nulo → AUSENTE sem conteúdo (AC-3)', () => {
    const s = criarSecao(TipoDeSecao.FORMACAO, null);
    expect(s.estado).toBe(EstadoDaSecao.AUSENTE);
    expect(s.conteudo).toBeNull();
  });

  it('Foto: flag(true) → PRESENTE; flag(false) → AUSENTE sem conteúdo (AC-6)', () => {
    expect(criarSecao(TipoDeSecao.FOTO, flag(true)).estado).toBe(EstadoDaSecao.PRESENTE);
    const semFoto = criarSecao(TipoDeSecao.FOTO, flag(false));
    expect(semFoto.estado).toBe(EstadoDaSecao.AUSENTE);
    expect(semFoto.conteudo).toBeNull();
  });
});

describe('criarPerfil — invariantes do agregado', () => {
  it('no máximo 1 Seção por TipoDeSecao — mantém a primeira', () => {
    const primeira = criarSecao(TipoDeSecao.HEADLINE, texto('Headline A'));
    const duplicata = criarSecao(TipoDeSecao.HEADLINE, texto('Headline B'));
    const p = criarPerfil([primeira, duplicata], 'PT');
    expect(p.secoes.size).toBe(1);
    expect(p.secoes.get(TipoDeSecao.HEADLINE)).toBe(primeira);
  });

  it('guarda o idioma detectado', () => {
    expect(criarPerfil([], 'EN').idiomaDetectado).toBe('EN');
  });

  it('é imutável (frozen)', () => {
    expect(Object.isFrozen(criarPerfil([], 'PT'))).toBe(true);
  });
});
