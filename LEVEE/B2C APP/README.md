# LEVEE - Sistema de Análise de Dados

Sistema de análise de dados para o e-commerce LEVEE, focado em análises demográficas, comportamento de compra e análises temporais de produtos.

## Funcionalidades

### Análises Demográficas
- **Análise Demográfica de Clientes**: Perfil completo dos clientes por bairro, gênero e idade
- **Análise Demográfica de Vendas**: Correlação entre perfil demográfico e comportamento de compra
- Relatórios HTML interativos com visualizações em gráficos

### Análise Temporal de Produtos
- Análise de vendas por períodos (manhã, tarde, noite)
- Identificação de padrões de compra por horário
- Métricas de performance por produto

### Análise de Carrinho Abandonado
- Identificação de produtos frequentemente abandonados
- Análise de combinações de produtos no carrinho
- Insights sobre comportamento de abandono

## Estrutura do Projeto

```
LEVEE/
├── analise-demografica.cjs                    # Análise demográfica de clientes
├── analise-demografica-vendas.cjs             # Análise demográfica de vendas
├── analise-completa-temporal-produtos.cjs     # Análise temporal de produtos
├── analise-carrinho-abandonado.cjs            # Análise de carrinhos abandonados
├── relatorio-demografico.html                 # Relatório visual demográfico
├── relatorio-vendas-demografico.html          # Relatório visual de vendas
├── executar-analise.bat                       # Script de execução
└── README-ANALISE.md                          # Documentação detalhada
```

## Documentação

- [README-ANALISE.md](./README-ANALISE.md) - Documentação completa das análises
- [RESUMO-EXECUTIVO-DEMOGRAFICO.md](./RESUMO-EXECUTIVO-DEMOGRAFICO.md) - Resumo da análise demográfica
- [RESUMO-TEMPORAL-PRODUTOS.md](./RESUMO-TEMPORAL-PRODUTOS.md) - Resumo da análise temporal
- [RESUMO-CARRINHO-ABANDONADO.md](./RESUMO-CARRINHO-ABANDONADO.md) - Resumo de carrinhos abandonados
- [PLANEJAMENTO-ANALISE-COMPLETA.md](./PLANEJAMENTO-ANALISE-COMPLETA.md) - Planejamento geral

## Requisitos

- Node.js (versão 14 ou superior)
- Navegador web moderno para visualizar relatórios HTML

## Como Usar

### 1. Executar Análises

Execute todas as análises de uma vez:
```bash
executar-analise.bat
```

Ou execute análises individuais:

```bash
# Análise demográfica
node analise-demografica.cjs

# Análise de vendas demográficas
node analise-demografica-vendas.cjs

# Análise temporal de produtos
node analise-completa-temporal-produtos.cjs

# Análise de carrinho abandonado
node analise-carrinho-abandonado.cjs
```

### 2. Visualizar Relatórios

Abra os arquivos HTML no navegador:
- `relatorio-demografico.html` - Visualizações demográficas
- `relatorio-vendas-demografico.html` - Visualizações de vendas

## Principais Insights

### Demográfico
- Perfil detalhado de clientes por bairro
- Distribuição por gênero e faixa etária
- Padrões de concentração geográfica

### Vendas
- Produtos mais vendidos por perfil demográfico
- Ticket médio por segmento
- Comportamento de compra por região

### Temporal
- Horários de pico de vendas
- Produtos mais vendidos por período do dia
- Sazonalidade e padrões temporais

## Tecnologias

- Node.js
- Chart.js (visualizações)
- HTML/CSS/JavaScript
- JSON (armazenamento de dados)

## Licença

Propriedade da LEVEE

## Contato

Para mais informações sobre o projeto LEVEE, consulte a documentação interna.
