#!/bin/bash
# Fix Sprint Tasks v2 - Corrige assignees, custom fields tag/cliente/responsavel
# Data: 2026-02-24

API="https://api.clickup.com/api/v2"
TOKEN="pk_284457202_BHCMWP2K2UGRXHO39XSZP9XD4120W9HF"

# User IDs (REAIS - guests do workspace)
FERNANDO=466187
GABRIEL=3212457
KAROL=3161900
JUBILEU_AGENCY=284457202

# Custom Field IDs
CF_TAG="5c4b8d5c-ac61-447d-a89a-ad9d68e9e6a9"
CF_CLIENTE="01f1addc-7d25-49b6-b312-439a5fb8fb0e"
CF_RESPONSAVEL="932eee93-521c-4be7-b07f-7202529ed160"

# Custom Field Option UUIDs
TAG_FUNIL_PERPETUO="45d06673-bcf8-414e-806a-ad146a84328c"
CLIENTE_PELICULA="8904ef40-de6b-4ad5-ae94-b266e0d8f0fe"
RESP_FERNANDO="23224353-d227-4b8e-a19e-af031133a7df"
RESP_GABRIEL="239508a9-78b1-4f7e-8afc-87f4a27db2eb"
RESP_KAROL="cfd41920-6557-49ec-b0dc-60bc43754aff"

# All 24 task IDs
ALL_TASKS=(
  86afp0pnd 86afp0ppr 86afp0prq 86afp0ptw 86afp0pyc
  86afp0pzg 86afp0q0h 86afp0q1j 86afp0q47 86afp0rm1
  86afp0rp7 86afp0rr1 86afp0ruj 86afp0rzx 86afp0t28
  86afp0t5r 86afp0t8b 86afp0tb4 86afp0tjx 86afp0tr2
  86afp0tv1 86afp0ty9 86afp0u29 86afp0u6a
)

# Task assignment mapping:
# dev/coding → Fernando + Gabriel
# copy/roteiro → Fernando + Karol
# design/ref → Fernando + Gabriel
# review/qa → Fernando
# admin → Fernando

# Assignee arrays: [add_ids] [rem_ids] [responsavel_cf_uuid]
# Format: TASK_ID:ADD_IDS:RESPONSAVEL
declare -A TASK_ASSIGNEES
# Sprint 1
TASK_ASSIGNEES[86afp0pnd]="${FERNANDO},${GABRIEL}:${RESP_FERNANDO}"    # 1: MCP Cloudflare - dev
TASK_ASSIGNEES[86afp0ppr]="${FERNANDO},${GABRIEL}:${RESP_FERNANDO}"    # 2: Conectar Cloudflare - dev
TASK_ASSIGNEES[86afp0prq]="${FERNANDO},${KAROL}:${RESP_KAROL}"        # 3: Copy LP Decifrando - copy
TASK_ASSIGNEES[86afp0ptw]="${FERNANDO},${GABRIEL}:${RESP_GABRIEL}"     # 4: Ref estética - design
TASK_ASSIGNEES[86afp0pyc]="${FERNANDO},${GABRIEL}:${RESP_GABRIEL}"     # 5: Criar LP @dev - dev
TASK_ASSIGNEES[86afp0pzg]="${FERNANDO},${GABRIEL}:${RESP_FERNANDO}"    # 6: Pixels - dev
TASK_ASSIGNEES[86afp0q0h]="${FERNANDO},${GABRIEL}:${RESP_GABRIEL}"     # 7: Publicar Vercel - dev
TASK_ASSIGNEES[86afp0q1j]="${FERNANDO}:${RESP_FERNANDO}"               # 8: Testar LP - qa
TASK_ASSIGNEES[86afp0q47]="${FERNANDO},${GABRIEL}:${RESP_FERNANDO}"    # 9: DNS - dev
TASK_ASSIGNEES[86afp0rm1]="${FERNANDO}:${RESP_FERNANDO}"               # 10: Edição aula - audiovisual
TASK_ASSIGNEES[86afp0rp7]="${FERNANDO}:${RESP_FERNANDO}"               # 11: Aprovar conteúdo - review
TASK_ASSIGNEES[86afp0rr1]="${FERNANDO},${GABRIEL}:${RESP_FERNANDO}"    # 12: Criar curso Kiwify - dev
TASK_ASSIGNEES[86afp0ruj]="${FERNANDO}:${RESP_FERNANDO}"               # 13: Produto Kiwify - admin
# Sprint 2
TASK_ASSIGNEES[86afp0rzx]="${FERNANDO},${KAROL}:${RESP_KAROL}"        # 14: Copy LP Camarim - copy
TASK_ASSIGNEES[86afp0t28]="${FERNANDO},${GABRIEL}:${RESP_GABRIEL}"     # 15: Ref estética Camarim - design
TASK_ASSIGNEES[86afp0t5r]="${FERNANDO},${GABRIEL}:${RESP_GABRIEL}"     # 16: Criar LP Camarim @dev - dev
TASK_ASSIGNEES[86afp0t8b]="${FERNANDO},${GABRIEL}:${RESP_FERNANDO}"    # 17: Pixels Camarim - dev
TASK_ASSIGNEES[86afp0tb4]="${FERNANDO},${GABRIEL}:${RESP_GABRIEL}"     # 18: Publicar Camarim - dev
TASK_ASSIGNEES[86afp0tjx]="${FERNANDO},${GABRIEL}:${RESP_GABRIEL}"     # 19: Wireframe Linktree - design
TASK_ASSIGNEES[86afp0tr2]="${FERNANDO},${GABRIEL}:${RESP_GABRIEL}"     # 20: Criar Linktree @dev - dev
TASK_ASSIGNEES[86afp0tv1]="${FERNANDO},${GABRIEL}:${RESP_FERNANDO}"    # 21: Pixels+Publish Linktree - dev
TASK_ASSIGNEES[86afp0ty9]="${FERNANDO}:${RESP_FERNANDO}"               # 22: Testar Linktree - qa
TASK_ASSIGNEES[86afp0u29]="${FERNANDO},${GABRIEL}:${RESP_FERNANDO}"    # 23: MCP ManyChat - dev
TASK_ASSIGNEES[86afp0u6a]="${FERNANDO},${GABRIEL}:${RESP_FERNANDO}"    # 24: Funil ManyChat - dev

