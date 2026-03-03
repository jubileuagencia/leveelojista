#!/bin/bash
# Fix Sprint Setup Funil - Complete task configuration
# Moves tasks to correct lists, sets assignees, tags, custom fields, dependencies, checklists

TOKEN="pk_284457202_BHCMWP2K2UGRXHO39XSZP9XD4120W9HF"
BASE="https://api.clickup.com/api/v2"
FERNANDO=284457202

# Custom field IDs
FIELD_CLIENTE="01f1addc-7d25-49b6-b312-439a5fb8fb0e"
FIELD_RESPONSAVEL="932eee93-521c-4be7-b07f-7202529ed160"

# Custom field option UUIDs
OPT_PELICULA="8904ef40-de6b-4ad5-ae94-b266e0d8f0fe"
OPT_FERNANDO="23224353-d227-4b8e-a19e-af031133a7df"
OPT_GABRIEL="239508a9-78b1-4f7e-8afc-87f4a27db2eb"
OPT_KAROL="cfd41920-6557-49ec-b0dc-60bc43754aff"

# List IDs
OLD_LIST="901325668059"  # Gestao de Campanhas (current)
LIST_LAB_IA="901325668065"
LIST_REDACAO="901325668053"
LIST_DESIGN="901325668054"
LIST_LPS="901325668058"
LIST_CAMPANHAS="901325668059"

# Due dates (ms)
DUE_SP1=1772323200000  # 2026-03-01 (Sunday)
DUE_SP2=1772928000000  # 2026-03-08 (Sunday)

# Counters
OK=0
FAIL=0

api() {
  local method=$1 url=$2 data=$3
  local resp
  if [ -n "$data" ]; then
    resp=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE$url" \
      -H "Authorization: $TOKEN" \
      -H "Content-Type: application/json" \
      -d "$data" 2>/dev/null)
  else
    resp=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE$url" \
      -H "Authorization: $TOKEN" \
      -H "Content-Type: application/json" 2>/dev/null)
  fi
  local code=$(echo "$resp" | tail -1)
  local body=$(echo "$resp" | sed '$d')
  if [[ "$code" =~ ^2 ]]; then
    ((OK++))
    echo "$body"
    return 0
  else
    ((FAIL++))
    echo "FAIL [$code]: $method $url" >&2
    echo "$body" >&2
    return 1
  fi
}

# Helper: move task from old list to new list
move_task() {
  local task_id=$1 new_list=$2
  if [ "$new_list" != "$OLD_LIST" ]; then
    echo "  Moving $task_id -> list $new_list"
    api POST "/list/$new_list/task/$task_id" > /dev/null
    sleep 0.3
    api DELETE "/list/$OLD_LIST/task/$task_id" > /dev/null
    sleep 0.3
  fi
}

# Helper: update task properties
update_task() {
  local task_id=$1 due=$2 status=$3
  echo "  Updating $task_id (due=$due, status=$status)"
  api PUT "/task/$task_id" "{\"due_date\":$due,\"due_date_time\":false,\"assignees\":{\"add\":[$FERNANDO]},\"status\":\"$status\"}" > /dev/null
  sleep 0.3
}

# Helper: add tag
add_tag() {
  local task_id=$1 tag=$2
  api POST "/task/$task_id/tag/$tag" > /dev/null
  sleep 0.2
}

# Helper: set custom field
set_field() {
  local task_id=$1 field_id=$2 value=$3
  api POST "/task/$task_id/field/$field_id" "{\"value\":\"$value\"}" > /dev/null
  sleep 0.2
}

# Helper: add dependency (task depends on dep_task)
add_dep() {
  local task_id=$1 dep_task=$2
  echo "  Dep: $task_id depends on $dep_task"
  api POST "/task/$task_id/dependency" "{\"depends_on\":\"$dep_task\"}" > /dev/null
  sleep 0.3
}

# Helper: create checklist and add items
create_checklist() {
  local task_id=$1 cl_name=$2
  shift 2
  local items=("$@")
  echo "  Checklist '$cl_name' on $task_id (${#items[@]} items)"
  local resp=$(api POST "/task/$task_id/checklist" "{\"name\":\"$cl_name\"}")
  sleep 0.2
  local cl_id=$(echo "$resp" | python3 -c "import sys,json; print(json.load(sys.stdin).get('checklist',{}).get('id',''))" 2>/dev/null)
  if [ -z "$cl_id" ]; then
    echo "  WARN: Could not get checklist ID for $task_id" >&2
    return 1
  fi
  for item in "${items[@]}"; do
    api POST "/checklist/$cl_id/checklist_item" "{\"name\":\"$item\"}" > /dev/null
    sleep 0.15
  done
}

