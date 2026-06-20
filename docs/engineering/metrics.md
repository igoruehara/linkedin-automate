---
name: metrics
description: Métricas de entrega — Lead Time, Throughput e maturidade de Continuous Delivery/Deployment. Puxe ao revisar o fluxo ou planejar. Atualizado por /metricas.
alwaysApply: false
---

# Métricas de entrega

> Saúde do fluxo: **Lead Time**, **Throughput** e **Continuous Delivery/Deployment**.
> Atualizado por `/metricas`. Use para **achar gargalo**, não para ranquear pessoas.

**Período:** <ciclo / datas> · **Atualizado em:** <YYYY-MM-DD>

## Lead Time — tempo até produção
> Do início (spec / issue / 1º commit) ao deploy em prod. Reporte **mediana** e **p85**.

| Item                | Início       | Em prod      | Lead time |
|---------------------|--------------|--------------|-----------|
| <feature / issue>   | <data>       | <data>       | <Xd Yh>   |

- **Mediana:** <…> · **p85:** <…> · **Tendência:** <↑ / → / ↓>

## Throughput — itens concluídos no ciclo
> Quantos itens chegaram a "pronto"/prod no período.

| Tipo       | Concluídos |
|------------|------------|
| Histórias  | <n>        |
| Bugs       | <n>        |
| Tarefas    | <n>        |
| **Total**  | **<n>**    |

- **Tendência vs ciclo anterior:** <↑ / → / ↓>

## Continuous Delivery / Deployment
| Prática                                    | Estado atual         | Gap para avançar |
|--------------------------------------------|----------------------|------------------|
| Continuous Delivery (deployável sempre)    | sim / parcial / não  | <…>              |
| Continuous Deployment (deploy automático)  | sim / parcial / não  | <…>              |

- **Deployment Frequency:** <nº de deploys no período>.
- Próximo passo de automação: `/setup-ci`.
