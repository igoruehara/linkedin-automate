import type { Perfil } from '../../domain/perfil';

/**
 * Porta (interface) da Extração. Recebe o documento da página e produz um `Perfil`.
 * A implementação concreta é o Anti-Corruption Layer em `infrastructure/` (depende só de domain/).
 */
export interface ExtratorDePerfil {
  extrair(documento: Document): Perfil;
}