echo "========================================"
echo "PHASE 1: Moving tasks to correct lists"
echo "========================================"

# To Lab IA (901325668065)
move_task "86afp0pnd" "$LIST_LAB_IA"    # 1. MCP Cloudflare
move_task "86afp0ppr" "$LIST_LAB_IA"    # 2. Connect Cloudflare
move_task "86afp0u29" "$LIST_LAB_IA"    # 23. ManyChat MCP

# To Redacao/Copy (901325668053)
move_task "86afp0prq" "$LIST_REDACAO"   # 3. Copy LP Decifrando
move_task "86afp0rzx" "$LIST_REDACAO"   # 14. Copy LP Camarim

# To Design/Audiovisual (901325668054)
move_task "86afp0ptw" "$LIST_DESIGN"    # 4. Refs LP Decifrando
move_task "86afp0rm1" "$LIST_DESIGN"    # 10. Edicao aula final
move_task "86afp0t28" "$LIST_DESIGN"    # 15. Refs LP Camarim
move_task "86afp0tjx" "$LIST_DESIGN"    # 19. Wireframe Linktree

# To Criacao de LPs/Funis (901325668058)
move_task "86afp0pyc" "$LIST_LPS"       # 5. Criar LP Decifrando
move_task "86afp0pzg" "$LIST_LPS"       # 6. Pixels LP Decifrando
move_task "86afp0q0h" "$LIST_LPS"       # 7. Publicar LP Decifrando
move_task "86afp0q1j" "$LIST_LPS"       # 8. Testar LP Decifrando
move_task "86afp0q47" "$LIST_LPS"       # 9. DNS LP Decifrando
move_task "86afp0t5r" "$LIST_LPS"       # 16. Criar LP Camarim
move_task "86afp0t8b" "$LIST_LPS"       # 17. Pixels LP Camarim
move_task "86afp0tb4" "$LIST_LPS"       # 18. Publicar LP Camarim
move_task "86afp0tr2" "$LIST_LPS"       # 20. Criar Linktree
move_task "86afp0tv1" "$LIST_LPS"       # 21. Pixels+Publish Linktree
move_task "86afp0ty9" "$LIST_LPS"       # 22. Testar Linktree

# Stay in Gestao de Campanhas: 11, 12, 13, 24

echo ""
echo "========================================"
echo "PHASE 2: Update due dates, assignees, status"
echo "========================================"

# Sprint 1 — tasks moving to 2-stage lists (status: to do)
update_task "86afp0pnd" $DUE_SP1 "to do"
update_task "86afp0ppr" $DUE_SP1 "to do"
update_task "86afp0ptw" $DUE_SP1 "to do"
update_task "86afp0pyc" $DUE_SP1 "to do"
update_task "86afp0pzg" $DUE_SP1 "to do"
update_task "86afp0q0h" $DUE_SP1 "to do"
update_task "86afp0q1j" $DUE_SP1 "to do"
update_task "86afp0q47" $DUE_SP1 "to do"
update_task "86afp0rm1" $DUE_SP1 "to do"

# Sprint 1 — tasks in 5-stage lists (status: a fazer)
update_task "86afp0prq" $DUE_SP1 "a fazer"
update_task "86afp0rp7" $DUE_SP1 "a fazer"
update_task "86afp0rr1" $DUE_SP1 "a fazer"
update_task "86afp0ruj" $DUE_SP1 "a fazer"

# Sprint 2 — tasks in 2-stage lists (status: to do)
update_task "86afp0t28" $DUE_SP2 "to do"
update_task "86afp0t5r" $DUE_SP2 "to do"
update_task "86afp0t8b" $DUE_SP2 "to do"
update_task "86afp0tb4" $DUE_SP2 "to do"
update_task "86afp0tjx" $DUE_SP2 "to do"
update_task "86afp0tr2" $DUE_SP2 "to do"
update_task "86afp0tv1" $DUE_SP2 "to do"
update_task "86afp0ty9" $DUE_SP2 "to do"
update_task "86afp0u29" $DUE_SP2 "to do"

