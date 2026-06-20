---
name: glossary
description: Linguagem ubíqua. Puxe ao nomear, modelar domínio ou escrever specs.
alwaysApply: false
---

# Glossário — Linguagem Ubíqua

> A fonte única do vocabulário do sistema. O mesmo termo aparece aqui, na spec e no código.
> Termo novo introduzido por uma feature → adicione no mesmo PR. Sem sinônimos.

| Termo                | Definição                                                                                     | NÃO confundir com                          | Contexto (bounded context) |
|----------------------|-----------------------------------------------------------------------------------------------|--------------------------------------------|----------------------------|
| **Achado**           | Resultado de uma Regra sobre uma Seção (ex.: "Sobre vazio", "Headline genérica").             | Recomendação (o Achado detecta; a Recomendação orienta) | Curadoria |
| **Chave de IA**      | Credencial de API de um Provedor de LLM, fornecida e armazenada **localmente** pelo usuário (BYOK). | Login do LinkedIn                      | Configuração |
| **Checklist**        | Lista priorizada de Recomendações derivadas do Diagnóstico.                                    | Diagnóstico (o checklist é a saída acionável) | Curadoria |
| **Conteúdo** (da Seção) | O dado de uma Seção: texto (Headline/Sobre), itens (Experiência/Formação/Competências) ou flag (Foto). | Seção (o Conteúdo é o dado dentro dela) | Extração de Perfil |
| **Curadoria**        | Processo de avaliar um Perfil e produzir Diagnóstico, Pontuação e Recomendações.               | Reescrita (curar ≠ reescrever)             | Curadoria |
| **Diagnóstico**      | Conjunto de Achados + pontos fortes de um Perfil, base da Pontuação e do Checklist.            | Pontuação (o Diagnóstico explica; a Pontuação resume) | Curadoria |
| **EstadoDaSeção**    | Situação de uma Seção no Perfil: `PRESENTE` · `VAZIA` (existe no DOM, sem conteúdo) · `AUSENTE`. | Conteúdo (estado ≠ dado)                 | Extração de Perfil |
| **Extração**         | Leitura do DOM da página → modelo `Perfil`, via Anti-Corruption Layer.                         | Scraping em massa (extrai só o perfil visível) | Extração de Perfil |
| **ExtratorDePerfil** | Porta (interface) que produz um `Perfil` a partir do documento da página; o ACL a implementa. | ACL (a implementação concreta)             | Extração de Perfil |
| **Headline**         | Título profissional abaixo do nome no perfil (limite ~220 caracteres).                         | Cargo atual / nome da empresa              | Extração / Curadoria |
| **Idioma do Perfil** | Idioma detectado dos rótulos do perfil (PT/EN); metadado da Extração (campo `idiomaDetectado`), **não** entra nas chaves canônicas. | TipoDeSeção (a chave é neutra de idioma) | Extração de Perfil |
| **Perfil**           | O perfil do LinkedIn sob curadoria; o modelo de domínio extraído do DOM.                       | Conta do LinkedIn                          | Extração de Perfil |
| **Pontuação**        | Nota 0–100 do Perfil, geral e por Seção, derivada dos Achados ponderados.                      | Diagnóstico                                | Curadoria |
| **Provedor de LLM**  | Serviço de IA acionado para gerar Reescrita (default Claude/Anthropic; plugável).              | Chave de IA (o provedor usa a chave)       | Reescrita Assistida |
| **Recomendação**     | Item acionável do Checklist, derivado de um Achado, com prioridade.                            | Achado                                     | Curadoria |
| **Reescrita Sugerida** | Texto melhorado de uma Seção, gerado pela IA, para o usuário copiar e colar.                 | Edição automática (o usuário cola à mão)   | Reescrita Assistida |
| **Regra**            | Heurística determinística que avalia uma Seção e emite um Achado.                              | Recomendação                               | Curadoria |
| **Seção**            | Bloco estruturado do Perfil: Foto, Banner, Headline, Sobre, Experiência, Formação, Competências, Recomendações, Destaques. | Aba do LinkedIn         | Extração / Curadoria |
| **Side panel**       | Painel lateral nativo do navegador onde a Curadoria é exibida.                                 | Popup do ícone / painel injetado           | (UI / interfaces) |
| **Sobre**            | Seção de resumo do perfil ("About").                                                           | Headline                                   | Extração / Curadoria |
| **TipoDeSeção**      | Chave canônica neutra de idioma de uma Seção: FOTO · HEADLINE · SOBRE · EXPERIENCIA · FORMACAO · COMPETENCIAS. | Rótulo exibido (PT/EN)              | Extração de Perfil |

<!-- Mantenha em ordem alfabética. Cada linha deve ter um dono mental claro. -->
