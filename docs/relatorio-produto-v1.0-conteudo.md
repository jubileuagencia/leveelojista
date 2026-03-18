# Levee Lojista — Relatório de Produto v1.0
# Conteúdo Estruturado para Montagem Visual

> **Uso:** Este documento contém todo o texto, estrutura e orientações de screenshot para a montagem do PDF visual do relatório de produto.
> **Formato de referência:** `relatorio 2.pdf` (v0.10)
> **Data:** Fevereiro 2026
> **Versão:** v1.0

---

## PÁGINA 1 — CAPA

**Elementos:**
- Logo: Maçã Levee (mesmo do relatório anterior)
- Badge de versão: `v1.0`
- Título: **Levee Lojista**
- Subtítulo: Plataforma de Vendas B2B para Hortifruti
- Data: Fevereiro 2026
- CTA: "Acessar Versão Web" (link para URL de produção Vercel)

---

## PÁGINA 2 — PASSO 1: Acesso Seguro

**Tag:** `PASSO 1`
**Título:** Acesso Seguro
**Descrição:** O lojista acessa a plataforma com e-mail e senha. Interface limpa com split-screen no desktop e formulário otimizado para mobile.

**Bullet points:**
- Login com credenciais seguras
- Cadastro self-service para novos clientes
- Recuperação de senha integrada
- Layout split-screen (branding + formulário)

**Screenshot:** Tela de Login (`/login`) — visão mobile mostrando o formulário de email e senha com botão "Entrar" e link "Cadastrar"

---

## PÁGINA 3 — PASSO 2: Cadastro Completo

**Tag:** `PASSO 2`
**Título:** Cadastro Completo
**Descrição:** Novos clientes se cadastram de forma autônoma em um fluxo multi-step. Dados comerciais, endereço com preenchimento automático por CEP, e ativação imediata.

**Bullet points:**
- Razão Social, CNPJ e Telefone
- E-mail e senha seguros
- Endereço com auto-preenchimento via CEP (ViaCEP)
- Processo 100% digital em menos de 2 minutos

**Screenshot:** Tela de Cadastro (`/cadastro`) — visão mobile mostrando o formulário com campos Razão Social, CNPJ, Telefone, Email, Senha e botão "Continuar"

---

## PÁGINA 4 — PASSO 3: Catálogo Completo

**Tag:** `PASSO 3`
**Título:** Catálogo Completo
**Descrição:** Após o login, o cliente tem acesso imediato ao catálogo organizado por categorias, com preços personalizados pelo seu nível de desconto.

**Bullet points:**
- Saudação personalizada com badge de nível (Bronze/Prata/Ouro)
- Barra de busca sempre visível
- Categorias visuais com ícones (Frutas, Legumes, Verduras, Raízes...)
- Seção "Recompra Rápida" com itens do último pedido
- Preços com desconto calculado automaticamente por nível

**Screenshot:** Tela Inicial (`/`) — visão mobile mostrando saudação, barra de busca, categorias horizontais e grid de produtos 2 colunas

---

## PÁGINA 5 — PASSO 4: Navegação por Categorias

**Tag:** `PASSO 4`
**Título:** Navegação por Categorias
**Descrição:** O catálogo é dividido em seções claras. O lojista encontra qualquer produto em segundos, mesmo com centenas de itens.

**Bullet points:**
- Filtro por categoria (Frutas, Verduras, Legumes, Orgânicos, Raízes...)
- Grid responsivo (2 colunas mobile, 4 colunas desktop)
- Preço original riscado + preço com desconto do nível
- Adicionar ao carrinho com 1 toque no botão "+"

**Screenshot:** Tela Inicial com filtro de categoria ativo — mostrando cards de produtos com imagem, nome, preço riscado, preço com desconto e botão "+"

---

## PÁGINA 6 — PASSO 5: Busca Inteligente