# Sprint 2 — tasks in 5-stage lists (status: a fazer)
update_task "86afp0rzx" $DUE_SP2 "a fazer"
update_task "86afp0u6a" $DUE_SP2 "a fazer"

echo ""
echo "========================================"
echo "PHASE 3: Add EPIC tags"
echo "========================================"

# Infra Cloudflare
for t in 86afp0pnd 86afp0ppr; do add_tag "$t" "infra-cloudflare"; done

# LP Decifrando
for t in 86afp0prq 86afp0ptw 86afp0pyc 86afp0pzg 86afp0q0h 86afp0q1j 86afp0q47; do add_tag "$t" "lp-decifrando"; done

# Curso Kiwify
for t in 86afp0rm1 86afp0rp7 86afp0rr1 86afp0ruj; do add_tag "$t" "curso-kiwify"; done

# LP Camarim
for t in 86afp0rzx 86afp0t28 86afp0t5r 86afp0t8b 86afp0tb4; do add_tag "$t" "lp-camarim"; done

# Linktree
for t in 86afp0tjx 86afp0tr2 86afp0tv1 86afp0ty9; do add_tag "$t" "linktree"; done

# ManyChat
for t in 86afp0u29 86afp0u6a; do add_tag "$t" "manychat"; done

echo ""
echo "========================================"
echo "PHASE 4: Set custom fields (Cliente + Responsavel)"
echo "========================================"

# Set Cliente = pelicula on ALL tasks
ALL_TASKS=(86afp0pnd 86afp0ppr 86afp0prq 86afp0ptw 86afp0pyc 86afp0pzg 86afp0q0h 86afp0q1j 86afp0q47 86afp0rm1 86afp0rp7 86afp0rr1 86afp0ruj 86afp0rzx 86afp0t28 86afp0t5r 86afp0t8b 86afp0tb4 86afp0tjx 86afp0tr2 86afp0tv1 86afp0ty9 86afp0u29 86afp0u6a)

echo "Setting Cliente=pelicula on all ${#ALL_TASKS[@]} tasks..."
for t in "${ALL_TASKS[@]}"; do
  set_field "$t" "$FIELD_CLIENTE" "$OPT_PELICULA"
done

# Set Responsavel per task
echo "Setting Responsavel..."
# Fernando (dev/tech/review)
for t in 86afp0pnd 86afp0ppr 86afp0pyc 86afp0pzg 86afp0q0h 86afp0q1j 86afp0q47 86afp0rp7 86afp0rr1 86afp0ruj 86afp0t5r 86afp0t8b 86afp0tb4 86afp0tr2 86afp0tv1 86afp0ty9 86afp0u29 86afp0u6a; do
  set_field "$t" "$FIELD_RESPONSAVEL" "$OPT_FERNANDO"
done

# Gabriel (audiovisual/design)
for t in 86afp0ptw 86afp0rm1 86afp0t28 86afp0tjx; do
  set_field "$t" "$FIELD_RESPONSAVEL" "$OPT_GABRIEL"
done

# Karol (copy)
for t in 86afp0prq 86afp0rzx; do
  set_field "$t" "$FIELD_RESPONSAVEL" "$OPT_KAROL"
done

echo ""
echo "========================================"
echo "PHASE 5: Create dependencies"
echo "========================================"

# Sprint 1 — Infra
add_dep "86afp0ppr" "86afp0pnd"  # Connect CF depends on Install MCP CF

# Sprint 1 — LP Decifrando
add_dep "86afp0pyc" "86afp0prq"  # Criar LP depends on Copy
add_dep "86afp0pyc" "86afp0ptw"  # Criar LP depends on Refs
add_dep "86afp0pzg" "86afp0pyc"  # Pixels depends on LP created
add_dep "86afp0q0h" "86afp0pyc"  # Publish depends on LP created
add_dep "86afp0q1j" "86afp0pzg"  # Test depends on Pixels
add_dep "86afp0q1j" "86afp0q0h"  # Test depends on Published
add_dep "86afp0q47" "86afp0q0h"  # DNS depends on Published
add_dep "86afp0q47" "86afp0ppr"  # DNS depends on Cloudflare connected

# Sprint 1 — Curso Kiwify
add_dep "86afp0rp7" "86afp0rm1"  # Review depends on Edit complete
add_dep "86afp0rr1" "86afp0rp7"  # Create course depends on Approved
add_dep "86afp0ruj" "86afp0rr1"  # Product depends on Course created

