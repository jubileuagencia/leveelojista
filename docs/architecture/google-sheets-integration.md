# Arquitetura: Google Sheets ↔ Supabase — Gestão de Produtos

**Autor:** @architect (Aria)
**Data:** 2026-03-04
**Status:** T1 — Aprovado
**Projeto:** novob2b (Levee Lojista)

---

## 1. Visão Geral

Integração bidirecional entre Google Sheets e Supabase para permitir ao cliente (Levee) gerenciar produtos em massa via planilha, com sync para o banco de dados da loja B2B.

### Fluxo Principal

```
┌─────────────────┐                          ┌───────────────────┐
│  Google Sheets   │                          │     Supabase      │
│                  │   Apps Script            │                   │
│  Aba Cadastro    │ ──── UrlFetchApp ──────→ │  RPC:             │
│  Aba Categorias  │      POST /rest/v1/rpc/  │  bulk_upsert_     │
│                  │      bulk_upsert_products│  products()       │
│                  │ ←─── UrlFetchApp ─────── │                   │
│                  │      GET /rest/v1/       │  products +       │
│                  │      products?select=... │  categories       │
└─────────────────┘                          └───────────────────┘
```

### Decisão Arquitetural: Acesso Direto via PostgREST

**Escolhido:** Apps Script → Supabase REST API (PostgREST) diretamente
**Descartados:**
- ~~Edge Functions~~: Overhead desnecessário — a validação fica na RPC SQL
- ~~API Route separada~~: novob2b é Vite (SPA), não tem backend próprio. Criar um seria over-engineering
- ~~Middleware externo~~: Complexidade sem benefício real

**Justificativa:** O Supabase já expõe REST API via PostgREST. Uma RPC PostgreSQL (`bulk_upsert_products`) faz toda a validação server-side. Apps Script roda server-side no Google (a `service_role` key nunca fica exposta ao browser). Zero infraestrutura adicional.

---

## 2. Autenticação

### Método: `service_role` key via Apps Script Properties

```
Apps Script → PropertiesService.getScriptProperties()
            → SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
            → Header: apikey + Authorization: Bearer
```

**Por que `service_role` e não `anon` key:**
- A operação de bulk upsert é administrativa (bypassa RLS intencionalmente)
- Apps Script roda server-side no Google Cloud — a key nunca é exposta ao client
- A RPC já inclui validação interna de dados

**Segurança:**
- Keys armazenadas em `PropertiesService.getScriptProperties()` (não no código)
- A planilha deve ser compartilhada apenas com admins da Levee
- O Apps Script NÃO é publicado como web app (execução manual via menu)

---

## 3. Modelo de Dados na Planilha

### Aba "Cadastro" (Produtos)

| Coluna | Header | Tipo | Obrigatório | Origem | Notas |
|--------|--------|------|-------------|--------|-------|
| A | ID | number | Auto | DB `display_id` | Readonly. Vazio = produto novo |
| B | Nome | string | Sim | Usuário | Min 2 chars |
| C | Preço (R$) | number | Sim | Usuário | >= 0, formato moeda |
| D | Unidade | dropdown | Sim | Usuário | un, kg, cx, maco, dz |
| E | Categoria | dropdown | Sim | Usuário | Nomes da aba Categorias |
| F | Descrição | string | Não | Usuário | Texto livre |
| G | Ativo | checkbox | Sim | Usuário | TRUE/FALSE |
| H | Imagem URL | string | Não | DB | Readonly (gerenciado pelo admin panel) |
| I | Status Sync | string | Auto | Script | "✓ Sincronizado", "⚠ Erro: ...", "🔄 Novo" |
| J | Última Sync | datetime | Auto | Script | Timestamp do último sync |

### Aba "Categorias" (Referência — Readonly)

| Coluna | Header | Tipo | Notas |
|--------|--------|------|-------|
| A | ID (UUID) | string | Hidden, usado internamente pelo script |
| B | Nome | string | Usado como source dos dropdowns |
| C | Ordem | number | sort_order |

**Esta aba é populada automaticamente** pelo script ao executar "Atualizar Planilha".

---

## 4. API Endpoints Utilizados

