# 📜 Changelog

Todos as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.4] - 2026-02-20
### 🚀 Added (Admin Orders & UX)

#### 📦 Gestão de Pedidos (Admin Orders)
*   **Painel Completo**:
    *   Listagem paginada de todos os pedidos da plataforma.
    *   **Friendly ID**: Pedidos agora usam numeração sequencial (ex: #1006) em vez de UUIDs longos visíveis aos usuários e painéis.
    *   Visualização de Detalhes (Modal moderno com itens, valores, cliente e endereço).
*   **Ações em Massa (Bulk Actions)**:
    *   Seleção múltipla de pedidos via Checkboxes.
    *   Floating Action Bar na parte inferior para alteração rápida de Status em dezenas de pedidos de uma vez.
*   **Busca Universal (Smart Search)**:
    *   Campo único inteligente que identifica e roteia a busca automaticamente por: Número do Pedido (#ID), Nome da Empresa ou parte do CNPJ.

#### 🖥️ UX & Layout
*   **Sidebar Responsiva**:
    *   Ajuste do breakpoint de mobile/tablet para 1024px.
    *   Colapso Total no Desktop: Novo botão interno (`<`) para recolher o painel lateral e maximizar o espaço de trabalho em telas grandes, com botão "Hambúrguer" flutuante de restauração.

### 🔒 Fixed (Security & RLS)
*   **Correção de RLS (Super Admin)**:
    *   *Bugfix crítico*: Políticas do Supabase bloqueavam silenciosamente a edição de Pedidos, Produtos e Clientes por contas baseadas em `super_admin`.
    *   Execução das Migrations Integradas (024, 025, 026, 027) para garantir permissões de `UPDATE`/`INSERT`/`DELETE` híbridas ao painel de gestão.
*   **CSP para Supabase Realtime**:
    *   *Bugfix*: Adicionado `wss://` à diretiva `connectSrc` no `server.js` (capacitando o capacete - helmet) para evitar bloqueios de conexão WebSocket do Supabase Realtime em produção.
*   **Erros 406 (Not Acceptable) Evitados**:
    *   Eliminação do Erro `406` e `Cannot Coerce` nas Modais ao salvar entidades. O frontend agora atua via Estado Otimista, não dependendo de ecos estritos/incondicionais da API PostgREST que conflitam com views protegidas.

---

## [v0.3] - 2026-02-18

#### 👥 Gestão de Clientes (Admin Clients)
*   **CRUD Completo**:
    *   Listagem paginada com busca inteligente (Nome, Email, CNPJ).
    *   Edição de Perfil (Role, Tier, Dados Cadastrais) e Endereços.
    *   **Filtros Avançados**: Multi-seleção por Nível (Bronze/Prata/Ouro) e Tipo (Cliente/Admin).
*   **Super Admin**:
    *   Proteção hierárquica: Apenas Super Admins podem promover outros Admins.
    *   Badge visual distintivo na listagem.
*   **UX Premium**:
    *   **Feedback Inline**: Substituição de `alert()` por mensagens de status não-intrusivas.
    *   **Performance**: Componentes extraídos (`MultiSelectFilter`, `TierBadge`) para evitar re-renders.

#### 🔒 Segurança (Phase 10)
*   **Secure RPCs**:
    *   `get_admin_clients`: Função segura para listar usuários (sem expor hash de senha).
    *   `update_admin_user_email`: Função restrita para troca de emails.
*   **Input Sanitization**: Limpeza automática de caracteres não-numéricos em buscas de CPF/CNPJ.

### 🔧 Changed
*   **Refatoração CSS**: Centralização de estilos e criação de `src/pages/admin/components` para melhor organização.

---

## [v0.2] - 2026-02-14
### 🚀 Added (Admin & Integrações)

#### 📊 Gestão de Produtos (Admin Products)
*   **Busca & Filtros**:
    *   Barra de busca em tempo real (Nome/ID).
    *   Filtros de status (Ativo/Inativo/Todos).
    *   Filtro de Baixo Estoque.
*   **Ações em Massa (Bulk Actions)**:
    *   Seleção múltipla de produtos via Checkbox.
    *   Barra de ações flutuante (Ativar, Desativar, Excluir selecionados).
    *   **Mobile Support**: Header específico para mobile com "Selecionar Todos".

#### 📈 Integração Google Sheets (v2.2)
*   **Sincronização Bidirecional**: Script Google Apps Script robusto para conectar Planilha <-> Supabase.
*   **Multi-Abas**:
    *   `Preços`: Aba de edição massiva (Nome, Preço, Categoria, Descrição, Status).
    *   `Cadastro`: Aba de criação de novos produtos.
*   **UX Avançada na Planilha**:
    *   **Dropdowns Automáticos**: Categorias, Unidades e Status já vêm validados do banco.
    *   **Validação de Dados**: Proteção contra IDs inválidos, preços errados e categorias inexistentes.
*   **Correções de Schema**: Remoção de colunas legadas (`cost_price`, `stock_quantity`) e suporte a `unit` e `description`.

---

## [v0.10] - 2026-02-13
### 🚀 Added (Novidades)

#### 🔒 Segurança do Servidor (Phase 9)
*   **Endereço Principal Atômico**: Criada função no banco de dados (`set_main_address`) que garante que só existe 1 endereço "principal" por usuário. Antes, se houvesse uma falha no meio da troca, o sistema poderia ficar com 0 ou 2 endereços marcados como principal.
*   **Validação de Preço no Servidor**: Criada função no banco (`create_order_validated`) que recalcula o preço dos produtos no momento da compra, usando os preços reais do catálogo. Isso impede que alguém manipule preços pelo navegador.
*   **Proteção de Produtos (RLS)**: Agora apenas administradores podem criar, editar ou excluir produtos. Clientes comuns só conseguem visualizar.
*   **Arquivo SQL de migração**: `supabase/migrations/009_security_hardening.sql` com todo o SQL necessário.

#### 📄 Documentação
*   **Schema atualizado** (`.agent/rules/schema.md` → v0.09): Adicionadas as tabelas `cart_items` (carrinho) e `favorites` (favoritos) que estavam faltando na documentação.

### 🔧 Changed (Melhorias de Código)

#### 🎨 CSS Modules — Estilos Organizados (Phase 7)
*   **O que mudou**: Antes, muitos componentes usavam estilos escritos direto no código JavaScript (ex: `style={{ color: 'red' }}`). Agora, todos os estilos ficam em arquivos `.module.css` separados, que é a forma recomendada pelo React.
*   **Por que importa**: Facilita manutenção. Se precisar mudar uma cor, basta ir no arquivo CSS ao invés de procurar no meio do JavaScript.
*   **Componentes migrados**:
    *   `CartItem` e `CartSummary` — Itens e resumo do carrinho
    *   `FavoritesPage` — Página de favoritos
    *   `AdminProducts`, `AdminDashboard`, `AdminRoute` — Páginas do admin
    *   `AdminProductTable` — Tabela de produtos (limpeza de estilos restantes)
    *   `PromoBanner`, `CategorySection` — Componentes da home
    *   `Header` — Cabeçalho do site

#### 🎨 Cores Padronizadas (Phase 7h — Hex Sweep)
*   **O que mudou**: Antes, as cores estavam escritas como códigos hexadecimais repetidos em dezenas de arquivos (ex: `#111827`, `#6B7280`). Agora, todas usam variáveis CSS centralizadas (ex: `var(--text-primary)`).
*   **Novas variáveis criadas** no `index.css`:
    *   `--text-muted` — Texto cinza claro (informações secundárias)
    *   `--border-color` — Cor das bordas
    *   `--bg-secondary` — Fundo cinza de cards e áreas
    *   `--danger-color` — Vermelho para erros e exclusões
*   **~120+ substituições** em todos os arquivos de estilo.

#### ⚡ Services Atualizados (Phase 9)
*   `address.js` — Agora usa a função segura do banco para trocar endereço principal. Se a função não existir ainda, funciona do jeito antigo (fallback automático).
*   `orders.js` — Agora tenta validar preços no servidor antes de criar o pedido. Se a função não existir, funciona do jeito antigo.

---

## [v0.09] - 2026-02-10
### 🚀 Added (Admin Products)
*   **Database Schema**:
    *   `is_active` (boolean, default true) na tabela `products`.
    *   `display_id` (int, auto-inc) na tabela `products`.
    *   Atualização de RLS Policies para permitir gestão de produtos por Admins.
*   **Admin Architecture**:
    *   Scaffolding das páginas de Admin (`AdminProducts`, `AdminOrders`, etc).
    *   Preparação para CRUD de produtos.
*   **UI Implementation**:
    *   Tabela de Produtos com design responsivo (Desktop Table / Mobile Cards).
    *   Integração com `getAdminProducts` para listagem completa.

---

## [v0.08] - 2026-02-07
### 🚀 Added (Admin & Segurança)
*   **Controle de Acesso (RBAC)**:
    *   Implementação de níveis de acesso (`role`) no banco de dados (`profiles`).
    *   Criação de Rotas Protegidas (`AdminRoute.jsx`) que redirecionam não-admins.
    *   Painel Administrativo Básico (`AdminDashboard.jsx`).
*   **Regras de Engenharia (`senior_mindset.md`)**:
    *   Nova diretriz de "Senior Programmer" focada em Diagnóstico, Idempotência e Visão Sistêmica.

### 🔧 Fixed (Correções Críticas)
*   **Erro 500 no Cadastro (Registration Flow)**:
    *   **Diagnóstico**: Identificadas colunas faltantes (`company_name`, `role`, `tier`) na tabela `profiles`.
    *   **Solução**: Script de reparo estrutural (`repair_full_schema.sql`) e endurecimento do Trigger `handle_new_user`.
*   **Recursão Infinita (RLS Policy)**:
    *   Correção do erro `42P17` nas políticas de segurança.
    *   Implementação da função `is_admin()` com `SECURITY DEFINER` para quebrar o loop de verificação de permissões.

### 🐛 Fixed (Outros)
*   **AuthContext**:
    *   Correção de `ReferenceError: profile is not defined`.
    *   Melhoria na lógica de `getProfile` para evitar estados inconsistentes.

---

## [v0.08] - 2026-02-06
### 🚀 Added (Funcionalidades)

#### 🛍️ Checkout & Pedidos
*   **Fluxo de Checkout Completo**: Implementado wizard de 4 passos (`CheckoutPage`):
    *   1. Seleção/Criação de Endereço (`StepAddress`).
    *   2. Pagamento (Pix/Boleto) (`StepPayment`).
    *   3. Revisão de Valores e Itens (`StepReview`).
    *   4. Sucesso com Mock de QR Code (`StepSuccess`).
*   **Histórico de Pedidos (`/pedidos`)**:
    *   Nova página listando compras anteriores.
    *   **OrderCard**: Componente visual com status colorido (ex: "Em Separação", "Entregue").
    *   Integração com Menu Inferior (Novo ícone "Pedidos").
*   **Detalhes do Pedido (`/pedido/:id`)**: Página dedicada com lista de itens, endereço de entrega e resumo financeiro.

#### 🗄️ Backend & Dados
*   **Novas Tabelas**: `orders`, `order_items`, `user_addresses`.
*   **Novos Status**: Enum `order_status` expandido com `preparing`, `shipped`, `delivered`.
*   **Otimização**: Implementada função `clearCartDB` para limpar carrinho com 1 única query (redução de N+1).

### 🐛 Fixed
*   **Redirect Loop**: Correção na lógica de "Carrinho Vazio" que impedia visualizar a tela de sucesso.
*   **Inline Styles**: Remoção de estilos hardcoded em `StepSuccess` (QR Code).

### ⭐ Documentation & Process
*   **Log de Correções (`FIXES.md`)**: Documento criado na raiz para centralizar débitos técnicos.
*   **Regras de Git e Segurança**: Incorporação oficial do Workflow de Git em `developmentguidelines.md`.

---

## [v0.07] - 2026-02-06
### ⭐ Added (Governança)
*   **Regras do Projeto (`.agent/rules/`)**: Oficialização dos arquivos de `bestpractices`, `designsystem`, `developmentguidelines` e `projectconcept` no controle de versão.
*   **Workflow de Git (`git_workflow.md`)**: Definição do processo obrigatório de backup (branch de versão) antes de deploys na main.
*   **Log de Débitos (`fixes.md`)**: Arquivo para registrar violações não-bloqueantes para correção futura.
*   **Auditoria de Conformidade (`compliance_audit.md`)**: Relatório inicial de adesão às novas regras.

### 🔧 Fixed
*   **Security Patch**: Remoção do arquivo `run_migration.cjs` do rastreamento do Git (continha token exposto).
*   Correção do `.gitignore` para permitir o versionamento da pasta `.agent/rules`.

---
## [v0.06] - Anterior
*   Versão estável anterior (Snapshot).
