import { describe, it, expect, vi } from 'vitest';
import { ExtrairPerfilDaPagina } from './extrair-perfil-da-pagina';
import type { ExtratorDePerfil } from './extrator-de-perfil';
import { criarPerfil } from '../../domain/perfil';

describe('ExtrairPerfilDaPagina', () => {
  it('delega ao ExtratorDePerfil e retorna o Perfil produzido', () => {
    const esperado = criarPerfil([], 'PT');
    const extrator: ExtratorDePerfil = { extrair: vi.fn().mockReturnValue(esperado) };
    const uc = new ExtrairPerfilDaPagina(extrator);
    const documento = {} as Document;

    const perfil = uc.executar(documento);

    expect(extrator.extrair).toHaveBeenCalledWith(documento);
    expect(perfil).toBe(esperado);
  });
});
