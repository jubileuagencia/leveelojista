#!/usr/bin/env node
/**
 * Update Task Descriptions v1.0
 * Atualiza as 24 tasks originais do Sprint Setup do Funil Película
 * com descrições detalhadas passo-a-passo usando AIOS
 *
 * Uso: node scripts/update-task-descriptions.js
 */

const API = 'https://api.clickup.com/api/v2';
const TOKEN = 'pk_284457202_BHCMWP2K2UGRXHO39XSZP9XD4120W9HF';

// ============================================================
// TASK DESCRIPTIONS
// ============================================================

const tasks = [
  // ─── SPRINT 1: INFRA CLOUDFLARE ───
  {
    id: '86afp0pnd',
    name: '#1 Instalar MCP Cloudflare no AIOS',
    description: `## Contexto no Funil
Esta task configura a infraestrutura DNS necessária para que as LPs do funil (Decifrando + Camarim) tenham domínios personalizados. Sem Cloudflare, as LPs ficam em subdomínios genéricos do Vercel.

## Objetivo
Instalar e configurar o MCP Server do Cloudflare no ecossistema AIOS para gerenciar DNS e domínios diretamente pelo Claude Code.

## Pré-requisitos
- Conta Cloudflare ativa com domínio registrado
- API Token do Cloudflare com permissões de DNS
- Acesso ao arquivo .mcp.json do projeto

## Passo a Passo — Execução AIOS

### Passo 1: Pesquisar MCP Cloudflare
**Agente:** @devops
**Ferramenta:** Claude Code / WebSearch
Acessar a documentação oficial: https://developers.cloudflare.com/agents/model-context-protocol/
Verificar requisitos de instalação e configuração.

### Passo 2: Instalar MCP Server
**Agente:** @devops
**Ferramenta:** Bash (npm/npx)
Adicionar o servidor MCP ao .mcp.json do projeto:
- Configurar endpoint e autenticação
- Definir API Token do Cloudflare como variável de ambiente
- Testar conexão com "list zones"

### Passo 3: Validar Ferramentas Disponíveis
**Agente:** @devops
**Ferramenta:** Claude Code MCP Tools
Verificar que as seguintes operações estão disponíveis:
- Listar zonas DNS (list zones)
- Criar registro DNS (create record)
- Atualizar registro DNS (update record)
- Deletar registro DNS (delete record)

### Passo 4: Teste de Integração
**Agente:** @qa
**Ferramenta:** Claude Code
Executar comandos básicos para confirmar funcionamento:
- Listar domínios existentes
- Criar um registro TXT de teste
- Verificar resolução DNS
- Remover registro de teste

## Referências
- Cloudflare MCP: https://developers.cloudflare.com/agents/model-context-protocol/
- Arquivo de config MCP: .mcp.json
- SOP MCP: .claude/rules/mcp-usage.md
- Regras de governança MCP: @devops é o único que gerencia MCPs

## Responsáveis
- **Execução:** Fernando + Gabriel (@devops)
- **Aprovação:** Fernando (Level 3 — nova ferramenta)

## Sprint Points: 3 | Épico: Infra MCP | Sprint: 1`
  },
  {
    id: '86afp0ppr',
    name: '#2 Conectar domínio Cloudflare + configurar DNS base',
    description: `## Contexto no Funil
Com o MCP Cloudflare instalado (#1), esta task conecta o domínio personalizado e cria a estrutura DNS base que será usada por todas as LPs do funil e pelo Linktree.

## Objetivo
Configurar o domínio no Cloudflare e preparar a estrutura DNS para receber as LPs (Decifrando, Camarim) e o Linktree.

## Pré-requisitos
- [x] MCP Cloudflare instalado e funcional (#1)
- Domínio registrado e apontando nameservers para Cloudflare
- Plano de subdomínios definido (ex: decifrando.dominio.com, camarim.dominio.com)

## Passo a Passo — Execução AIOS

### Passo 1: Verificar Zona DNS
**Agente:** @devops
**Ferramenta:** MCP Cloudflare (list zones)
Confirmar que o domínio está ativo no Cloudflare e nameservers propagados.

### Passo 2: Criar Registros DNS Base
**Agente:** @devops
**Ferramenta:** MCP Cloudflare (create record)
Criar os registros necessários:
- CNAME para LP Decifrando → cname.vercel-dns.com
- CNAME para LP Camarim → cname.vercel-dns.com
- CNAME para Linktree (se aplicável)
- Verificar TTL e proxy status (orange cloud ON para CDN)

### Passo 3: Configurar SSL/TLS
**Agente:** @devops
**Ferramenta:** Cloudflare Dashboard / MCP
- Modo SSL: Full (Strict)
- Always Use HTTPS: ON
- Auto Minify: JS + CSS + HTML
- Brotli Compression: ON

### Passo 4: Validar Propagação
**Agente:** @qa
**Ferramenta:** Bash (dig, nslookup)
- Verificar resolução de cada subdomínio
- Confirmar certificado SSL ativo
- Testar redirect HTTP → HTTPS

## Referências
- MCP Cloudflare tools: .mcp.json
- Vercel custom domains: https://vercel.com/docs/projects/domains

## Responsáveis
- **Execução:** Fernando + Gabriel (@devops)
- **Aprovação:** Fernando

## Sprint Points: 2 | Épico: Infra MCP | Sprint: 1`
  },

  // ─── SPRINT 1: LP DECIFRANDO ───
  {
    id: '86afp0prq',
    name: '#3 Escrever copy LP Decifrando o Mapa Astral',
    description: `## Contexto no Funil
A LP Decifrando é a página de venda do curso "Introdução ao Mapa Astral" (Kiwify). O copy é o coração da conversão — precisa comunicar o valor do curso usando o tom da Película Sideral: poético, acessível, empoderador.

## Objetivo
Escrever a copy completa da LP Decifrando seguindo o brand DNA da Película Sideral e a estrutura de oferta já definida.

## Dados da Oferta (extraídos da LP atual)
- **Produto:** Curso "Introdução ao Mapa Astral" (Kiwify)
- **Preço Curso Solo:** R$147 (12x R$14,23)
- **Preço Pacote Completo:** R$297 (12x R$28,76) — inclui curso + acesso Camarim Anual
- **Checkout:** Kiwify (URLs a serem atualizadas — ver task #25)

## Pré-requisitos
- Leitura do brand DNA: kb/brand-dna/pelicula-sideral.md
- Entendimento da oferta e dos preços
- Referências estéticas (#4) podem ser feitas em paralelo

## Passo a Passo — Execução AIOS

### Passo 1: Briefing de Copy
**Agente:** @analyst
**Ferramenta:** Read tool
Ler e absorver os seguintes documentos:
- kb/brand-dna/pelicula-sideral.md (tom de voz, pilares, personalidade)
- docs/funil-spoiler-semanal.md (posicionamento do curso no funil)
- LP atual: https://lp-decifrando-v3.vercel.app/ (extrair estrutura)

### Passo 2: Estrutura de Seções
**Agente:** @analyst / Fernando
**Ferramenta:** Editor de texto
Definir a estrutura da LP:
1. **Hero Section:** Headline principal + sub-headline + CTA primário
2. **Problema/Dor:** O que o público sente (confusão com mapa astral)
3. **Solução:** O que o curso oferece (clareza, autonomia)
4. **Conteúdo do Curso:** Módulos e aulas (o que vai aprender)
5. **Para Quem É:** Público-alvo ideal
6. **Prova Social:** Depoimentos / resultados
7. **Garantia:** Política de reembolso Kiwify (7 dias)
8. **Oferta:** Preços (Solo R$147 / Pacote R$297)
9. **FAQ:** Perguntas frequentes (5-8)
10. **CTA Final:** Último chamado com urgência suave

### Passo 3: Escrever Copy
**Agente:** Fernando + Karol
**Tom:** Poético, acessível, sem esoterismo pesado. "Como explicar para um amigo."
**Regras de tom (kb/brand-dna/pelicula-sideral.md):**
- Nunca fatalista, sempre empoderador
- CTA como extensão da conversa, não propaganda
- Usar metáforas cinematográficas (nome "Película")
- Linguagem inclusiva e contemporânea

### Passo 4: Revisão e Aprovação
**Agente:** Fernando (Level 3)
**Fluxo:** Karol escreve draft → Fernando revisa → Victor valida tom de voz

## Referências
- Brand DNA: kb/brand-dna/pelicula-sideral.md
- Estratégia do funil: docs/funil-spoiler-semanal.md
- LP atual (referência): https://lp-decifrando-v3.vercel.app/
- SOP Workflow: kb/sops/workflow-clickup.md

## Responsáveis
- **Execução:** Fernando + Karol
- **Aprovação:** Fernando (Level 3) + Victor (validação de tom)

## Sprint Points: 3 | Épico: LP Decifrando | Sprint: 1`
  },
  {
    id: '86afp0ptw',
    name: '#4 Coletar referências estéticas LP Decifrando',
    description: `## Contexto no Funil
As referências visuais guiam o design da LP Decifrando. Devem traduzir a identidade visual da Película Sideral: estética cinematográfica, tons profundos, tipografia elegante.

## Objetivo
Criar um moodboard com referências visuais para a LP Decifrando, incluindo paleta de cores, tipografia, estilo de imagens e layout.

## Pré-requisitos
- Leitura do brand DNA: kb/brand-dna/pelicula-sideral.md
- Acesso ao Instagram @peliculasideral (referência visual atual)

## Passo a Passo — Execução AIOS

### Passo 1: Análise do Brand DNA Visual
**Agente:** @analyst
**Ferramenta:** Read tool
Ler kb/brand-dna/pelicula-sideral.md focando em:
- Pilares visuais da marca
- Paleta de cores existente
- Referências estéticas mencionadas
- Tom visual: "cinematográfico + místico + acessível"

### Passo 2: Pesquisa de Referências
**Agente:** Gabriel
**Ferramenta:** Pinterest, Dribbble, Behance, Instagram
Coletar 10-15 referências visuais:
- 3-4 LPs de cursos de astrologia/espiritualidade (benchmark)
- 3-4 paletas de cores (tons profundos: roxo, azul noturno, dourado)
- 2-3 referências tipográficas (serif elegante + sans moderna)
- 2-3 referências de layout (mobile-first, scroll longo)

### Passo 3: Montar Moodboard
**Agente:** Gabriel
**Ferramenta:** Figma ou Canva
Organizar as referências em um moodboard com:
- Paleta de cores definida (primária, secundária, accent)
- Tipografia (heading + body + accent)
- Estilo de imagens/ilustrações
- Layout de referência para cada seção

### Passo 4: Aprovação
**Agente:** Fernando (Level 3)
**Fluxo:** Gabriel apresenta moodboard → Fernando aprova → Seguir para #5

## Referências
- Brand DNA: kb/brand-dna/pelicula-sideral.md
- LP atual: https://lp-decifrando-v3.vercel.app/ (design existente)

## Responsáveis
- **Execução:** Gabriel (design lead)
- **Aprovação:** Fernando (Level 3)

## Sprint Points: 2 | Épico: LP Decifrando | Sprint: 1`
  },
  {
    id: '86afp0pyc',
    name: '#5 Criar página LP Decifrando com @dev AIOS',
    description: `## Contexto no Funil
A LP Decifrando é a página de vendas do curso "Introdução ao Mapa Astral" — ponto de conversão principal do FUNDO do funil. Recebe tráfego do ManyChat (Caminho B) e do Linktree.

## Dados da Oferta
- **Produto:** Curso "Introdução ao Mapa Astral"
- **Preço Solo:** R$147 (12x R$14,23)
- **Preço Pacote:** R$297 (12x R$28,76) — curso + Camarim Anual
- **Checkout:** Kiwify (URLs dependem da task #13)
- **LP atual:** https://lp-decifrando-v3.vercel.app/

## Objetivo
Desenvolver (ou refatorar) a LP Decifrando usando o @dev do AIOS, com design responsivo mobile-first, copy aprovada e botões de checkout integrados.

## Pré-requisitos
- [x] Copy finalizada (#3)
- [x] Referências estéticas aprovadas (#4)
- [ ] Checkout URLs do Kiwify (#13 → #25)

## Passo a Passo — Execução AIOS

### Passo 1: Analisar LP Atual
**Agente:** @dev
**Ferramenta:** Read tool + Playwright (screenshot)
Ler o código-fonte da LP atual em lp-decifrando-v3.vercel.app:
- Identificar framework utilizado (HTML/CSS/JS, React, Next.js)
- Mapear estrutura de componentes
- Identificar placeholders de checkout

### Passo 2: Preparar Ambiente de Desenvolvimento
**Agente:** @dev
**Ferramenta:** Bash (git, npm)
- Clonar/acessar repositório da LP
- Instalar dependências
- Rodar em modo dev local (localhost)

### Passo 3: Implementar Seções da LP
**Agente:** @dev (Gabriel + Fernando)
**Ferramenta:** Edit tool, Write tool
Construir cada seção seguindo copy (#3) e design (#4):
1. Hero: headline + sub + CTA sticky
2. Problema/Dor: texto + ícones/ilustrações
3. Solução: benefícios em grid
4. Conteúdo: módulos com accordion/expandir
5. Prova Social: cards de depoimentos
6. Oferta: pricing cards (Solo R$147 / Pacote R$297)
7. FAQ: accordion responsivo
8. Footer CTA: último chamado

### Passo 4: Integrar Checkout Kiwify
**Agente:** @dev
**Ferramenta:** Edit tool
- Inserir URLs de checkout nos botões CTA
- Se URLs não estiverem prontas, usar placeholder: pay.kiwify.com.br/PLACEHOLDER
- Marcar com TODO para task #25 atualizar

### Passo 5: Otimizar Performance
**Agente:** @dev
**Ferramenta:** Bash (Lighthouse)
- Comprimir imagens (WebP, lazy loading)
- Minificar CSS/JS
- Meta tags SEO + Open Graph
- Target: Lighthouse > 90 em todas as métricas

### Passo 6: Preparar para Pixels
**Agente:** @dev
**Ferramenta:** Edit tool
Adicionar slots para pixels (task #6):
- Espaço para Meta Pixel no <head>
- Espaço para X Pixel no <head>
- Data attributes nos botões CTA para event tracking

## Referências
- Brand DNA: kb/brand-dna/pelicula-sideral.md
- Estratégia: docs/funil-spoiler-semanal.md
- LP atual: https://lp-decifrando-v3.vercel.app/

## Responsáveis
- **Execução:** Gabriel (@dev lead) + Fernando
- **Aprovação:** Fernando (Level 3 — preview visual)

## Sprint Points: 8 | Épico: LP Decifrando | Sprint: 1`
  },
  {
    id: '86afp0pzg',
    name: '#6 Instalar Pixels (Meta + X) na LP Decifrando',
    description: `## Contexto no Funil
Os pixels de rastreamento são essenciais para remarketing e atribuição de conversão. Sem eles, não é possível medir ROI do tráfego orgânico que chega via ManyChat → LP.

## Objetivo
Instalar e configurar Meta Pixel (Facebook) e X Pixel (Twitter) na LP Decifrando, com eventos de conversão nos botões de checkout.

## Pré-requisitos
- [x] LP Decifrando construída (#5)
- [x] Pixel Meta Ads já criado e configurado (conta ativa)
- [x] Pixel X (Twitter) já criado e configurado (conta ativa)

## Passo a Passo — Execução AIOS

### Passo 1: Obter IDs dos Pixels
**Agente:** Fernando
**Ferramenta:** Meta Business Suite + X Ads Manager
- Copiar Pixel ID do Meta (Facebook)
- Copiar Pixel ID do X (Twitter)
- Anotar eventos padrão necessários

### Passo 2: Instalar Meta Pixel
**Agente:** @dev
**Ferramenta:** Edit tool
Adicionar no <head> da LP:
- Script base do Meta Pixel (fbq init + PageView)
- Evento ViewContent nas seções de oferta
- Evento InitiateCheckout nos botões CTA
- Evento Lead no scroll 75%

### Passo 3: Instalar X Pixel
**Agente:** @dev
**Ferramenta:** Edit tool
Adicionar no <head> da LP:
- Script base do X Pixel
- Evento PageView
- Evento de conversão nos botões CTA

### Passo 4: Configurar Eventos Personalizados
**Agente:** @dev
**Ferramenta:** Edit tool
Criar eventos customizados para o funil:
- spoiler_lp_view (PageView)
- spoiler_section_oferta (scroll até pricing)
- spoiler_click_checkout_solo (click CTA R$147)
- spoiler_click_checkout_pacote (click CTA R$297)

### Passo 5: Testar Pixels
**Agente:** @qa
**Ferramenta:** Meta Pixel Helper (extensão Chrome) + X Pixel Helper
- Verificar que PageView dispara ao carregar
- Verificar eventos nos botões
- Confirmar dados chegando no painel de cada plataforma

## Referências
- Docs Meta Pixel: https://developers.facebook.com/docs/meta-pixel
- KPIs: docs/kpis-spoiler-semanal.md (métricas de conversão)

## Responsáveis
- **Execução:** Fernando + Gabriel (@dev)
- **Aprovação:** Fernando

## Sprint Points: 2 | Épico: LP Decifrando | Sprint: 1`
  },
  {
    id: '86afp0q0h',
    name: '#7 Publicar LP Decifrando na Vercel + domínio',
    description: `## Contexto no Funil
Deploy da LP Decifrando para produção. A LP precisa estar acessível publicamente para que ManyChat, Linktree e outros canais possam direcionar tráfego.

## Objetivo
Fazer deploy da LP Decifrando na Vercel e conectar ao domínio personalizado via Cloudflare.

## Pré-requisitos
- [x] LP Decifrando construída (#5)
- [x] Pixels instalados (#6) — pode ser feito em paralelo
- [x] Cloudflare DNS configurado (#2)

## Passo a Passo — Execução AIOS

### Passo 1: Preparar para Deploy
**Agente:** @dev
**Ferramenta:** Bash
- Verificar build sem erros: npm run build
- Verificar que não há secrets hardcoded
- Confirmar .env.production com variáveis corretas

### Passo 2: Deploy na Vercel
**Agente:** @dev
**Ferramenta:** MCP Vercel (deploy_to_vercel) ou Bash (vercel cli)
- Fazer deploy do projeto
- Verificar URL de preview gerada
- Testar preview antes de promover para production

### Passo 3: Conectar Domínio Personalizado
**Agente:** @dev
**Ferramenta:** Vercel Dashboard + MCP Cloudflare
- Adicionar custom domain na Vercel (ex: decifrando.peliculasideral.com)
- Verificar que CNAME no Cloudflare aponta para cname.vercel-dns.com
- Aguardar propagação DNS (pode levar até 24h)
- Verificar SSL automático da Vercel

### Passo 4: Validação Pós-Deploy
**Agente:** @qa
**Ferramenta:** Playwright (browser automation)
- Acessar URL de produção
- Verificar que todas as seções carregam
- Testar botões CTA
- Verificar responsividade mobile
- Confirmar pixels disparando em produção

## Referências
- Vercel MCP: usar tools de deploy listadas no ToolSearch
- Cloudflare DNS: configurado na task #2
- LP atual: https://lp-decifrando-v3.vercel.app/

## Responsáveis
- **Execução:** Gabriel (@dev)
- **Aprovação:** Fernando (validação visual em produção)

## Sprint Points: 2 | Épico: LP Decifrando | Sprint: 1`
  },
  {
    id: '86afp0q1j',
    name: '#8 Testar LP Decifrando (QA completo)',
    description: `## Contexto no Funil
QA da LP Decifrando antes de direcionar tráfego. Qualquer bug na LP = perda de conversão.

## Objetivo
Executar teste completo da LP Decifrando em múltiplos dispositivos e cenários.

## Pré-requisitos
- [x] LP publicada (#7)
- [x] Pixels instalados (#6)

## Passo a Passo — Execução AIOS

### Passo 1: Teste Desktop (Chrome, Firefox, Safari)
**Agente:** @qa
**Ferramenta:** Playwright (browser automation)
Para cada navegador:
- [ ] Página carrega sem erros no console
- [ ] Todas as imagens carregam (sem broken images)
- [ ] Scroll suave funciona
- [ ] Todos os links/botões CTA funcionam
- [ ] FAQ accordion abre/fecha corretamente
- [ ] Fonte e cores estão corretas

### Passo 2: Teste Mobile (iOS Safari, Android Chrome)
**Agente:** @qa
**Ferramenta:** Playwright (mobile viewport) + teste manual
- [ ] Layout responsivo sem overflow horizontal
- [ ] Botões CTA acessíveis sem scroll horizontal
- [ ] Texto legível sem zoom (min 16px)
- [ ] Imagens adaptadas para mobile
- [ ] Tempo de carregamento < 3s em 4G

### Passo 3: Teste de Conversão
**Agente:** @qa
**Ferramenta:** Browser manual
- [ ] Botão "Curso Solo R$147" leva ao checkout correto
- [ ] Botão "Pacote R$297" leva ao checkout correto
- [ ] UTM params são preservados no redirect
- [ ] Pixel Meta dispara evento InitiateCheckout
- [ ] Pixel X dispara evento de conversão

### Passo 4: Teste de Performance
**Agente:** @qa
**Ferramenta:** Bash (Lighthouse CLI)
- [ ] Performance Score > 90
- [ ] Accessibility Score > 85
- [ ] Best Practices > 90
- [ ] SEO Score > 90
- [ ] First Contentful Paint < 1.5s

### Passo 5: Relatório de QA
**Agente:** @qa
**Ferramenta:** ClickUp comment
Postar resultado do QA como comentário na task com:
- Screenshot de cada seção
- Lista de bugs encontrados (se houver)
- Resultado do Lighthouse
- Status: PASS / FAIL / CONDITIONAL

## Referências
- SOP QA: .aios-core/development/checklists/clickup-scrum-quality-gate.md
- KPIs de performance: docs/kpis-spoiler-semanal.md

## Responsáveis
- **Execução:** Fernando (@qa)
- **Aprovação:** Fernando (auto-aprova se PASS)

## Sprint Points: 2 | Épico: LP Decifrando | Sprint: 1`
  },
  {
    id: '86afp0q47',
    name: '#9 Configurar DNS final LP Decifrando',
    description: `## Contexto no Funil
Configuração final de DNS para garantir que o domínio personalizado da LP Decifrando está funcionando corretamente com SSL e CDN.

## Objetivo
Finalizar configuração DNS do domínio personalizado da LP Decifrando no Cloudflare.

## Pré-requisitos
- [x] Cloudflare configurado (#2)
- [x] LP publicada na Vercel (#7)

## Passo a Passo — Execução AIOS

### Passo 1: Verificar Propagação DNS
**Agente:** @devops
**Ferramenta:** Bash (dig, nslookup) + MCP Cloudflare
- Confirmar que CNAME resolve para Vercel
- Verificar TTL adequado (300s para fase de teste, 3600s para produção)
- Testar de múltiplas localizações (usar ferramentas online)

### Passo 2: Configurar Redirects
**Agente:** @devops
**Ferramenta:** MCP Cloudflare / Vercel
- Redirect www → non-www (ou vice-versa)
- Redirect HTTP → HTTPS (deve ser automático com Cloudflare)
- Configurar page rules se necessário

### Passo 3: Verificar SSL
**Agente:** @devops
**Ferramenta:** Bash (openssl s_client)
- Certificado válido e não expirado
- Cadeia de certificados completa
- Sem mixed content warnings

### Passo 4: Testar Acesso Final
**Agente:** @qa
**Ferramenta:** Browser
- Acessar pelo domínio personalizado
- Confirmar que não há redirect loops
- Verificar que o favicon e Open Graph funcionam

## Referências
- Cloudflare DNS: task #2
- Vercel custom domains docs

## Responsáveis
- **Execução:** Fernando + Gabriel (@devops)
- **Aprovação:** Fernando

## Sprint Points: 1 | Épico: LP Decifrando | Sprint: 1`
  },

  // ─── SPRINT 1: KIWIFY ───
  {
    id: '86afp0rm1',
    name: '#10 Finalizar edição da aula final do curso',
    description: `## Contexto no Funil
O curso "Introdução ao Mapa Astral" na Kiwify precisa ter todas as aulas editadas e finalizadas antes de ser publicado. A aula final é a última peça de conteúdo pendente.

## Objetivo
Finalizar a edição de vídeo da última aula do curso "Introdução ao Mapa Astral".

## Pré-requisitos
- Vídeo bruto gravado por Victor
- Briefing de edição definido
- Acesso ao projeto de edição (Premiere/DaVinci)

## Passo a Passo — Execução AIOS

### Passo 1: Receber Material Bruto
**Responsável:** Fernando
**Ação:**
- Confirmar que Victor entregou o vídeo bruto
- Verificar qualidade do áudio e vídeo
- Criar pasta organizada no drive/storage

### Passo 2: Briefing de Edição para Gabriel
**Responsável:** Fernando
**Ferramenta:** ClickUp comment ou briefing direto
Entregar para Gabriel:
- Vídeo bruto + timecodes de corte
- Identidade visual do curso (vinheta, lower thirds, paleta)
- Referência de edição das aulas anteriores
- Deadline de entrega

### Passo 3: Edição do Vídeo
**Responsável:** Gabriel
**Ferramenta:** Software de edição (Premiere/DaVinci)
- Cortar e organizar conteúdo
- Adicionar vinheta de abertura/encerramento
- Lower thirds e textos explicativos
- Música de fundo (se aplicável)
- Renderizar em qualidade adequada para Kiwify (1080p, H.264)

### Passo 4: Revisão e Aprovação
**Responsável:** Fernando + Victor
**Fluxo:**
- Gabriel entrega versão editada
- Fernando revisa qualidade técnica
- Victor aprova conteúdo e tom
- Se ajustes necessários, volta para passo 3

## Notas Importantes
- **Quem edita:** Gabriel (não Fernando)
- **Quem aprova conteúdo:** Victor (especialista em astrologia)
- **Quem aprova qualidade:** Fernando (Level 3)

## Referências
- Brand DNA: kb/brand-dna/pelicula-sideral.md (identidade visual)
- SOP Workflow: kb/sops/workflow-clickup.md (aprovação Level 3)

## Responsáveis
- **Edição:** Gabriel
- **Revisão conteúdo:** Victor
- **Aprovação final:** Fernando (Level 3)

## Sprint Points: 5 | Épico: Kiwify | Sprint: 1`
  },
  {
    id: '86afp0rp7',
    name: '#11 Aprovar conteúdo completo do curso',
    description: `## Contexto no Funil
Antes de subir o curso na Kiwify, todo o conteúdo precisa ser aprovado. Isso inclui todas as aulas editadas, materiais complementares e a estrutura do curso.

## Objetivo
Revisar e aprovar todo o conteúdo do curso "Introdução ao Mapa Astral" antes de publicar na Kiwify.

## Pré-requisitos
- [x] Aula final editada (#10)
- Todas as outras aulas já editadas
- Materiais complementares preparados (PDFs, checklists)

## Passo a Passo — Execução AIOS

### Passo 1: Inventário de Conteúdo
**Responsável:** Fernando
**Ferramenta:** Checklist
Listar e verificar todos os ativos:
- [ ] Aula 1: [título] — editada e aprovada
- [ ] Aula 2: [título] — editada e aprovada
- [ ] ... (todas as aulas)
- [ ] Aula Final: editada (#10)
- [ ] Materiais complementares (PDFs)
- [ ] Thumbnails de cada aula
- [ ] Descrição de cada módulo

### Passo 2: Revisão de Conteúdo (Victor)
**Responsável:** Victor
**Ação:**
- Assistir todas as aulas na sequência
- Verificar que o conteúdo está correto e atualizado
- Verificar que o tom está alinhado com o brand DNA
- Anotar ajustes necessários

### Passo 3: Revisão Técnica (Fernando)
**Responsável:** Fernando
**Ação:**
- Qualidade de áudio e vídeo consistente
- Vinhetas e lower thirds padronizados
- Duração adequada de cada aula
- Materiais complementares formatados

### Passo 4: Aprovação Final
**Responsável:** Fernando (Level 3)
**Ação:**
- Marcar como aprovado no ClickUp
- Liberar para upload na Kiwify (#12)
- Documentar qualquer ressalva

## Referências
- Brand DNA: kb/brand-dna/pelicula-sideral.md
- SOP Workflow: kb/sops/workflow-clickup.md

## Responsáveis
- **Revisão conteúdo:** Victor
- **Revisão técnica + aprovação:** Fernando (Level 3)

## Sprint Points: 2 | Épico: Kiwify | Sprint: 1`
  },
  {
    id: '86afp0rr1',
    name: '#12 Criar curso na Kiwify (upload + estrutura)',
    description: `## Contexto no Funil
Com o conteúdo aprovado, é hora de estruturar o curso na plataforma Kiwify. Isso inclui upload de todas as aulas, criação de módulos e configuração da área de membros.

## Objetivo
Criar e configurar o curso "Introdução ao Mapa Astral" na Kiwify com todos os módulos, aulas e materiais.

## Pré-requisitos
- [x] Conteúdo aprovado (#11)
- [x] Conta Kiwify já criada e com curso "Introdução ao Mapa Astral" publicado
- Acesso admin à Kiwify

## Passo a Passo — Execução AIOS

### Passo 1: Verificar Estrutura Existente
**Responsável:** Fernando
**Ferramenta:** Kiwify Dashboard
Verificar o que já existe na Kiwify:
- Curso "Introdução ao Mapa Astral" já publicado
- Verificar módulos e aulas existentes
- Identificar o que falta subir

### Passo 2: Organizar Módulos
**Responsável:** Fernando + Gabriel
**Ferramenta:** Kiwify Dashboard
Estruturar os módulos na ordem correta:
- Módulo 1: [título] — X aulas
- Módulo 2: [título] — X aulas
- ... (conforme conteúdo aprovado)

### Passo 3: Upload de Aulas
**Responsável:** Gabriel
**Ferramenta:** Kiwify Dashboard
Para cada aula:
- Upload do vídeo editado
- Adicionar título e descrição
- Adicionar thumbnail
- Anexar materiais complementares (PDFs)
- Configurar liberação (sequencial ou livre)

### Passo 4: Configurar Área de Membros
**Responsável:** Fernando
**Ferramenta:** Kiwify Dashboard
- Design da área de membros (logo, cores)
- Mensagem de boas-vindas
- Configurar e-mail automático de acesso
- Testar experiência do aluno

### Passo 5: Preview e Teste
**Responsável:** Fernando
**Ferramenta:** Kiwify (modo preview)
- Assistir pelo menos 1 aula como aluno
- Verificar que materiais estão acessíveis
- Testar em mobile
- Confirmar sequência de módulos

## Referências
- Kiwify docs: https://ajuda.kiwify.com.br/
- Conteúdo aprovado: task #11

## Responsáveis
- **Execução:** Fernando + Gabriel
- **Aprovação:** Fernando

## Sprint Points: 3 | Épico: Kiwify | Sprint: 1`
  },
  {
    id: '86afp0ruj',
    name: '#13 Configurar produto Kiwify (preço + checkout)',
    description: `## Contexto no Funil
O produto Kiwify é a configuração comercial do curso — preço, checkout, gateway de pagamento, página de obrigado. As URLs de checkout geradas aqui serão usadas nos botões CTA das LPs e no ManyChat.

## Dados da Oferta
- **Curso Solo:** R$147 (12x R$14,23)
- **Pacote Completo:** R$297 (12x R$28,76) — curso + Camarim Anual
- **Checkout:** Kiwify (URLs PLACEHOLDER atuais → gerar URLs reais aqui)

## Objetivo
Configurar o produto na Kiwify com preços, formas de pagamento e gerar as URLs reais de checkout.

## Pré-requisitos
- [x] Curso criado na Kiwify (#12)
- [x] Conta Kiwify ativa
- Preços definidos (R$147 solo / R$297 pacote)

## Passo a Passo — Execução AIOS

### Passo 1: Criar/Editar Produto "Curso Solo"
**Responsável:** Fernando
**Ferramenta:** Kiwify Dashboard
- Nome: "Introdução ao Mapa Astral"
- Preço: R$147,00
- Parcelamento: até 12x de R$14,23
- Garantia: 7 dias (padrão Kiwify)
- Copiar URL de checkout gerada

### Passo 2: Criar Produto "Pacote Completo"
**Responsável:** Fernando
**Ferramenta:** Kiwify Dashboard
- Nome: "Pacote Mapa Astral + Camarim Sideral Anual"
- Preço: R$297,00
- Parcelamento: até 12x de R$28,76
- Inclui: curso + acesso Camarim 1 ano
- Garantia: 7 dias
- Copiar URL de checkout gerada

### Passo 3: Configurar Página de Obrigado
**Responsável:** Fernando
**Ferramenta:** Kiwify Dashboard
- Mensagem de boas-vindas
- Instruções de acesso ao curso
- Link para área de membros
- Pixel de conversão (Purchase event)

### Passo 4: Configurar E-mail de Boas-Vindas
**Responsável:** Fernando
**Ferramenta:** Kiwify Dashboard
- E-mail automático pós-compra
- Conteúdo: boas-vindas + link de acesso + instruções
- Tom alinhado com brand DNA da Película

### Passo 5: Documentar URLs de Checkout
**Responsável:** Fernando
**Ferramenta:** ClickUp / Docs
Salvar as URLs reais geradas:
- URL Checkout Curso Solo: pay.kiwify.com.br/[ID-REAL-CURSO]
- URL Checkout Pacote: pay.kiwify.com.br/[ID-REAL-PACOTE]
Estas URLs serão usadas na task #25 (atualizar LPs) e no ManyChat (#24).

### Passo 6: Teste de Compra
**Responsável:** Fernando
**Ferramenta:** Browser
- Usar cartão de teste (se disponível) ou compra real com reembolso
- Verificar que e-mail de acesso chega
- Verificar que área de membros abre corretamente

## Referências
- Estratégia de preços: docs/funil-spoiler-semanal.md
- LPs que usarão as URLs: task #5 (Decifrando) e task #16 (Camarim)
- ManyChat que usará as URLs: task #24

## Responsáveis
- **Execução:** Fernando
- **Aprovação:** Fernando (auto-aprova — configuração de produto)

## Sprint Points: 2 | Épico: Kiwify | Sprint: 1

**CRITICO:** As URLs de checkout geradas aqui são dependência para task #25 (atualizar LPs) e task #24 (ManyChat). Priorizar esta task.`
  },

  // ─── SPRINT 2: LP CAMARIM ───
  {
    id: '86afp0rzx',
    name: '#14 Escrever copy LP Camarim Sideral',
    description: `## Contexto no Funil
A LP Camarim vende a assinatura mensal/anual do "Camarim Sideral" — comunidade de astrologia da Película Sideral. Recebe tráfego do ManyChat (Caminho A) e do Linktree.

## Dados da Oferta
- **Produto:** Camarim Sideral (comunidade/assinatura)
- **Preço Mensal:** R$19/mês
- **Preço Anual:** R$297 à vista (12x R$31)
- **LP atual:** https://optimizeformobile.vercel.app/
- **Checkout:** Links atualmente quebrados (#)

## Objetivo
Escrever copy completa da LP Camarim seguindo brand DNA e estrutura de oferta.

## Pré-requisitos
- Brand DNA: kb/brand-dna/pelicula-sideral.md
- Entendimento da proposta do Camarim Sideral

## Passo a Passo — Execução AIOS

### Passo 1: Briefing
**Agente:** @analyst
**Ferramenta:** Read tool + WebFetch
Ler e analisar:
- kb/brand-dna/pelicula-sideral.md (proposta do Camarim)
- LP atual: https://optimizeformobile.vercel.app/ (estrutura existente)
- docs/funil-spoiler-semanal.md (posicionamento no funil)

### Passo 2: Definir Proposta de Valor do Camarim
**Responsável:** Fernando + Karol
Pontos a comunicar:
- O que é o Camarim Sideral (comunidade exclusiva)
- O que o assinante recebe (conteúdos semanais, interpretações detalhadas)
- Diferencial vs conteúdo gratuito do Instagram
- Por que assinar (exclusividade, profundidade, comunidade)

### Passo 3: Escrever Copy por Seção
**Responsável:** Karol (draft) + Fernando (revisão)
Seguir estrutura:
1. Hero: headline emocional + sub-headline + CTA
2. O que é o Camarim: explicação clara e acolhedora
3. O que você recebe: lista de benefícios com ícones
4. Depoimentos: prova social de assinantes
5. Oferta: Mensal R$19 / Anual R$297 (economia destacada)
6. FAQ: 5-8 perguntas
7. CTA final: urgência suave

### Passo 4: Revisão e Aprovação
**Fluxo:** Karol → Fernando (Level 3) → Victor (tom)

## Referências
- Brand DNA: kb/brand-dna/pelicula-sideral.md
- LP atual: https://optimizeformobile.vercel.app/
- Estratégia: docs/funil-spoiler-semanal.md

## Responsáveis
- **Execução:** Fernando + Karol
- **Aprovação:** Fernando (Level 3) + Victor

## Sprint Points: 3 | Épico: LP Camarim | Sprint: 2`
  },
  {
    id: '86afp0t28',
    name: '#15 Coletar referências estéticas LP Camarim',
    description: `## Contexto no Funil
Referências visuais para a LP Camarim. Deve manter coerência visual com a LP Decifrando mas ter identidade própria (mais "íntimo" e "exclusivo").

## Objetivo
Criar moodboard com referências visuais para a LP Camarim Sideral.

## Pré-requisitos
- Brand DNA: kb/brand-dna/pelicula-sideral.md
- Referências da LP Decifrando (#4) como base de coerência

## Passo a Passo — Execução AIOS

### Passo 1: Análise da LP Atual
**Agente:** @analyst
**Ferramenta:** WebFetch + Playwright
Analisar https://optimizeformobile.vercel.app/:
- Design atual e o que funciona
- O que precisa melhorar
- Estilo visual existente

### Passo 2: Pesquisa de Referências
**Responsável:** Gabriel
**Ferramenta:** Pinterest, Dribbble, Behance
Coletar 10-15 referências:
- 3-4 LPs de memberships/comunidades (benchmark)
- 3-4 paletas (tons mais quentes/íntimos que a LP Decifrando)
- 2-3 layouts de pricing (mensal vs anual)
- Referências de "exclusividade" visual

### Passo 3: Montar Moodboard
**Responsável:** Gabriel
**Ferramenta:** Figma ou Canva
- Paleta de cores (complementar à LP Decifrando)
- Tipografia (manter coerência)
- Layout mobile-first

### Passo 4: Aprovação
**Fluxo:** Gabriel → Fernando (Level 3)

## Referências
- Brand DNA: kb/brand-dna/pelicula-sideral.md
- LP atual: https://optimizeformobile.vercel.app/
- Referências LP Decifrando: task #4

## Responsáveis
- **Execução:** Gabriel
- **Aprovação:** Fernando (Level 3)

## Sprint Points: 2 | Épico: LP Camarim | Sprint: 2`
  },
  {
    id: '86afp0t5r',
    name: '#16 Criar página LP Camarim com @dev AIOS',
    description: `## Contexto no Funil
A LP Camarim é a página de vendas da assinatura "Camarim Sideral". Recebe tráfego do ManyChat (Caminho A — quem já sabe o ascendente) e do Linktree.

## Dados da Oferta
- **Produto:** Camarim Sideral (assinatura)
- **Mensal:** R$19/mês
- **Anual:** R$297 à vista (12x R$31) — destaque de economia
- **LP atual:** https://optimizeformobile.vercel.app/
- **Checkout:** Links quebrados (#) — precisam de URLs reais

## Objetivo
Desenvolver (ou refatorar) a LP Camarim usando @dev AIOS, com design responsivo, copy aprovada e checkout integrado.

## Pré-requisitos
- [x] Copy finalizada (#14)
- [x] Referências estéticas aprovadas (#15)
- [ ] URLs de checkout (Kiwify para anual, Substack para mensal)

## Passo a Passo — Execução AIOS

### Passo 1: Analisar LP Atual
**Agente:** @dev
**Ferramenta:** Read tool + Playwright
Acessar https://optimizeformobile.vercel.app/:
- Identificar framework e estrutura
- Mapear componentes existentes
- Identificar links quebrados (#)

### Passo 2: Preparar Ambiente
**Agente:** @dev
**Ferramenta:** Bash
- Clonar/acessar repositório
- Instalar dependências
- Rodar em dev local

### Passo 3: Implementar Seções
**Agente:** @dev (Gabriel + Fernando)
**Ferramenta:** Edit tool
Construir/refatorar seguindo copy (#14) e design (#15):
1. Hero: headline + CTA sticky
2. O que é o Camarim: explicação visual
3. Benefícios: grid/lista com ícones
4. Prova Social: depoimentos
5. Pricing: cards Mensal R$19 / Anual R$297
6. FAQ: accordion
7. Footer CTA

### Passo 4: Integrar Checkout
**Agente:** @dev
- Botão Mensal → checkout Substack ou link de pagamento
- Botão Anual → checkout Kiwify (URL da task #13)
- Se URLs não prontas, usar placeholder com TODO

### Passo 5: Performance + SEO
**Agente:** @dev
- Lighthouse > 90
- Meta tags + Open Graph
- Imagens otimizadas (WebP, lazy load)

## Referências
- Brand DNA: kb/brand-dna/pelicula-sideral.md
- LP atual: https://optimizeformobile.vercel.app/
- Estratégia: docs/funil-spoiler-semanal.md

## Responsáveis
- **Execução:** Gabriel (@dev) + Fernando
- **Aprovação:** Fernando (Level 3)

## Sprint Points: 5 | Épico: LP Camarim | Sprint: 2`
  },
  {
    id: '86afp0t8b',
    name: '#17 Instalar Pixels (Meta + X) na LP Camarim',
    description: `## Contexto no Funil
Mesma lógica da task #6, mas para a LP Camarim. Pixels permitem remarketing e atribuição de conversão para assinaturas.

## Objetivo
Instalar Meta Pixel e X Pixel na LP Camarim com eventos de conversão.

## Pré-requisitos
- [x] LP Camarim construída (#16)
- [x] Pixels já criados e configurados (Meta + X)

## Passo a Passo — Execução AIOS

### Passo 1: Instalar Meta Pixel
**Agente:** @dev
**Ferramenta:** Edit tool
- Script base no <head> (fbq init + PageView)
- Evento ViewContent na seção de oferta
- Evento InitiateCheckout nos botões CTA (mensal + anual)
- Evento Lead no scroll 75%

### Passo 2: Instalar X Pixel
**Agente:** @dev
**Ferramenta:** Edit tool
- Script base no <head>
- PageView + eventos de conversão

### Passo 3: Eventos Personalizados
**Agente:** @dev
Criar eventos:
- spoiler_camarim_view
- spoiler_click_mensal (R$19)
- spoiler_click_anual (R$297)

### Passo 4: Testar
**Agente:** @qa
**Ferramenta:** Meta Pixel Helper + X Pixel Helper
- Verificar disparos em cada ação
- Confirmar dados nos painéis

## Referências
- Referência: task #6 (mesma lógica para LP Decifrando)
- KPIs: docs/kpis-spoiler-semanal.md

## Responsáveis
- **Execução:** Fernando + Gabriel (@dev)
- **Aprovação:** Fernando

## Sprint Points: 2 | Épico: LP Camarim | Sprint: 2`
  },
  {
    id: '86afp0tb4',
    name: '#18 Publicar LP Camarim na Vercel + domínio',
    description: `## Contexto no Funil
Deploy da LP Camarim para produção. Mesmo fluxo da task #7 (LP Decifrando).

## Objetivo
Fazer deploy da LP Camarim na Vercel e conectar ao domínio personalizado.

## Pré-requisitos
- [x] LP Camarim construída (#16)
- [x] Pixels instalados (#17)
- [x] Cloudflare DNS configurado (#2)

## Passo a Passo — Execução AIOS

### Passo 1: Build e Preparação
**Agente:** @dev
**Ferramenta:** Bash
- npm run build (sem erros)
- Verificar variáveis de produção

### Passo 2: Deploy Vercel
**Agente:** @dev
**Ferramenta:** MCP Vercel / Bash (vercel cli)
- Deploy do projeto
- Verificar URL de preview
- Testar antes de promover

### Passo 3: Conectar Domínio
**Agente:** @dev
**Ferramenta:** Vercel + MCP Cloudflare
- Adicionar custom domain (ex: camarim.peliculasideral.com)
- Verificar CNAME no Cloudflare
- Aguardar propagação + SSL

### Passo 4: Validação
**Agente:** @qa
- Testar em produção
- Verificar responsividade
- Confirmar pixels em produção

## Referências
- Fluxo idêntico à task #7 (LP Decifrando)
- LP atual: https://optimizeformobile.vercel.app/

## Responsáveis
- **Execução:** Gabriel (@dev)
- **Aprovação:** Fernando

## Sprint Points: 2 | Épico: LP Camarim | Sprint: 2`
  },

  // ─── SPRINT 2: LINKTREE ───
  {
    id: '86afp0tjx',
    name: '#19 Criar wireframe Linktree Película Sideral',
    description: `## Contexto no Funil
O Linktree é o hub de links na bio do Instagram. Todos os links relevantes (LP Decifrando, LP Camarim, Substack, YouTube, etc.) ficam organizados aqui.

## Objetivo
Criar wireframe/layout do Linktree com todos os links do ecossistema Película Sideral.

## Pré-requisitos
- [x] LP Decifrando publicada (#7) — link para incluir
- LP Camarim publicada (#18) — link para incluir
- Brand DNA definido

## Passo a Passo — Execução AIOS

### Passo 1: Mapear Links Necessários
**Responsável:** Fernando + Gabriel
**Ferramenta:** Docs
Listar todos os links que devem constar:
1. LP Curso Decifrando (link principal — destaque)
2. LP Camarim Sideral (segundo destaque)
3. Substack newsletter
4. YouTube (se aplicável)
5. Aula da semana / Spoiler
6. Contato/WhatsApp
7. TikTok (se aplicável)

### Passo 2: Definir Hierarquia Visual
**Responsável:** Gabriel
**Ferramenta:** Figma / Canva
- Links prioritários no topo (LP Decifrando, Camarim)
- Cores e ícones alinhados com brand DNA
- Avatar e bio consistentes com Instagram
- Layout limpo e mobile-first

### Passo 3: Criar Wireframe
**Responsável:** Gabriel
**Ferramenta:** Figma
- Wireframe com todos os links posicionados
- Versão mobile (prioridade)
- Animações/transições (se custom Linktree)

### Passo 4: Aprovação
**Fluxo:** Gabriel → Fernando (Level 3)

## Referências
- Brand DNA: kb/brand-dna/pelicula-sideral.md
- Links das LPs: tasks #7 e #18

## Responsáveis
- **Execução:** Gabriel
- **Aprovação:** Fernando (Level 3)

## Sprint Points: 2 | Épico: Linktree | Sprint: 2`
  },
  {
    id: '86afp0tr2',
    name: '#20 Criar Linktree @dev (custom ou plataforma)',
    description: `## Contexto no Funil
O Linktree é o ponto de entrada via bio do Instagram. Pode ser feito na plataforma Linktree.com ou como página custom na Vercel.

## Objetivo
Implementar o Linktree da Película Sideral conforme wireframe aprovado.

## Pré-requisitos
- [x] Wireframe aprovado (#19)
- [x] LP Decifrando publicada (#7) — URL necessária
- [x] LP Camarim publicada (#18) — URL necessária

## Passo a Passo — Execução AIOS

### Opção A: Linktree.com (mais rápido)
**Agente:** Gabriel
**Ferramenta:** Linktree Dashboard
1. Criar conta ou acessar existente
2. Configurar avatar, bio e cores (brand DNA)
3. Adicionar cada link conforme wireframe (#19)
4. Configurar UTMs em cada link:
   - utm_source=instagram&utm_medium=bio&utm_campaign=spoiler-semanal&utm_content=link-bio
5. Ativar analytics do Linktree

### Opção B: Custom Page (mais controle)
**Agente:** @dev (Gabriel)
**Ferramenta:** HTML/CSS ou framework
1. Criar página estática seguindo wireframe
2. Links com UTM tracking
3. Design responsivo mobile-first
4. Slots para pixels de rastreamento

### Passo Final: Testar
**Agente:** @qa
- Todos os links abrem corretamente
- UTMs preservados
- Visual alinhado com brand DNA
- Tempo de carregamento < 2s

## Referências
- Wireframe: task #19
- UTM convention: docs/kpis-spoiler-semanal.md
- Brand DNA: kb/brand-dna/pelicula-sideral.md

## Responsáveis
- **Execução:** Gabriel (@dev)
- **Aprovação:** Fernando

## Sprint Points: 3 | Épico: Linktree | Sprint: 2`
  },
  {
    id: '86afp0tv1',
    name: '#21 Configurar Pixels + Publicar Linktree',
    description: `## Contexto no Funil
Publicar o Linktree em produção e adicionar pixels para rastrear cliques da bio do Instagram.

## Objetivo
Deploy do Linktree + instalação de pixels de rastreamento.

## Pré-requisitos
- [x] Linktree criado (#20)
- [x] Cloudflare (#2) — se custom domain

## Passo a Passo — Execução AIOS

### Passo 1: Instalar Pixels
**Agente:** @dev
**Ferramenta:** Linktree Dashboard ou Edit tool (se custom)
- Meta Pixel: PageView + evento por link clicado
- X Pixel: PageView
- Se Linktree.com: usar integração nativa de pixels

### Passo 2: Publicar
**Opção A (Linktree.com):** Já está publicado ao criar
**Opção B (Custom):**
- Deploy na Vercel
- Conectar domínio (ex: links.peliculasideral.com)
- Configurar CNAME no Cloudflare

### Passo 3: Configurar UTMs
**Agente:** @dev
Garantir que TODOS os links têm UTM:
- utm_source=instagram
- utm_medium=bio
- utm_campaign=spoiler-semanal
- utm_content=[identificador-do-link]

### Passo 4: Testar
**Agente:** @qa
- Todos os links funcionam
- Pixels disparam
- UTMs chegam no destino
- Mobile responsivo

## Referências
- UTM convention: docs/kpis-spoiler-semanal.md
- Linktree: task #20

## Responsáveis
- **Execução:** Fernando + Gabriel
- **Aprovação:** Fernando

## Sprint Points: 2 | Épico: Linktree | Sprint: 2`
  },
  {
    id: '86afp0ty9',
    name: '#22 Testar Linktree completo (QA)',
    description: `## Contexto no Funil
QA final do Linktree antes de colocar na bio do Instagram.

## Objetivo
Validar funcionamento completo do Linktree em todos os cenários.

## Pré-requisitos
- [x] Linktree publicado (#21)
- [x] Pixels configurados (#21)

## Passo a Passo — Execução AIOS

### Passo 1: Teste Funcional
**Agente:** @qa
**Ferramenta:** Playwright + teste manual
Para CADA link no Linktree:
- [ ] Link abre corretamente
- [ ] Destino está carregando (LP, Substack, etc.)
- [ ] UTM params estão na URL de destino
- [ ] Redirect não está quebrando UTMs

### Passo 2: Teste Visual
**Agente:** @qa
**Ferramenta:** Playwright (múltiplos viewports)
- [ ] Visual correto em iPhone (375px)
- [ ] Visual correto em Android (360px)
- [ ] Visual correto em iPad (768px)
- [ ] Visual correto em Desktop (1440px)
- [ ] Avatar e bio legíveis
- [ ] Cores alinhadas com brand DNA

### Passo 3: Teste de Pixels
**Agente:** @qa
**Ferramenta:** Meta Pixel Helper + X Pixel Helper
- [ ] Meta Pixel: PageView dispara
- [ ] Meta Pixel: eventos de click disparam
- [ ] X Pixel: PageView dispara
- [ ] Dados chegando nos painéis

### Passo 4: Teste de Performance
**Agente:** @qa
- [ ] Tempo de carregamento < 2s
- [ ] Sem erros no console
- [ ] Score Lighthouse > 85

### Passo 5: Relatório
**Ferramenta:** ClickUp comment
Postar resultado: PASS / FAIL + evidências

## Referências
- QA checklist: .aios-core/development/checklists/clickup-scrum-quality-gate.md
- Linktree: task #20 e #21

## Responsáveis
- **Execução:** Fernando (@qa)
- **Aprovação:** Fernando

## Sprint Points: 1 | Épico: Linktree | Sprint: 2`
  },

  // ─── SPRINT 2: MANYCHAT ───
  {
    id: '86afp0u29',
    name: '#23 Instalar MCP ManyChat no AIOS',
    description: `## Contexto no Funil
O ManyChat é o motor de automação do MEIO do funil. Toda interação via DM do Instagram é gerenciada pelo ManyChat. Instalar o MCP permite gerenciar o ManyChat pelo Claude Code.

## Objetivo
Instalar e configurar MCP Server do ManyChat no ecossistema AIOS.

## Pré-requisitos
- Conta ManyChat Pro ativa conectada ao Instagram @peliculasideral
- API Token do ManyChat
- Acesso ao .mcp.json

## Passo a Passo — Execução AIOS

### Passo 1: Pesquisar MCP ManyChat
**Agente:** @devops
**Ferramenta:** WebSearch + Context7
Buscar MCP server oficial ou community para ManyChat:
- Verificar se existe no catálogo de MCPs
- Se não existir, avaliar alternativa (API direta via n8n)
- Documentar opções encontradas

### Passo 2: Instalar MCP
**Agente:** @devops
**Ferramenta:** Bash
- Adicionar ao .mcp.json
- Configurar API token
- Testar conexão

### Passo 3: Mapear Ferramentas
**Agente:** @devops
**Ferramenta:** Claude Code MCP Tools
Verificar ferramentas disponíveis:
- Criar/editar flows
- Gerenciar subscribers
- Configurar keywords
- Gerenciar custom fields
- Enviar mensagens

### Passo 4: Teste de Integração
**Agente:** @qa
- Listar flows existentes
- Criar flow de teste
- Verificar que custom fields são acessíveis
- Deletar flow de teste

### Alternativa: Se MCP não existir
Se não houver MCP para ManyChat:
- Configurar via API REST direta
- Ou usar n8n como intermediário
- Documentar decisão no ClickUp

## Referências
- MCP governance: .claude/rules/mcp-usage.md
- ManyChat docs: docs/manychat-spoiler-semanal.md
- Catálogo MCP: buscar em NPM e GitHub

## Responsáveis
- **Execução:** Fernando + Gabriel (@devops)
- **Aprovação:** Fernando

## Sprint Points: 3 | Épico: ManyChat | Sprint: 2`
  },
  {
    id: '86afp0u6a',
    name: '#24 Criar funil ManyChat (2 caminhos + fallback)',
    description: `## Contexto no Funil
Esta é a task mais crítica e complexa do funil. O ManyChat é o motor de automação que transforma comentários/respostas de stories em conversões. Implementa 2 caminhos + fallback conforme docs/manychat-spoiler-semanal.md.

## Tema Semana 1 (01-08/03): Eclipse Lunar 03/03/2026

## Objetivo
Implementar o funil completo de automação ManyChat conforme documentação.

## Pré-requisitos
- [x] MCP ManyChat ou acesso à plataforma (#23)
- [x] LP Decifrando publicada (#7) — URL para Caminho B
- [x] LP Camarim publicada (#18) — URL para Caminho A
- [ ] Vídeo tutorial "descobrir ascendente" (#27) — para Caminho B
- [ ] 12 mini-interpretações Eclipse Lunar (#28) — para Caminho A

## Passo a Passo — Execução AIOS

### Passo 1: Configurar Custom Fields (13 campos)
**Agente:** @dev (Fernando)
**Ferramenta:** ManyChat Dashboard / MCP
Criar custom fields conforme docs/manychat-spoiler-semanal.md:
- tema_semana: "Eclipse Lunar 03/03"
- interp_aries, interp_touro, interp_gemeos, interp_cancer
- interp_leao, interp_virgem, interp_libra, interp_escorpiao
- interp_sagitario, interp_capricornio, interp_aquario, interp_peixes

### Passo 2: Configurar Tags (6 tags)
**Agente:** @dev
Tags de rastreamento:
- spoiler-comentou (gatilho inicial)
- spoiler-sabe-ascendente (Caminho A)
- spoiler-nao-sabe (Caminho B)
- spoiler-clicou-camarin (conversão Camarim)
- spoiler-clicou-curso (conversão Curso)
- spoiler-remarketing (disse "agora não")

### Passo 3: Configurar Keywords + Triggers
**Agente:** @dev
**Referência:** docs/manychat-spoiler-semanal.md
Detectar 12 signos + variações ortográficas:
- áries, aries, Áries, Aries
- touro, Touro
- gêmeos, gemeos, Gêmeos, Gemeos
- câncer, cancer, Cancer, Câncer
- leão, leao, Leão, Leao
- virgem, Virgem
- libra, Libra
- escorpião, escorpiao, Escorpião, Escorpiao
- sagitário, sagitario, Sagitário, Sagitario
- capricórnio, capricornio, Capricórnio, Capricornio
- aquário, aquario, Aquário, Aquario
- peixes, Peixes

Detectar "não sei":
- "não sei", "nao sei", "n sei", "nn sei", "não tenho certeza"

### Passo 4: Implementar Caminho A (sabe o ascendente)
**Agente:** @dev
**Referência:** docs/manychat-spoiler-semanal.md - Seção "Caminho A"
Fluxo:
1. Detecta signo → Tag: spoiler-sabe-ascendente
2. Mensagem imediata: interpretação personalizada usando interp_{signo}
3. Delay 30 segundos
4. Mensagem: "Toda semana aprofundo isso no Camarim Sideral..."
5a. Botão "Quero fazer parte" → Tag: spoiler-clicou-camarin → Link LP Camarim + UTM
5b. Botão "Agora não" → Tag: spoiler-remarketing

### Passo 5: Implementar Caminho B (não sabe o ascendente)
**Agente:** @dev
**Referência:** docs/manychat-spoiler-semanal.md - Seção "Caminho B"
Fluxo:
1. Detecta "não sei" → Tag: spoiler-nao-sabe
2. Mensagem de acolhimento + enviar vídeo tutorial (ou texto workaround)
3. Delay 2 minutos
4a. Botão "Descobri!" → Redirect para detector de signo (Caminho A)
5b. Botão "Quero aprender mais" → Tag: spoiler-clicou-curso → Link LP Decifrando + UTM

### Passo 6: Implementar Fallback
**Agente:** @dev
Fluxo para keywords não reconhecidas:
- "Não consegui identificar seu signo. Qual seu ascendente?"
- Redirect para keyword detector

### Passo 7: Configurar Pixel Events
**Agente:** @dev
Configurar ManyChat Pixel events:
- mc_caminho_a (entrou Caminho A)
- mc_caminho_b (entrou Caminho B)
- mc_clicou_camarin (clicou LP Camarim)
- mc_clicou_curso (clicou LP Decifrando)

### Passo 8: UTMs em todos os links
Garantir UTM em TODOS os links:
- LP Camarim: utm_source=manychat&utm_medium=dm&utm_campaign=spoiler-semanal&utm_content=caminho-a
- LP Decifrando: utm_source=manychat&utm_medium=dm&utm_campaign=spoiler-semanal&utm_content=caminho-b

## Referências
- Guia completo: docs/manychat-spoiler-semanal.md
- Estratégia: docs/funil-spoiler-semanal.md
- KPIs: docs/kpis-spoiler-semanal.md
- Semana piloto: docs/semana-piloto-spoiler.md

## Responsáveis
- **Execução:** Fernando (fluxo/copy) + Gabriel (técnico)
- **Aprovação:** Fernando

## Sprint Points: 10 | Épico: ManyChat | Sprint: 2

**NOTA DE COMPLEXIDADE:** Esta task foi reavaliada de 3 para 10 pontos. Considerar quebrar em subtasks (ver docs/analise-sprint-funil-perpetuo.md, seção 3.1).`
  }
];

// ============================================================
// API UPDATE FUNCTION
// ============================================================

async function updateTaskDescription(taskId, description) {
  const resp = await fetch(`${API}/task/${taskId}`, {
    method: 'PUT',
    headers: {
      'Authorization': TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ description })
  });

  const status = resp.status;
  let body = '';
  try {
    body = await resp.text();
  } catch (e) {}

  return { status, body };
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  console.log('=========================================');
  console.log(' UPDATE TASK DESCRIPTIONS — AIOS v1.0');
  console.log(` ${new Date().toISOString()}`);
  console.log(`=========================================`);
  console.log(`\n Total tasks: ${tasks.length}\n`);

  let success = 0;
  let fail = 0;

  for (const task of tasks) {
    const result = await updateTaskDescription(task.id, task.description);

    if (result.status === 200) {
      success++;
      console.log(`  [OK] ${task.name}`);
    } else {
      fail++;
      console.log(`  [FAIL] ${task.name} | HTTP ${result.status} | ${result.body.substring(0, 150)}`);
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('\n=========================================');
  console.log(` RESULTADO: ${success}/${tasks.length} OK | ${fail} FAIL`);
  console.log('=========================================');
}

main().catch(console.error);
