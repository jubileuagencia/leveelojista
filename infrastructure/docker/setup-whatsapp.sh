#!/bin/bash
# ============================================
# Setup WhatsApp — Evolution API + Jubileu
# ============================================
# Uso: ./setup-whatsapp.sh
# Pre-requisito: docker compose up -d (stack rodando)
# ============================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/.env"

BASE_URL="http://localhost:8085"
INSTANCE_NAME="jubileu-agencia"

echo "================================================"
echo "  Setup WhatsApp — Jubileu Agencia"
echo "================================================"
echo ""

# ── 1. Verificar se Evolution API esta rodando ──
echo "[1/5] Verificando Evolution API..."
if ! curl -sf "$BASE_URL" > /dev/null 2>&1; then
  echo "ERRO: Evolution API nao esta acessivel em $BASE_URL"
  echo "Execute: docker compose up -d"
  exit 1
fi
echo "  OK — Evolution API rodando"
echo ""

# ── 2. Criar instancia WhatsApp ──
echo "[2/5] Criando instancia '$INSTANCE_NAME'..."
CREATE_RESPONSE=$(curl -sf -X POST "$BASE_URL/instance/create" \
  -H "Content-Type: application/json" \
  -H "apikey: $EVOLUTION_API_KEY" \
  -d "{
    \"instanceName\": \"$INSTANCE_NAME\",
    \"integration\": \"WHATSAPP-BAILEYS\",
    \"qrcode\": true,
    \"rejectCall\": true,
    \"msgCall\": \"Nao atendo chamadas por este numero. Envie mensagem de texto.\",
    \"groupsIgnore\": false,
    \"alwaysOnline\": true,
    \"readMessages\": false,
    \"readStatus\": false,
    \"syncFullHistory\": false
  }" 2>&1) || true

if echo "$CREATE_RESPONSE" | grep -q "instance already created"; then
  echo "  Instancia ja existe — OK"
elif echo "$CREATE_RESPONSE" | grep -q "\"instance\""; then
  echo "  Instancia criada com sucesso"
else
  echo "  Resposta: $CREATE_RESPONSE"
fi
echo ""

# ── 3. Gerar QR Code ──
echo "[3/5] Gerando QR Code para conexao..."
echo ""
echo "  Abra no navegador:"
echo "  $BASE_URL/instance/connect/$INSTANCE_NAME"
echo ""
echo "  Ou escaneie o QR code que aparecera abaixo:"
echo ""

QR_RESPONSE=$(curl -sf "$BASE_URL/instance/connect/$INSTANCE_NAME" \
  -H "apikey: $EVOLUTION_API_KEY" 2>&1) || true

if echo "$QR_RESPONSE" | grep -q "base64"; then
  echo "  QR Code gerado! Abra o link acima no navegador para escanear."
elif echo "$QR_RESPONSE" | grep -q "open"; then
  echo "  WhatsApp ja esta conectado!"
else
  echo "  Resposta: $QR_RESPONSE"
fi
echo ""

# ── 4. Aguardar conexao ──
echo "[4/5] Aguardando conexao do WhatsApp..."
echo "  Escaneie o QR Code com o WhatsApp da agencia."
echo "  Pressione ENTER apos escanear..."
read -r

STATE_RESPONSE=$(curl -sf "$BASE_URL/instance/connectionState/$INSTANCE_NAME" \
  -H "apikey: $EVOLUTION_API_KEY" 2>&1)

if echo "$STATE_RESPONSE" | grep -q "open"; then
  echo "  CONECTADO com sucesso!"
else
  echo "  Estado atual: $STATE_RESPONSE"
  echo "  Tente novamente se necessario."
fi
echo ""

# ── 5. Listar grupos ──
echo "[5/5] Buscando grupos do WhatsApp..."
GROUPS_RESPONSE=$(curl -sf "$BASE_URL/group/fetchAllGroups/$INSTANCE_NAME" \
  -H "apikey: $EVOLUTION_API_KEY" 2>&1) || true

echo "  Grupos encontrados:"
echo "$GROUPS_RESPONSE" | python3 -c "
import sys, json
try:
    groups = json.load(sys.stdin)
    if isinstance(groups, list):
        for g in groups:
            name = g.get('subject', g.get('name', 'Sem nome'))
            gid = g.get('id', 'N/A')
            print(f'    - {name}: {gid}')
    else:
        print(f'    {groups}')
except:
    print(f'    (resposta raw) {sys.stdin.read()}')
" 2>/dev/null || echo "  $GROUPS_RESPONSE"

echo ""
echo "================================================"
echo "  Setup concluido!"
echo ""
echo "  Proximos passos:"
echo "  1. Anote o ID do grupo interno (formato: 120363XXXXX@g.us)"
echo "  2. Teste enviando mensagem:"
echo "     curl -X POST $BASE_URL/message/sendText/$INSTANCE_NAME \\"
echo "       -H 'apikey: $EVOLUTION_API_KEY' \\"
echo "       -H 'Content-Type: application/json' \\"
echo "       -d '{\"number\":\"<GROUP_ID>\",\"text\":\"Assistente Jubileu conectado!\"}'"
echo "  3. Configure os workflows no n8n (http://localhost:5678)"
echo "================================================"
