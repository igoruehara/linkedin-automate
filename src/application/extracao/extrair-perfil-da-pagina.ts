import type { Perfil } from '../../domain/perfil';
import type { ExtratorDePerfil } from './extrator-de-perfil';

/**
 * Caso de uso: orquestra a extração do `Perfil` da página aberta. Não conhece o DOM nem o LinkedIn —
 * delega ao `ExtratorDePerfil` (porta), cuja implementação é o ACL. Sem rede, sem ação de escrita.
 */
export class ExtrairPerfilDaPagina {
  constructor(private readonly extrator: ExtratorDePerfil) {}

  executar(documento: Document): Perfil {
    return this.extrator.extrair(documento);
  }
}