### 4.1 Leitura: Supabase → Sheets (GET)

```http
GET {SUPABASE_URL}/rest/v1/products?select=display_id,name,price,unit,category_id,description,is_active,image_url,categories(id,name)&deleted_at=is.null&order=display_id.asc
Authorization: Bearer {SERVICE_ROLE_KEY}
apikey: {SERVICE_ROLE_KEY}
```

```http
GET {SUPABASE_URL}/rest/v1/categories?select=id,name,sort_order&order=sort_order.asc,name.asc
Authorization: Bearer {SERVICE_ROLE_KEY}
apikey: {SERVICE_ROLE_KEY}
```

### 4.2 Escrita: Sheets → Supabase (RPC)

```http
POST {SUPABASE_URL}/rest/v1/rpc/bulk_upsert_products
Authorization: Bearer {SERVICE_ROLE_KEY}
apikey: {SERVICE_ROLE_KEY}
Content-Type: application/json

{
  "p_products": [
    {
      "display_id": 1,           // null = novo produto
      "name": "Produto X",
      "price": 29.90,
      "unit": "un",
      "category_name": "Bebidas", // resolvido para UUID na RPC
      "description": "...",
      "is_active": true
    }
  ]
}
```

**Resposta da RPC:**

```json
{
  "inserted": 3,
  "updated": 12,
  "errors": [
    { "row": 5, "display_id": null, "error": "Nome é obrigatório" },
    { "row": 8, "display_id": 15, "error": "Categoria 'XYZ' não encontrada" }
  ]
}
```

---

## 5. RPC `bulk_upsert_products` — Especificação

### Lógica

```sql
-- Migration 007
CREATE OR REPLACE FUNCTION bulk_upsert_products(p_products JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
```

### Comportamento

1. **Recebe** array JSONB de produtos
2. **Itera** cada produto:
   - Se `display_id` é NULL → INSERT (novo produto, sequence gera o display_id)
   - Se `display_id` existe → UPDATE (match por display_id)
3. **Resolve** `category_name` → `category_id` (lookup na tabela categories)
4. **Valida** cada linha:
   - `name` NOT NULL e length >= 2
   - `price` >= 0
   - `unit` IN ('un','kg','cx','maco','dz')
   - `category_name` existe na tabela (se fornecido)
5. **Retorna** JSON com contadores (inserted, updated) e array de erros por linha
6. **Não faz rollback parcial** — linhas válidas são processadas, inválidas retornam erro

### Chave de Match: `display_id`

**Por que `display_id` e não `id` (UUID):**
- UUID é ilegível para humanos na planilha
- `display_id` é o identificador amigável que o cliente já conhece
- É UNIQUE e sequencial — funciona como natural key para o contexto da planilha
- Produtos novos (sem display_id) recebem o próximo da sequence automaticamente

---

## 6. Apps Script — Estrutura

### Menu Customizado

```
📦 Levee Produtos
├── 🔄 Atualizar Planilha (Supabase → Sheets)
├── 📤 Enviar para Loja (Sheets → Supabase)
├── ───────────────
└── ⚙️ Configurações
```

### Funções Principais

| Função | Direção | Descrição |
|--------|---------|-----------|
| `pullFromSupabase()` | Supabase → Sheets | Baixa todos os produtos ativos + categorias. Sobrescreve aba Categorias. Atualiza aba Cadastro sem perder edições locais (merge por display_id) |
| `pushToSupabase()` | Sheets → Supabase | Lê aba Cadastro, valida localmente, chama RPC `bulk_upsert_products`, atualiza coluna Status Sync |
| `setupSheet()` | — | Cria headers, dropdowns, formatação condicional, proteções |

### Validação Local (pré-envio)

Antes de chamar a RPC, o Apps Script valida:
- Nome preenchido (>= 2 chars)
- Preço numérico >= 0
- Unidade válida (dropdown)
- Categoria válida (existe na aba Categorias)
- Linhas com erro são marcadas em vermelho e **não** são enviadas

### Merge Strategy (Pull)