# Sprint 2 — LP Camarim
add_dep "86afp0t5r" "86afp0rzx"  # Criar LP depends on Copy
add_dep "86afp0t5r" "86afp0t28"  # Criar LP depends on Refs
add_dep "86afp0t8b" "86afp0t5r"  # Pixels depends on LP
add_dep "86afp0tb4" "86afp0t5r"  # Publish+DNS depends on LP

# Sprint 2 — Linktree
add_dep "86afp0tr2" "86afp0tjx"  # Create depends on Wireframe
add_dep "86afp0tv1" "86afp0tr2"  # Publish depends on Created
add_dep "86afp0ty9" "86afp0tv1"  # Test depends on Published

# Sprint 2 — ManyChat
add_dep "86afp0u6a" "86afp0u29"  # Funnel depends on ManyChat installed

echo ""
echo "========================================"
echo "PHASE 6: Create Acceptance Criteria checklists"
echo "========================================"

create_checklist "86afp0pnd" "Acceptance Criteria" \
  "MCP Cloudflare instalado e funcional no AIOS" \
  "Comandos DNS disponíveis (list zones, create record)" \
  "Teste de resolução de domínio OK"

create_checklist "86afp0ppr" "Acceptance Criteria" \
  "Domínio peliculasideral.com.br conectado no Cloudflare" \
  "DNS propagado e resolvendo corretamente" \
  "SSL/TLS ativo (Full mode)"

create_checklist "86afp0prq" "Acceptance Criteria" \
  "Headline principal definida" \
  "Seções de benefícios escritas" \
  "FAQ preenchido" \
  "CTA com texto do botão definido" \
  "Copy revisada por Fernando e Victor" \
  "Texto final salvo em doc compartilhado"

create_checklist "86afp0ptw" "Acceptance Criteria" \
  "Moodboard com referências de design criado" \
  "Imagens/fotos selecionadas e otimizadas" \
  "Paleta de cores alinhada com brand Película" \
  "Assets organizados em pasta compartilhada"

create_checklist "86afp0pyc" "Acceptance Criteria" \
  "Página construída (HTML/CSS/JS ou framework)" \
  "Responsiva mobile-first" \
  "Seções: hero, benefícios, depoimentos, FAQ, CTA" \
  "Botão de checkout integrado com Kiwify" \
  "Performance Lighthouse > 90" \
  "Preview aprovado por Fernando"

create_checklist "86afp0pzg" "Acceptance Criteria" \
  "Pixel Facebook instalado e disparando PageView" \
  "Pixel X (Twitter) instalado e disparando PageView" \
  "Evento ViewContent no scroll 50%" \
  "Evento InitiateCheckout no clique do CTA" \
  "Testado com Facebook Pixel Helper e X Tag Helper"

create_checklist "86afp0q0h" "Acceptance Criteria" \
  "Deploy na Vercel com build OK (zero errors)" \
  "Responsividade testada em mobile/tablet/desktop" \
  "Todos os assets carregando corretamente"

create_checklist "86afp0q1j" "Acceptance Criteria" \
  "Botões funcionando em todos os breakpoints" \
  "Links internos e externos corretos" \
  "Redirect para checkout Kiwify testado e funcional" \
  "Testado em iOS Safari e Android Chrome"

create_checklist "86afp0q47" "Acceptance Criteria" \
  "CNAME configurado no Cloudflare" \
  "SSL Cloudflare ativo e sem mixed content" \
  "URL lp.peliculasideral.com.br/decifrando acessível" \
  "Redirect HTTP→HTTPS funcionando"

create_checklist "86afp0rm1" "Acceptance Criteria" \
  "Edição da última aula finalizada" \
  "Qualidade de áudio verificada" \
  "Qualidade de vídeo verificada" \
  "Arquivo exportado em MP4 1080p" \
  "Entregue para revisão de Fernando e Victor"

create_checklist "86afp0rp7" "Acceptance Criteria" \
  "Todas as aulas assistidas na íntegra" \
  "Feedback de ajustes enviado ao Gabriel (se necessário)" \
  "Aprovação final documentada" \
  "Conteúdo liberado para upload no Kiwify"

create_checklist "86afp0rr1" "Acceptance Criteria" \
  "Curso criado na plataforma Kiwify" \
  "Módulos e aulas organizados na ordem correta" \
  "Vídeos de todas as aulas uploaded" \
  "Thumbnails/capas configuradas" \
  "Área de membros testada (visão do aluno)"

