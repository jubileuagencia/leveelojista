# Workflows n8n — Jubileu Agencia

## 4 Workflows Core

### 1. Receptor de Mensagens + Comandos (`whatsapp-receiver`)
- **Trigger:** Webhook POST `/webhook/whatsapp-receiver`
- **Funcao:** Recebe mensagens do WhatsApp via Evolution API, detecta comandos e responde
- **Comandos:**
  - `status projeto <nome>` — Busca tasks do projeto no ClickUp
  - `tarefas pendentes` — Lista todas tasks pendentes
  - `briefing da semana` — Resumo semanal gerado por IA
  - `resumo diario` — Panorama do dia
  - `ajuda` — Menu de comandos

### 2. Notificador de Status ClickUp (`clickup-notifier`)
- **Trigger:** Webhook POST `/webhook/clickup-status-change`
- **Funcao:** Recebe eventos de mudanca de status do ClickUp e notifica o grupo

### 3. Resumo Diario (`daily-summary`)
- **Trigger:** Cron — Seg a Sex as 09:00 BRT
- **Funcao:** Busca tasks pendentes/atrasadas no ClickUp, gera resumo com IA, envia pro grupo

### 4. Resumo Semanal (`weekly-summary`)
- **Trigger:** Cron — Sexta as 17:00 BRT
- **Funcao:** Metricas da semana + tasks concluidas + pendentes, relatorio por IA

## IDs ClickUp para referencia

| Recurso | ID |
|---------|-----|
| Workspace | `90133059528` |
| Space OPERACAO | `901313356803` |
| Space JUBILEU INTERNAL | `901313356810` |
| Lista Gestao Campanhas | `901325668059` |
| Lista Publicacao | `901325668055` |
| Lista Planejamento | `901325668052` |
| Lista Lab IA | `901325668065` |
| Lista Design/Audiovisual | `901325668054` |
| Lista Redacao/Copy | `901325668053` |

## Arquivos JSON

| Arquivo | Workflow | Nodes |
|---------|----------|-------|
| `whatsapp-receiver.json` | Receptor + Comandos | 15 (webhook → parse → switch → 6 branches → reply) |
| `clickup-notifier.json` | Notificador Status | 6 (webhook → parse → get task → format → send → respond) |
| `daily-summary.json` | Resumo Diario | 6 (cron → get tasks → organize → AI → extract → send) |
| `weekly-summary.json` | Resumo Semanal | 6 (cron → get tasks → metrics → AI → extract → send) |

## Como Importar

1. Acesse n8n em `http://localhost:5678`
2. Va em **Workflows** → **Import from file**
3. Importe cada JSON na ordem:
   - `clickup-notifier.json` (mais simples)
   - `daily-summary.json`
   - `weekly-summary.json`
   - `whatsapp-receiver.json` (mais complexo)
4. Configure as variaveis de ambiente no n8n (Settings → Environment Variables)
5. Ative cada workflow

## Configurar Webhook ClickUp

Para o `clickup-notifier` funcionar, configure um webhook no ClickUp:

1. ClickUp → Settings → Integrations → Webhooks
2. URL: `http://SEU-SERVIDOR:5678/webhook/clickup-status-change`
3. Eventos: `taskStatusUpdated`
4. Space: OPERACAO + JUBILEU INTERNAL

## Variaveis de Ambiente (configurar no n8n)

| Variavel | Valor | Onde encontrar |
|----------|-------|----------------|
| `CLICKUP_API_TOKEN` | Token da API ClickUp | `.env` do docker |
| `EVOLUTION_API_KEY` | Chave da Evolution API | `.env` do docker |
| `EVOLUTION_INSTANCE` | `jubileu-agencia` | Nome definido no setup |
| `EVOLUTION_BASE_URL` | `http://evolution-api:8080` | Rede Docker interna |
| `WHATSAPP_GROUP_ID` | ID do grupo interno | Descobrir via `setup-whatsapp.sh` |
| `ANTHROPIC_API_KEY` | Chave API Anthropic | console.anthropic.com |

## Stack de IA

Os workflows de resumo usam **Claude Haiku 4.5** via API Anthropic para gerar textos formatados para WhatsApp. Pode ser trocado por OpenAI editando os nodes "AI Generate/Briefing/Summary".
