import { ExtrairPerfilDaPagina } from '../../application/extracao';
import { ExtratorDomLinkedin } from '../../infrastructure/extracao/extrator-dom-linkedin';

/**
 * Borda do content script: compõe o ACL concreto (`ExtratorDomLinkedin`) com o caso de uso e extrai
 * o `Perfil` da página aberta. **Leitura passiva** — NADA é enviado pela rede (ADR-0005); a Curadoria
 * consumirá o `Perfil` numa feature futura.
 *
 * Sinaliza que a Extração rodou via um marcador LOCAL não-PII no `<html>` (`data-curador-secoes` =
 * contagem estrutural de tipos de Seção, sempre 6). Não é egress nem ação social (ADR-0006); serve só
 * de coordenação interna (a Curadoria/side panel lê depois). Falha de seletor não pode quebrar a página.
 */
export function run(documento: Document = document): void {
  try {
    const perfil = new ExtrairPerfilDaPagina(new ExtratorDomLinkedin()).executar(documento);
    documento.documentElement.dataset.curadorSecoes = String(perfil.secoes.size);
  } catch {
    documento.documentElement.dataset.curadorErro = '1';
  }
}
