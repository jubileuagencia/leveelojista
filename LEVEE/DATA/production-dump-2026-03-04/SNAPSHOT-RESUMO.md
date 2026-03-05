# Snapshot Banco de Dados B2C — PRODUÇÃO
**Data:** 2026-03-04
**Ambiente:** Produção (leveehort.com.br)
**API:** https://leveehort.com.br/api/1.1/obj
**Período dos dados:** 2024-09-30 a 2026-03-04

---

## Contagem de Registros

| Tabela | Registros | Páginas JSON | Tamanho |
|--------|-----------|--------------|---------|
| produtos | 1.009 | 11 | 1.4 MB |
| pedidos | 5.075 | 51 | 14 MB |
| cobranças | 6.886 | 69 | 14 MB |
| sacolaitens | 200.691 | 2.100 (limit) | ~38 MB |
| cupons | 43 | 1 | 964 KB |
| timeslot_entrega | 31 | 1 | 20 KB |
| **TOTAL** | **213.735** | | |

### Tabelas NÃO expostas na API
- Users (~3.239 no último export)
- Endereços (~4.737 no último export)
- Avaliações (~543 no último export)

> Para habilitar: Bubble Editor > Settings > API > Data API > checkbox por tipo

---

## Métricas Extraídas

### Produtos (1.009)
- **Visíveis na loja:** 739 (73%)
- **Invisíveis:** 270 (27%)
- **Em oferta:** 33
- **Com estoque > 0:** 906 (90%)
- **Preço médio:** R$12,85
- **Faixa de preço:** R$0,99 — R$199,90

**Top 10 Categorias:**
| Categoria | Produtos |
|-----------|----------|
| Empório | 245 |
| Outros | 142 |
| Frutas | 115 |
| Legumes | 78 |
| Bebidas | 72 |
| Temperos e Condimentos | 71 |
| Verduras | 52 |
| Sucos | 46 |
| Biscoitos | 46 |
| Higienizados | 38 |

### Pedidos (5.075)
- **Receita total:** R$772.670,55
- **Ticket médio:** R$153,16
- **Ticket máximo:** R$927,82
- **Primeiro pedido:** 2024-09-30
- **Último pedido:** 2026-03-04

**Status:**
| Status | Quantidade | % |
|--------|-----------|---|
| Entregue | 4.710 | 92,8% |
| Cancelado | 349 | 6,9% |
| Aguardando confirmação | 6 | 0,1% |
| Outros | 10 | 0,2% |

**Formas de Pagamento:**
| Forma | Quantidade | % |
|-------|-----------|---|
| Cartão (online) | 1.730 | 34,1% |
| Pix | 1.727 | 34,0% |
| Cartão na entrega | 1.505 | 29,7% |
| Dinheiro | 113 | 2,2% |

**Evolução Mensal (últimos 6 meses):**
| Mês | Pedidos | Tendência |
|-----|---------|-----------|
| 2025-10 | 370 | |
| 2025-11 | 315 | ↓ -15% |
| 2025-12 | 321 | ↑ +2% |
| 2026-01 | 481 | ↑ +50% |
| 2026-02 | 550 | ↑ +14% |
| 2026-03 | 67* | *parcial (4 dias) |

> **Tendência:** Forte crescimento em Jan-Fev 2026. Fevereiro foi o melhor mês da história (550 pedidos). Projeção Mar/2026: ~500-600 pedidos se manter ritmo.

---

## Comparativo com Análise Anterior (exports 2025)

| Métrica | Export 2025 | Produção Atual | Variação |
|---------|-------------|----------------|----------|
| Produtos | 961 | 1.009 | +48 (+5%) |
| Pedidos | 4.004 | 5.075 | +1.071 (+27%) |
| Receita | R$554.683 | R$772.671 | +R$217.988 (+39%) |
| Ticket médio | R$148 | R$153 | +R$5 (+3,4%) |

---

## Arquivos

Cada tabela foi exportada em páginas de 100 registros no formato JSON:
- `produtos-page{N}.json` — 11 arquivos
- `pedidos-page{N}.json` — 51 arquivos
- `cobrancas-page{N}.json` — 69 arquivos
- `sacolaitens-page{N}.json` — ~2.007 arquivos (em download)
- `cupons-page1.json` — 1 arquivo
- `timeslot_entrega-page1.json` — 1 arquivo

Cada arquivo contém:
```json
{
  "response": {
    "cursor": N,
    "results": [...],
    "count": N,
    "remaining": N
  }
}
```