create_checklist "86afp0ruj" "Acceptance Criteria" \
  "Produto criado com nome e descrição corretos" \
  "Preço configurado: R$147/ano (assinatura anual)" \
  "Checkout page configurada e funcional" \
  "Link de checkout gerado e testado" \
  "Integração com gateway de pagamento OK" \
  "E-mail de boas-vindas configurado"

create_checklist "86afp0rzx" "Acceptance Criteria" \
  "Headline principal definida" \
  "Seções de benefícios do Camarim escritas" \
  "FAQ preenchido" \
  "CTA definido com texto do botão" \
  "Copy revisada por Fernando e Victor" \
  "Texto final salvo em doc compartilhado"

create_checklist "86afp0t28" "Acceptance Criteria" \
  "Referências de design coletadas (moodboard)" \
  "Imagens/fotos selecionadas e otimizadas" \
  "Paleta de cores alinhada com brand Película" \
  "Assets organizados em pasta compartilhada"

create_checklist "86afp0t5r" "Acceptance Criteria" \
  "Página construída responsiva (mobile-first)" \
  "Seções: hero, benefícios, depoimentos, FAQ, CTA" \
  "Formulário ou botão de checkout integrado" \
  "Performance Lighthouse > 90" \
  "Preview aprovado por Fernando"

create_checklist "86afp0t8b" "Acceptance Criteria" \
  "Pixel Facebook instalado (PageView)" \
  "Pixel X instalado (PageView)" \
  "Evento ViewContent no scroll 50%" \
  "Evento Lead/InitiateCheckout no CTA" \
  "Testado com Pixel Helper e X Tag Helper"

create_checklist "86afp0tb4" "Acceptance Criteria" \
  "Deploy na Vercel com build OK" \
  "Subdomínio lp.peliculasideral.com.br/camarim via Cloudflare" \
  "SSL ativo e funcionando" \
  "Responsividade testada mobile/tablet/desktop" \
  "Links e botões funcionando" \
  "Redirect para checkout Kiwify testado"

create_checklist "86afp0tjx" "Acceptance Criteria" \
  "Wireframe com hierarquia dos links definida" \
  "Referências visuais coletadas (alinhadas com brand)" \
  "Ordem de prioridade dos links definida" \
  "Aprovado por Fernando"

create_checklist "86afp0tr2" "Acceptance Criteria" \
  "Página com design on-brand Película Sideral" \
  "Links: LP Decifrando, LP Camarim, Substack, YouTube, contato" \
  "Responsiva mobile-first (90%+ tráfego mobile)" \
  "Animações/transições suaves" \
  "Favicon e meta tags configurados" \
  "Preview aprovado por Fernando"

create_checklist "86afp0tv1" "Acceptance Criteria" \
  "Pixel Facebook instalado (PageView + cliques)" \
  "Deploy na Vercel com build OK" \
  "Subdomínio link.peliculasideral.com.br via Cloudflare" \
  "SSL ativo" \
  "URL atualizada na bio do Instagram"

create_checklist "86afp0ty9" "Acceptance Criteria" \
  "Todos os links abrem corretamente (mobile + desktop)" \
  "Pixel Facebook disparando eventos corretos" \
  "Velocidade de carregamento < 2 segundos" \
  "Testado em iOS Safari e Android Chrome" \
  "Links de checkout/LP redirecionam corretamente"

create_checklist "86afp0u29" "Acceptance Criteria" \
  "Conta ManyChat criada/ativada para Película Sideral" \
  "Instagram da Película conectado" \
  "MCP ManyChat ou API configurada no AIOS" \
  "Permissões de DM e comentários ativas" \
  "Teste de envio de DM automático OK"

create_checklist "86afp0u6a" "Acceptance Criteria" \
  "Caminho 1: Keyword trigger → DM com link LP Decifrando" \
  "Caminho 2: Comentário trigger → DM automática com CTA" \
  "Fallback: Mensagem padrão para keywords não reconhecidas" \
  "Delays e sequências configurados" \
  "Teste end-to-end com conta real" \
  "Métricas de open rate e click rate configuradas"

echo ""
echo "========================================"
echo "DONE!"
echo "========================================"
echo "Success: $OK | Failures: $FAIL"