**Tag:** `PASSO 5`
**Título:** Busca Inteligente
**Descrição:** O lojista encontra qualquer produto rapidamente digitando o nome. Resultados aparecem em tempo real com debounce inteligente, sem precisar apertar "Enter".

**Bullet points:**
- Busca por nome em tempo real (debounced)
- Resultados instantâneos com contagem
- Filtro por categoria nos resultados
- Buscas recentes salvas localmente
- Adicionar ao carrinho direto dos resultados

**Screenshot:** Tela de Busca (`/busca`) — visão mobile com campo de busca preenchido, contagem de resultados e cards de produtos encontrados

---

## PÁGINA 7 — PASSO 6: Detalhe do Produto

**Tag:** `PASSO 6`
**Título:** Detalhe do Produto
**Descrição:** Ao tocar em qualquer produto, uma página de detalhes exibe informações completas com foto ampliada, preços por nível, e ação direta de compra.

**Bullet points:**
- Foto ampliada do produto
- Nome, descrição, unidade e categoria
- Preço original e preço com desconto do nível
- Seletor de quantidade (+/-)
- Botão fixo "Adicionar à Sacola" com valor total
- Favoritar com um toque

**Screenshot:** Tela de Detalhe (`/produto/:id`) — visão mobile mostrando foto grande, nome, preço, descrição, seletor de quantidade e botão CTA fixo no rodapé

---

## PÁGINA 8 — PASSO 7: Favoritos & Recompra

**Tag:** `PASSO 7`
**Título:** Favoritos & Recompra
**Descrição:** Itens comprados com frequência podem ser salvos nos favoritos. Ideal para restaurantes e lojistas que pedem os mesmos ingredientes toda semana.

**Bullet points:**
- Lista personalizada por cliente
- Acesso rápido para pedidos recorrentes
- Adicionar ao carrinho direto dos favoritos
- Sincronizado na nuvem (funciona em qualquer dispositivo)

**Screenshot:** Tela de Favoritos (`/favoritos`) — visão mobile mostrando lista de produtos favoritados com imagem, nome, preço e botão "+" para adicionar ao carrinho

---

## PÁGINA 9 — PASSO 8: Carrinho Inteligente

**Tag:** `PASSO 8`
**Título:** Carrinho Inteligente
**Descrição:** O carrinho persiste entre sessões e sincroniza na nuvem. O lojista pode montar pedidos ao longo do dia e finalizar quando quiser, de qualquer dispositivo.

**Bullet points:**
- Ajustar quantidades com botões +/−
- Remover itens individualmente
- Desconto do nível calculado automaticamente
- Resumo: Subtotal, Desconto, Taxa de Entrega, Total
- Sincronizado na nuvem (multi-dispositivo)

**Screenshot:** Tela do Carrinho (`/carrinho`) — visão mobile mostrando item com controle de quantidade, resumo do pedido (subtotal, desconto, taxa, total) e botão "Finalizar Pedido"

---

## PÁGINA 10 — PASSO 9: Checkout Step-by-Step

**Tag:** `PASSO 9`
**Título:** Checkout Guiado
**Descrição:** O processo de compra é guiado com um wizard de 4 etapas visuais. Simples, sem confusão, sem formulários gigantes.

**Bullet points:**
- **Etapa 1:** Escolher endereço de entrega (com CEP auto-preenchimento)
- **Etapa 2:** Forma de pagamento (PIX ou Boleto)
- **Etapa 3:** Revisão completa do pedido
- **Etapa 4:** Confirmação e número do pedido

**Screenshot:** Tela de Checkout (`/checkout`) — visão mobile mostrando o indicador de 4 etapas no topo e a Etapa 1 (seleção de endereço) com cards de endereços e botão "Continuar para Pagamento"

---

## PÁGINA 11 — PASSO 10: Acompanhamento de Pedidos