Ao atualizar a planilha (Supabase → Sheets):
1. Busca produtos do Supabase
2. Para cada `display_id` existente na planilha → atualiza a linha
3. Para novos produtos (não presentes na planilha) → adiciona no final
4. **Não deleta linhas** — produtos soft-deleted no Supabase são ignorados (não aparecem)
5. Preserva edições locais não salvas? **Não** — o pull sobrescreve. O usuário deve enviar antes de puxar.

---

## 7. Estratégia de Conflitos

### Regra: Last Write Wins (Sheets tem prioridade no push)

```
Cenário: Admin alterou preço no painel e usuário alterou na planilha
Resultado: O último a fazer push/save ganha
```

**Justificativa:** A planilha é a interface de **edição em massa**. O admin panel é para edições pontuais. Não implementamos merge complexo — é over-engineering para o volume esperado (~30-100 produtos).

### Proteções

- Coluna "Última Sync" mostra quando os dados foram sincronizados
- Antes do push, o script mostra alerta: "X produtos serão atualizados. Continuar?"
- O pull sempre traz a versão mais recente do banco

---

## 8. Limitações & Escopo

### Fora do escopo (v1)

- **Upload de imagens via Sheets** — imagens continuam sendo gerenciadas pelo admin panel
- **Sync automático** (trigger por tempo) — apenas manual via menu
- **Soft delete via Sheets** — desativar sim (`is_active: false`), deletar não
- **Criação de categorias via Sheets** — aba Categorias é readonly
- **Histórico de alterações** — sem versioning

### Limites técnicos

- Apps Script: timeout de 6 minutos por execução
- UrlFetchApp: máximo 100 requests por execução
- Para ~100 produtos em um único POST de RPC, não há problema
- Para >500 produtos, considerar batch de 100 por request

---

## 9. Diagrama de Sequência

### Push (Sheets → Supabase)

```
Usuário          Apps Script           Supabase
  │                  │                     │
  │ Clica "Enviar"   │                     │
  │─────────────────→│                     │
  │                  │ Lê aba Cadastro     │
  │                  │ Valida localmente    │
  │                  │                     │
  │                  │ POST /rpc/           │
  │                  │ bulk_upsert_products │
  │                  │────────────────────→ │
  │                  │                     │ Valida + Upsert
  │                  │                     │
  │                  │ ←─── JSON response  │
  │                  │    {inserted, updated, errors}
  │                  │                     │
  │                  │ Atualiza Status Sync│
  │ ←── Toast/Alert  │                     │
  │  "15 atualizados, │                    │
  │   2 erros"       │                     │
```

### Pull (Supabase → Sheets)

```
Usuário          Apps Script           Supabase
  │                  │                     │
  │ Clica "Atualizar"│                     │
  │─────────────────→│                     │
  │                  │ GET /categories      │
  │                  │────────────────────→ │
  │                  │ ←── categorias[]     │
  │                  │                     │
  │                  │ GET /products        │
  │                  │────────────────────→ │
  │                  │ ←── produtos[]       │
  │                  │                     │
  │                  │ Sobrescreve Categorias│
  │                  │ Merge Cadastro       │
  │ ←── "Atualizado" │                     │
```

---

## 10. Checklist de Entrega por Task

| Task | Entregável | Critério de Aceite |
|------|-----------|-------------------|
| **T1** | Este documento | Aprovado |
| **T2** | — (não necessário, uso direto PostgREST) | N/A — escopo absorvido por T4+T5 |
| **T3** | Google Sheet template com abas, dropdowns, formatação | Planilha funcional com dados de exemplo |
| **T4** | Arquivo `.gs` com Apps Script completo | Push e Pull funcionando |
| **T5** | Migration 007 com RPC `bulk_upsert_products` | RPC testada no SQL Editor |
| **T6** | Relatório de testes | Todos os cenários cobertos |
| **T7** | Guia de uso (PDF/Notion) | Cliente consegue operar sozinho |

### Mudança importante: T2 eliminada

A API Route/Edge Function (T2) **não é necessária**. O Apps Script fala diretamente com o PostgREST do Supabase. A validação fica na RPC (T5). Isso simplifica a arquitetura e elimina uma camada inteira.

---

*— Aria, arquitetando o futuro*
