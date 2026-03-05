# Levee Produtos — Google Sheets Integration

## Setup Rapido

### 1. Criar a Planilha
- Abrir [Google Sheets](https://sheets.google.com) e criar nova planilha
- Renomear para **"Levee - Gestao de Produtos"**

### 2. Adicionar os Scripts
- Menu: **Extensions > Apps Script**
- Apagar o conteudo padrao
- Criar 2 arquivos:
  - `SetupSheet.gs` — copiar conteudo de `SetupSheet.gs`
  - `SyncEngine.gs` — copiar conteudo de `SyncEngine.gs`
- Salvar (Ctrl+S)

### 3. Executar o Setup
- No Apps Script, selecionar funcao `setupSheet` e clicar **Run**
- Autorizar permissoes quando solicitado
- A planilha sera configurada automaticamente

### 4. Configurar Credenciais
- Na planilha, menu: **Levee Produtos > Configuracoes**
- Inserir:
  - **SUPABASE_URL**: `https://sgczuohhyxetibmswtvm.supabase.co`
  - **SUPABASE_SERVICE_ROLE_KEY**: (obter no Supabase Dashboard > Settings > API)

### 5. Importar Produtos
- Menu: **Levee Produtos > Atualizar Planilha**
- Todos os produtos e categorias serao importados do banco

## Uso Diario

### Atualizar Planilha (banco → planilha)
- Menu: **Levee Produtos > Atualizar Planilha**
- Traz a versao mais recente de todos os produtos

### Enviar para Loja (planilha → banco)
- Editar produtos na aba "Cadastro"
- Para novo produto: deixar coluna ID vazia, preencher os demais campos
- Menu: **Levee Produtos > Enviar para Loja**
- O script valida, envia e mostra resultado

### Colunas da Aba Cadastro

| Coluna | Editavel | Descricao |
|--------|----------|-----------|
| ID | Nao | Numero do produto (auto) |
| Nome | Sim | Nome do produto (obrigatorio) |
| Preco (R$) | Sim | Preco unitario (obrigatorio, >= 0) |
| Unidade | Sim | Dropdown: un, kg, cx, maco, dz |
| Categoria | Sim | Dropdown com categorias do banco |
| Descricao | Sim | Texto livre (opcional) |
| Ativo | Sim | Checkbox (produto visivel na loja) |
| Imagem URL | Nao | Gerenciada pelo painel admin |
| Status Sync | Nao | Status da ultima sincronizacao |
| Ultima Sync | Nao | Data/hora da ultima sincronizacao |

## Notas Importantes

- **Nao editar** a aba "Categorias" — ela e atualizada automaticamente
- **Sempre enviar antes de atualizar** — o pull sobrescreve os dados
- Produtos desativados (Ativo = FALSE) ficam com fundo vermelho claro
- Imagens sao gerenciadas apenas pelo painel admin, nao pela planilha