**Tag:** `PASSO 10`
**Título:** Acompanhamento de Pedidos
**Descrição:** Histórico completo de compras com status em tempo real. O lojista sabe exatamente onde está cada pedido, com timeline visual de 5 etapas.

**Bullet points:**
- Histórico completo com filtros (Todos / Em andamento / Entregues)
- Status visual com timeline: Pendente → Aprovado → Separação → Enviado → Entregue
- Detalhes de cada pedido (itens, preços, endereço, pagamento)
- Paginação "Carregar mais"

**Screenshot:** Tela de Pedidos (`/pedidos`) — visão mobile mostrando lista de pedidos com cards (empresa, status badge, itens, "Ver detalhes")

---

## PÁGINA 12 — PASSO 11: Detalhes do Pedido

**Tag:** `PASSO 11`
**Título:** Detalhes do Pedido
**Descrição:** Cada pedido tem uma página dedicada com todas as informações: timeline de status, lista de itens, endereço de entrega, método de pagamento e resumo financeiro.

**Bullet points:**
- Número do pedido e status atual
- Timeline visual com 5 etapas e timestamps
- Lista completa de itens com quantidades e preços
- Endereço de entrega e forma de pagamento
- Resumo financeiro (subtotal, desconto, total)

**Screenshot:** Tela de Detalhes do Pedido (`/pedido/:id`) — visão mobile mostrando status badge, timeline, lista de itens e resumo

---

## PÁGINA 13 — GESTÃO: Painel Administrativo

**Tag:** `GESTAO`
**Título:** Painel Administrativo
**Descrição:** Dashboard exclusivo para gestores com visão 360° do negócio. Métricas em tempo real, gráficos de performance e pedidos recentes — tudo acessível pelo celular.

**Bullet points:**
- 4 cards de métricas: Total de Pedidos, Pedidos Hoje, Total de Clientes, Receita do Mês
- Gráfico de pedidos por status (barras/linhas)
- Tabela de pedidos recentes (últimos 10)
- Acesso restrito (apenas administradores)

**Screenshot:** Tela Admin Dashboard (`/admin`) — visão mobile mostrando cards de métricas e início do gráfico

---

## PÁGINA 14 — GESTÃO: Produtos

**Tag:** `GESTAO`
**Título:** Gestão de Produtos
**Descrição:** Interface completa para gerenciar o catálogo. Busca, filtros, edição em massa e upload de imagens — tudo funciona 100% no celular.

**Bullet points:**
- Busca por nome ou ID do produto
- Filtros por categoria e status (ativo/inativo)
- Criar, editar e excluir produtos (soft-delete)
- Upload de imagem (Supabase Storage)
- Ações em massa: ativar, desativar ou excluir vários

**Screenshot:** Tela Admin Produtos (`/admin/produtos`) — visão mobile mostrando lista de produtos com ID, nome e botão "Detalhes"

---

## PÁGINA 15 — GESTÃO: Pedidos

**Tag:** `GESTAO`
**Título:** Gestão de Pedidos
**Descrição:** Controle total dos pedidos recebidos. Busca avançada por número, empresa ou CNPJ, com atualização de status individual ou em massa.

**Bullet points:**
- Busca avançada (número do pedido, nome da empresa, CNPJ)
- Filtro por status com chips visuais (multi-seleção)
- Alterar status individual via modal de detalhes
- Ações em massa com confirmação (AlertDialog)
- Paginação otimizada

**Screenshot:** Tela Admin Pedidos (`/admin/pedidos`) — visão mobile mostrando filtros de status e lista de pedidos com badges coloridos

---

## PÁGINA 16 — GESTÃO: Clientes

**Tag:** `GESTAO`
**Título:** Gestão de Clientes
**Descrição:** Visão completa de todos os clientes cadastrados. Gerencie níveis de desconto, papéis de acesso e dados cadastrais com interface responsiva.

