# 📊 Análise Demográfica - Levee Hortiplus

## 🎯 Sobre Este Relatório

Este é o **Relatório de Perfil Demográfico de Clientes** do Levee Hortiplus, criado para analisar a base de dados de usuários e endereços do aplicativo de delivery.

## 📁 Arquivos Incluídos

| Arquivo | Descrição | Como Usar |
|---------|-----------|-----------|
| `analise-demografica.cjs` | Script Node.js de análise | Execute: `node analise-demografica.cjs` |
| `analise-demografica-resultado.json` | Dados da análise em JSON | Use para importar em outras ferramentas |
| `relatorio-demografico.html` | Relatório visual interativo | Abra no navegador (Chrome, Firefox, Edge) |
| `RESUMO-EXECUTIVO-DEMOGRAFICO.md` | Resumo executivo em texto | Leia em qualquer editor de texto/Markdown |
| `README-ANALISE.md` | Este arquivo | Instruções de uso |

## 🚀 Como Usar

### 1. Visualizar o Relatório (Mais Fácil)

1. Abra o arquivo **`relatorio-demografico.html`** em qualquer navegador
2. Os gráficos são interativos - passe o mouse para ver detalhes
3. Para imprimir/salvar PDF: `Ctrl+P` ou `Cmd+P` → Salvar como PDF
4. **IMPORTANTE:** Os dados já estão incorporados no HTML, não precisa do arquivo JSON!

### 2. Ler o Resumo Executivo

1. Abra o arquivo **`RESUMO-EXECUTIVO-DEMOGRAFICO.md`**
2. Contém todos os insights e recomendações em formato texto
3. Ideal para compartilhar via email ou impressão

### 3. Re-executar a Análise (Se os dados mudarem)

```bash
# No terminal, dentro da pasta LEVEE:
node analise-demografica.cjs
```

Isso irá:
- ✅ Reprocessar os arquivos `export-users.json` e `export-enderecos.json`
- ✅ Gerar novo `analise-demografica-resultado.json`
- ✅ Atualizar automaticamente o relatório HTML

### 4. Usar os Dados em Outras Ferramentas

O arquivo **`analise-demografica-resultado.json`** pode ser importado em:
- Google Data Studio
- Power BI
- Tableau
- Excel (Dados > Obter Dados Externos > JSON)
- Planilhas Google

## 📊 O Que Este Relatório Analisa

### Perfil Demográfico
- ✅ Distribuição por gênero
- ✅ Distribuição por faixa etária
- ✅ Idade média e mediana

### Distribuição Geográfica
- ✅ Top 20 bairros atendidos
- ✅ Distribuição por cidade
- ✅ Capilaridade geográfica (572 bairros)

### Análise Logística
- ✅ Distância média de entrega
- ✅ Tempo médio de entrega
- ✅ Distribuição por faixas de distância/tempo

### Comportamento de Uso
- ✅ Usuários com/sem endereço cadastrado
- ✅ Quantidade de endereços por usuário
- ✅ Taxa de conversão

## 📈 Principais Descobertas

### 🎯 Alinhamento Perfeito com Personas
- **88% mulheres** entre 25-44 anos
- Perfil "Mãe Trabalhadora" validado
- Estratégia de comunicação confirmada

### 📍 Cobertura Geográfica
- **572 bairros** em **38 cidades**
- Forte presença em BH (45%)
- Expansão consistente na região metropolitana

### 🚚 Excelência Logística
- **79%** das entregas em **até 30 minutos**
- **70%** das entregas **dentro de 15km**
- Tempo médio: **24,7 minutos**

### 💰 Oportunidades
- **607 usuários** cadastrados sem endereço (18,7%)
- Potencial de recuperação/ativação
- Expansão em Contagem, Santa Luzia, Ribeirão das Neves

## 🛠️ Requisitos Técnicos

### Para Visualizar
- ✅ Qualquer navegador moderno (Chrome, Firefox, Safari, Edge)
- ✅ Não precisa de internet (todos os recursos são locais)

### Para Re-executar a Análise
- ✅ Node.js instalado (versão 14 ou superior)
- ✅ Arquivos `export-users.json` e `export-enderecos.json` na pasta `banco de dados/`

### Estrutura de Pastas Esperada

```
LEVEE/
├── banco de dados/
│   ├── export-users.json
│   └── export-enderecos.json
├── analise-demografica.cjs
├── analise-demografica-resultado.json
├── relatorio-demografico.html
├── RESUMO-EXECUTIVO-DEMOGRAFICO.md
└── README-ANALISE.md (este arquivo)
```

## 🔄 Atualizações Futuras

Para criar relatórios adicionais:

1. **Comportamento de Compra** (análise de pedidos e produtos)
2. **Engajamento** (uso de cupons, cashback, indicações)
3. **Logística Avançada** (otimização de rotas, mapa de calor)
4. **Segmentação RFM** (Recência, Frequência, Valor Monetário)

## 📞 Suporte

Se você precisar re-executar ou adaptar a análise:

1. Certifique-se que os arquivos JSON estão atualizados
2. Execute: `node analise-demografica.cjs`
3. Abra o `relatorio-demografico.html` no navegador
4. Todos os gráficos serão atualizados automaticamente

## 🎨 Personalização

O relatório HTML usa as cores do **DNA da Levee**:
- 🔴 Amaranth (#e94460) - Destaque principal
- 🟤 Rich Mahogany (#2f150e) - Texto principal
- 🟢 Dusty Olive (#657561) - Elementos secundários
- ⚪ Ivory (#f8f8ed) - Fundo

Para alterar cores ou layout, edite o arquivo `relatorio-demografico.html` (seção `<style>`).

---

**Criado em:** 02/01/2026
**Versão:** 1.0
**Ferramenta:** Node.js + Chart.js

🍉 **Levee Hortiplus - Praticidade, Saúde e Qualidade na sua mesa**
