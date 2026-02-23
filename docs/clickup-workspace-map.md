# ClickUp Workspace Map — Agencia Jubileu

**Workspace:** JUBILEU Workspace (ID: `90133059528`)
**Owner:** Fernando Gleisson (ID: `284457202`, email: jubileu.agencia@gmail.com)
**Last Updated:** 2026-02-22 (via MCP test)

---

## Spaces

### 1. OPERACAO (ID: `901313356803`)

| Folder | Folder ID | List | List ID | Tasks | Statuses |
|--------|-----------|------|---------|-------|----------|
| Maquina de Conteudo | `901317273965` | Planejamento & Estrategia | `901325668052` | 0 | a fazer, em progresso, em revisao, bloqueado, concluido |
| Maquina de Conteudo | `901317273965` | Redacao / Copy | `901325668053` | 0 | a fazer, em progresso, em revisao, bloqueado, concluido |
| Maquina de Conteudo | `901317273965` | Design / Audiovisual | `901325668054` | 5 | to do, complete |
| Maquina de Conteudo | `901317273965` | Publicacao | `901325668055` | 2 | to do, complete |
| Growth & Ads | `901317273969` | Criacao de LPs / Funis | `901325668058` | 1 | to do, complete |
| Growth & Ads | `901317273969` | Gestao de Campanhas | `901325668059` | 1 | a fazer, em progresso, em revisao, bloqueado, concluido |
| Dev & Apps | `901317273971` | Sprints do Diego | `901325668061` | 1 | to do, complete |

### 2. JUBILEU INTERNAL (ID: `901313356810`)

| Folder | Folder ID | List | List ID | Tasks | Statuses |
|--------|-----------|------|---------|-------|----------|
| Administrativo / Labs | `901317273974` | Laboratorio de IA | `901325668065` | 1 | to do, complete |
| Administrativo / Labs | `901317273974` | Financeiro & Contratos | `901325668067` | 1 | to do, complete |

---

## Custom Fields (Space-level)

### Campo "Cliente" (drop_down) - IDs variam por lista

**Opcoes padrao em todas as listas:**
| Option | Color |
|--------|-------|
| SIDERAL | #7b68ee (roxo) |
| CARACOL | #ff8c00 (laranja) |
| LEVEE | #32cd32 (verde) |
| JUBILEU INTERNAL | #696969 (cinza) |

**Nota:** Existem 3 custom fields "Cliente"/"cliente" duplicados com IDs diferentes por lista. Precisa limpeza manual no UI.

Exemplos de IDs por lista:
- Design/Audiovisual: `ede755d0-...`, `cc045f42-...`, `ac2f1b48-...`
- Publicacao: `deb47261-...`, `cc045f42-...`, `ac2f1b48-...`
- Sprints do Diego: `b8ec0e00-...`, `cc045f42-...`, `ac2f1b48-...`

O campo `cc045f42-056d-4e1b-9bc4-8cbc2699370e` aparece em TODAS as listas (global do workspace).

---

## Docs no Workspace

| Doc | ID | Tipo | Public |
|-----|----|------|--------|
| Briefing do Clone do Fernando | `2ky5jny8-653` | 2 | Sim |
| Roteiro video Aula dia 22: O APAGAO DA CRISALIDA | `2ky5jny8-673` | 1 | Sim |
| Meeting Notes | `2ky5jny8-693` | 1 | Nao |
| Keys e senhas | `2ky5jny8-713` | 1 | Nao |
| spoiler-semana-22-02-OTIMIZADO.md | `2ky5jny8-753` | 1 | Sim |

---

## Status Workflow

**Listas com workflow customizado (5 etapas):**
- Planejamento & Estrategia
- Redacao / Copy
- Gestao de Campanhas

`a fazer` -> `em progresso` -> `em revisao` -> `bloqueado` -> `concluido`

**Listas com workflow padrao (2 etapas):**
- Design / Audiovisual
- Publicacao
- Criacao de LPs / Funis
- Sprints do Diego
- Laboratorio de IA
- Financeiro & Contratos

`to do` -> `complete`

**Acao necessaria:** Atualizar statuses no UI do ClickUp para as listas que ainda usam o workflow padrao.

---

## Team Members

| Name | ClickUp ID | Role | Status |
|------|-----------|------|--------|
| Fernando Gleisson | `284457202` | Owner - Strategy & Innovation | Active |
| Gabriel | - | Audiovisual, Automacoes, Trafego | **Needs invite** |
| Karol | - | Organizacao, Execucao | **Needs invite** |
| Diego | - | Desenvolvimento | **Needs invite** |

---

## MCP Integration Test Results (2026-02-22)

| Operation | Status | Notes |
|-----------|--------|-------|
| get_workspaces | OK | Retorna workspace com members |
| get_spaces | OK | 2 spaces encontrados |
| get_folders (via API) | OK | MCP nao tem tool nativo, usar curl |
| get_folderless_lists | OK | Retorna vazio (todas listas estao em folders) |
| get_tasks | OK | Leitura de tasks com custom fields e dependencies |
| get_task_details | OK | Detalhes completos |
| create_task | OK | Com assignees, tags, priority |
| update_task | OK | Status, description, priority |
| create_task_comment | OK | Texto simples |
| get_task_comments | OK | Leitura de comentarios |
| get_docs_from_workspace | OK | 5 docs encontrados |
| create_checklist | OK | Checklist na task |
| create_checklist_item | OK | Com resolved status |

**Task de teste:** `86afmgng9` - criada e deletada com sucesso (cleanup OK)

### Limitacoes do MCP (`clickup-mcp-server`):
1. **Sem `get_folders`** - Precisa usar API v2 direta (`curl /api/v2/space/{id}/folder`)
2. **Sem `delete_task`** - Precisa usar API v2 direta (`curl -X DELETE /api/v2/task/{id}`)
3. **Custom fields duplicados** - 3 campos "Cliente" com IDs diferentes por lista (limpeza manual no UI)
4. **Statuses inconsistentes** - Algumas listas com workflow customizado, outras com padrao (atualizar no UI)

### Acesso API Direto (fallback para limitacoes do MCP)
```bash
# Headers
Authorization: pk_284457202_BHCMWP2K2UGRXHO39XSZP9XD4120W9HF

# Get folders de um space
curl -s -H "Authorization: $TOKEN" "https://api.clickup.com/api/v2/space/{space_id}/folder"

# Delete task
curl -s -X DELETE -H "Authorization: $TOKEN" "https://api.clickup.com/api/v2/task/{task_id}"
```