**Bullet points:**
- Busca por nome, email ou CNPJ
- Filtros por nível (Bronze/Prata/Ouro) e papel (Cliente/Admin)
- Editar nível de desconto e papel de acesso
- Gestão de endereços do cliente
- Alteração de email (apenas super_admin)

**Screenshot:** Tela Admin Clientes (`/admin/clientes`) — visão mobile mostrando lista de clientes com badges de nível e papel

---

## PÁGINA 17 — GESTÃO: Categorias & Configurações

**Tag:** `GESTAO`
**Título:** Categorias & Configurações
**Descrição:** Organize o catálogo com categorias personalizáveis e configure os descontos por nível de cliente. Tudo em interfaces simples e diretas.

**Bullet points (Categorias):**
- Criar, editar e excluir categorias
- Reordenar com setas (↑/↓)
- Cor e emoji personalizáveis

**Bullet points (Configurações):**
- Definir % de desconto por nível (Bronze, Prata, Ouro)
- Validação automática (Bronze < Prata < Ouro)
- Salvar com feedback visual

**Screenshot:** Duas capturas lado a lado — Categorias (`/admin/categorias`) e Configurações (`/admin/configuracoes`)

---

## PÁGINA 18 — RESUMO DO PRODUTO

**Título:** Resumo do Produto

**Métricas principais (3 cards):**

| Métrica | Valor |
|---------|-------|
| Telas Funcionais | **22** |
| Telas Admin | **6** |
| Níveis de Preço | **3** |

**Tech tags (badges):**
- React 19
- TypeScript
- Supabase
- 100% Responsivo
- Segurança Server-Side (RLS + RPCs)
- Vite 7
- Tailwind 4
- shadcn/ui
- Deploy Vercel

---

## NOTAS PARA MONTAGEM VISUAL

### Estilo Visual (referência: relatório 2.pdf)
- **Capa:** Gradiente verde (#22c55e → #16a34a), texto branco centralizado
- **Páginas de passos:** Layout 2 colunas — mockup celular à esquerda, texto à direita
- **Páginas de gestão:** Mesmo layout, tag "GESTAO" ao invés de "PASSO N"
- **Resumo:** Fundo branco, cards com bordas sutis, métricas em verde (#22c55e)
- **Tipografia:** Sans-serif moderna (Inter ou equivalente)
- **Ícones nos bullets:** Ícones estilizados em caixas arredondadas com fundo verde claro (#dcfce7)

### Screenshots Necessários (18 capturas)
1. `/login` — mobile
2. `/cadastro` — mobile
3. `/` (home) — mobile
4. `/` com filtro de categoria — mobile
5. `/busca` com resultado — mobile
6. `/produto/:id` — mobile
7. `/favoritos` — mobile
8. `/carrinho` — mobile
9. `/checkout` (etapa 1) — mobile
10. `/pedidos` — mobile
11. `/pedido/:id` — mobile
12. `/admin` (dashboard) — mobile
13. `/admin/produtos` — mobile
14. `/admin/pedidos` — mobile
15. `/admin/clientes` — mobile
16. `/admin/categorias` — mobile
17. `/admin/configuracoes` — mobile
18. (opcional) Desktop view de qualquer tela para contraste

### Diferenças vs Relatório v0.10
| Aspecto | v0.10 (relatório 2.pdf) | v1.0 (este relatório) |
|---------|------------------------|----------------------|
| Telas cliente | ~10 passos | 11 passos (+ detalhe do pedido) |
| Telas admin | 2 (painel + produtos) | 6 (dashboard, produtos, pedidos, clientes, categorias, config) |
| Total páginas PDF | 14 | 18 |
| Tech stack | React 19, Supabase | + TypeScript, Vite 7, Tailwind 4, shadcn/ui, Vercel |
| Métricas resumo | 14 telas / 4 admin / 3 níveis | 22 telas / 6 admin / 3 níveis |

---

*Documento gerado por Morgan (PM) — Synkra AIOS*
*Data: 2026-02-27*