SUCCESS=0
FAIL=0
TOTAL=0

log_result() {
  local phase="$1" task="$2" http_code="$3" body="$4"
  TOTAL=$((TOTAL+1))
  if [[ "$http_code" == "200" ]]; then
    SUCCESS=$((SUCCESS+1))
    echo "  [OK] $phase | $task"
  else
    FAIL=$((FAIL+1))
    echo "  [FAIL] $phase | $task | HTTP $http_code | $body" | head -c 200
    echo
  fi
}

echo "========================================="
echo " FIX SPRINT TASKS v2"
echo " $(date)"
echo "========================================="

# =========================================
# PHASE 1: Fix Assignees (remove Jubileu agency, add correct people)
# =========================================
echo ""
echo "--- PHASE 1: Fix Assignees ---"

for TASK_ID in "${ALL_TASKS[@]}"; do
  CONFIG="${TASK_ASSIGNEES[$TASK_ID]}"
  ADD_IDS="${CONFIG%%:*}"

  # Build add array from comma-separated IDs
  ADD_JSON=""
  IFS=',' read -ra IDS <<< "$ADD_IDS"
  for id in "${IDS[@]}"; do
    if [ -n "$ADD_JSON" ]; then ADD_JSON+=","; fi
    ADD_JSON+="$id"
  done

  RESP=$(curl -s -w "\n%{http_code}" -X PUT "$API/task/$TASK_ID" \
    -H "Authorization: $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"assignees\":{\"add\":[$ADD_JSON],\"rem\":[$JUBILEU_AGENCY]}}")

  HTTP_CODE=$(echo "$RESP" | tail -1)
  BODY=$(echo "$RESP" | sed '$d')
  log_result "ASSIGNEE" "$TASK_ID (add:[$ADD_JSON] rem:[$JUBILEU_AGENCY])" "$HTTP_CODE" "$BODY"
done

# =========================================
# PHASE 2: Set Custom Field "🏷️ tag" = "funil perpertuo - pelicula"
# Labels type requires array of option IDs
# =========================================
echo ""
echo "--- PHASE 2: Set Custom Field Tag ---"

for TASK_ID in "${ALL_TASKS[@]}"; do
  RESP=$(curl -s -w "\n%{http_code}" -X POST "$API/task/$TASK_ID/field/$CF_TAG" \
    -H "Authorization: $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"value\":[\"$TAG_FUNIL_PERPETUO\"]}")

  HTTP_CODE=$(echo "$RESP" | tail -1)
  BODY=$(echo "$RESP" | sed '$d')
  log_result "CF_TAG" "$TASK_ID" "$HTTP_CODE" "$BODY"
done

# =========================================
# PHASE 3: Set Custom Field "😎 cliente" = "pelicula"
# Drop-down type requires single option UUID
# =========================================
echo ""
echo "--- PHASE 3: Set Custom Field Cliente ---"

for TASK_ID in "${ALL_TASKS[@]}"; do
  RESP=$(curl -s -w "\n%{http_code}" -X POST "$API/task/$TASK_ID/field/$CF_CLIENTE" \
    -H "Authorization: $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"value\":\"$CLIENTE_PELICULA\"}")

  HTTP_CODE=$(echo "$RESP" | tail -1)
  BODY=$(echo "$RESP" | sed '$d')
  log_result "CF_CLIENTE" "$TASK_ID" "$HTTP_CODE" "$BODY"
done

# =========================================
# PHASE 4: Set Custom Field "Responsavel" per task
# =========================================
echo ""
echo "--- PHASE 4: Set Custom Field Responsavel ---"

for TASK_ID in "${ALL_TASKS[@]}"; do
  CONFIG="${TASK_ASSIGNEES[$TASK_ID]}"
  RESP_UUID="${CONFIG##*:}"

  RESP=$(curl -s -w "\n%{http_code}" -X POST "$API/task/$TASK_ID/field/$CF_RESPONSAVEL" \
    -H "Authorization: $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"value\":\"$RESP_UUID\"}")

  HTTP_CODE=$(echo "$RESP" | tail -1)
  BODY=$(echo "$RESP" | sed '$d')
  log_result "CF_RESPONSAVEL" "$TASK_ID" "$HTTP_CODE" "$BODY"
done

# =========================================
# SUMMARY
# =========================================
echo ""
echo "========================================="
echo " RESULTADO FINAL"
echo " Total: $TOTAL | OK: $SUCCESS | FAIL: $FAIL"
echo "========================================="
