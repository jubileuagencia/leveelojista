# Relatório de Auditoria UX — novob2b

> **Auditora:** Uma (UX Design Expert / AIOS)
> **Data:** 2026-02-26
> **Escopo:** App completo (Customer + Admin)
> **Metodologia:** Heurísticas de Nielsen + WCAG 2.1 AA + Mobile-First

---

## Sumário Executivo

| Área | Crítico | Importante | Menor | Total |
|------|---------|------------|-------|-------|
| Customer-side | 8 | 18 | 16 | 42 |
| Admin-side | 8 | 24 | 26 | 58 |
| **TOTAL** | **16** | **42** | **42** | **100** |

**Pontos Fortes:**
- Skeleton loading bem implementado nos componentes principais
- Responsividade excelente (cards mobile + tabelas desktop)
- Validação Zod robusta nos formulários
- Bulk actions bem estruturadas no admin
- Adaptação Sheet (mobile) / Dialog (desktop) consistente

**Pontos Fracos:**
- Acessibilidade (aria-labels ausentes, touch targets < 44px)
- Falta de feedback visual em operações assíncronas
- Validações insuficientes (preço negativo, email inválido, tier ordering)
- Sem recuperação de erros (retry buttons ausentes)
- Sem confirmações em ações destrutivas (bulk status, delete)

---

## PARTE 1 — Customer-Side

### Críticos (8)

| # | Problema | Arquivo | Heurística |
|---|----------|---------|------------|
| C1 | Sem feedback ao adicionar produto ao carrinho | `catalog/components/ProductCard.tsx:46-58` | H1 Visibilidade |
| C2 | Carrinho não limpa após logout (segurança) | `stores/cart-store.ts:22-30` | H5 Prevenção de erros |
| C3 | Produto 404 sem redirecionamento ou recovery | `catalog/pages/ProductPage.tsx:97-108` | H9 Recuperação de erros |
| C4 | Quantidade mínima 0 permitida no carrinho | `cart/pages/CartPage.tsx:249-267` | H5 Prevenção de erros |
| C5 | Checkout vazio redireciona sem feedback | `checkout/pages/CheckoutPage.tsx:24-28` | H1 Visibilidade |
| C6 | Botão "Carregar mais" não some quando acabam pedidos | `orders/pages/OrdersPage.tsx:77-81` | H1 Visibilidade |
| C7 | SearchPage não limpa URL ao limpar busca (back quebrado) | `search/pages/SearchPage.tsx:157-170` | H3 Controle do usuário |
| C8 | confirmPassword com autocomplete inseguro | `auth/components/RegisterForm.tsx:447-462` | H5 Prevenção de erros |

### Importantes (18)

| # | Problema | Arquivo | Heurística |
|---|----------|---------|------------|
| I1 | Imagens sem alt text descritivo | ProductCard, ProductPage | WCAG 1.1.1 |
| I2 | Botões de ícone sem aria-label | `layout/Header.tsx:115-123` | WCAG 4.1.2 |
| I3 | Contraste insuficiente em badges secondary | `catalog/components/ProductCard.tsx:137` | WCAG 1.4.3 |
| I4 | Step indicator < 44px (32px) | `checkout/components/StepIndicator.tsx:47-54` | WCAG 2.5.5 |
| I5 | Loading do carrinho muito discreto | `catalog/pages/HomePage.tsx:260-270` | H1 Visibilidade |
| I6 | Botão "Continuar" fixo cobre conteúdo no mobile | `cart/pages/CartPage.tsx:146-163` | H8 Estética |
| I7 | Toast sem duration definido (inconsistente) | Múltiplos | H4 Consistência |
| I8 | Dropdown usuário sem focus-visible | `layout/Header.tsx:184-251` | WCAG 2.4.7 |
| I9 | Endereço principal não auto-selecionado no checkout | `checkout/components/StepAddress.tsx:48-109` | H7 Eficiência |
| I10 | Busca mostra resultados antigos após limpar | `search/pages/SearchPage.tsx:90-119` | H4 Consistência |
| I11 | Skeleton sem transição suave (flash) | `catalog/pages/HomePage.tsx:209-214` | H8 Estética |
| I12 | Favoritar sem loading state (double-click) | `catalog/components/ProductCard.tsx:60-64` | H1 Visibilidade |
| I13 | Filtro de categoria persiste ao voltar pra home | `catalog/pages/HomePage.tsx:126-128` | H3 Controle |
| I14 | Header sticky sobrepõe SearchBar expandido | `layout/Header.tsx:270-285` | H8 Estética |
| I15 | CEP sem validação regex antes de fetch ViaCEP | `auth/components/RegisterForm.tsx:214-255` | H5 Prevenção |
| I16 | Badge carrinho sem transition-colors | `layout/Header.tsx:357-362` | H4 Consistência |
| I17 | Empty state favoritos sem instrução clara | `favorites/pages/FavoritesPage.tsx:64-79` | H6 Reconhecimento |
| I18 | navigate(-1) sem fallback em ProductPage | `catalog/pages/ProductPage.tsx:114-119` | H3 Controle |

### Menores (16)

| # | Problema | Arquivo |
|---|----------|---------|
| M1 | Quantidade negativa permitida via console | `stores/cart-store.ts:67-83` |
| M2 | Tabela carrinho muda layout sem transição | `cart/pages/CartPage.tsx:180-369` |
| M3 | Categoria truncada pode deixar `\|` sozinho | `catalog/components/ProductCard.tsx:131` |
| M4 | Debounce 300ms pode ser insuficiente | `catalog/pages/HomePage.tsx:118-120` |
| M5 | Double-submission possível no checkout | `checkout/components/StepReview.tsx:215-223` |
| M6 | Ícones pagamento muito pequenos mobile | `checkout/components/StepPayment.tsx:75-76` |
| M7 | Campos obrigatórios `*` sem legenda | `auth/components/RegisterForm.tsx:269-543` |
| M8 | Erro de servidor pode mostrar [object Object] | `auth/components/LoginForm.tsx:75-85` |
| M9 | Botão "Continuar" invisível com teclado mobile | `checkout/components/StepAddress.tsx:91-100` |
| M10 | ViaCEP sem retry button | `checkout/components/StepAddress.tsx:206-228` |
| M11 | Badges de desconto com estilos inconsistentes | ProductCard, CartPage |
| M12 | Busca sem AbortController (requests acumulam) | `search/pages/SearchPage.tsx:130-154` |
| M13 | Favoritar sem animação de feedback | ProductCard |
| M14 | Quantity selector com espaçamento assimétrico | `catalog/pages/ProductPage.tsx:251-281` |
| M15 | Imagens sem loading="lazy" | `catalog/components/ProductCard.tsx:109-119` |
| M16 | Badge "Principal" de endereço pouco visível | `checkout/components/StepAddress.tsx:162-170` |

---

## PARTE 2 — Admin-Side

### Críticos (8)

| # | Problema | Arquivo | Heurística |
|---|----------|---------|------------|
| AC1 | AdminLayout: loading sem contexto/timeout | `layout/AdminLayout.tsx:132-145` | H1 Visibilidade |
| AC2 | Dashboard: toast de erro sem retry button | `admin/pages/DashboardPage.tsx:12-13` | H9 Recuperação |
| AC3 | Produtos: preço negativo permitido no form | `admin/components/ProductFormModal.tsx:177-186` | H5 Prevenção |
| AC4 | Pedidos: bulk status sem confirmação | `admin/pages/OrdersPage.tsx:130-137` | H5 Prevenção |
| AC5 | Pedidos: status muda imediato sem confirmação | `admin/components/OrderDetailsModal.tsx:65-80` | H5 Prevenção |
| AC6 | Clientes: email salvo sem validação de formato | `admin/components/ClientDetailsModal.tsx:90-101` | H5 Prevenção |
| AC7 | Clientes: CEP buscado sem validar 8 dígitos | `admin/components/ClientDetailsModal.tsx:118-142` | H5 Prevenção |
| AC8 | Config: desconto Bronze > Gold permitido | `admin/pages/ConfigPage.tsx:26-35` | H5 Prevenção |

### Importantes (24)

| # | Problema | Arquivo | Heurística |
|---|----------|---------|------------|
| AI1 | Sidebar colapsada sem indicador de item ativo | `layout/AdminLayout.tsx:193-200` | H1 Visibilidade |
| AI2 | Navegação sem aria-label (sidebar ícones) | `layout/AdminLayout.tsx:164-190` | WCAG 4.1.2 |
| AI3 | Sem skip link para conteúdo principal | `layout/AdminLayout.tsx:246-420` | WCAG 2.4.1 |
| AI4 | MetricCard sem role/aria-label semântico | `admin/components/MetricCard.tsx:15,28` | WCAG 4.1.2 |
| AI5 | MetricCard: cor como único indicador | `admin/components/MetricCard.tsx:34` | WCAG 1.4.1 |
| AI6 | RecentOrdersTable: não responsiva mobile | `admin/components/RecentOrdersTable.tsx:42-47` | H8 Estética |
| AI7 | RecentOrdersTable: linha não clicável | `admin/components/RecentOrdersTable.tsx:62-72` | H7 Eficiência |
| AI8 | ProductsTable: checkbox e linha conflitam | `admin/components/ProductsTable.tsx:78-90` | H4 Consistência |
| AI9 | ProductsTable: seleção visual sutil (bg-emerald-50/50) | `admin/components/ProductsTable.tsx:75-76` | H1 Visibilidade |
| AI10 | ProductsTable: checkbox < 44px touch target | `admin/components/ProductsTable.tsx:87-91` | WCAG 2.5.5 |
| AI11 | ProductFormModal: sem loading no upload | `admin/components/ProductFormModal.tsx:149-154` | H1 Visibilidade |
| AI12 | ProductFormModal: submit habilitado durante upload | `admin/components/ProductFormModal.tsx:260-261` | H5 Prevenção |
| AI13 | ProductFormModal: sem scroll indicator mobile | `admin/components/ProductFormModal.tsx:286-294` | H6 Reconhecimento |
| AI14 | ProductFilters: search sem loading indicator | `admin/components/ProductFilters.tsx:39-44` | H1 Visibilidade |
| AI15 | OrdersPage: bulk status sem validar seleção | `admin/pages/OrdersPage.tsx:120-128` | H5 Prevenção |
| AI16 | OrderDetailsModal: sem histórico de status | `admin/components/OrderDetailsModal.tsx:61-81` | H6 Reconhecimento |
| AI17 | OrderFilters: chips sem focus-visible ring | `admin/components/OrderFilters.tsx:54-72` | WCAG 2.4.7 |
| AI18 | ClientDetailsModal: sem "definir como principal" | `admin/components/ClientDetailsModal.tsx:467-471` | H3 Controle |
| AI19 | ClientDetailsModal: tier/role sem descrição impacto | `admin/components/ClientDetailsModal.tsx:275-320` | H6 Reconhecimento |
| AI20 | ClientFilters: chips sem aria-pressed | `admin/components/ClientFilters.tsx:48-83` | WCAG 4.1.2 |
| AI21 | CategoriesPage: reorder sem undo/confirmação | `admin/pages/CategoriesPage.tsx:49-67` | H3 Controle |
| AI22 | CategoryFormModal: color picker dual-binding | `admin/components/CategoryFormModal.tsx:113-123` | H4 Consistência |
| AI23 | ConfigPage: sem feedback de mudanças pendentes | `admin/pages/ConfigPage.tsx:37-41` | H1 Visibilidade |
| AI24 | Badges (Tier/Role/Status): sem aria-label | TierBadge, RoleBadge, OrderStatusBadge | WCAG 4.1.2 |

### Menores (26)

| # | Problema | Arquivo |
|---|----------|---------|
| AM1 | AdminLayout: touch target pequeno botão colapsado | `AdminLayout.tsx:325-347` |
| AM2 | AdminLayout: logout sem confirmação | `AdminLayout.tsx:236` |
| AM3 | Dashboard: "..." ao invés de skeleton | `DashboardPage.tsx:25-32` |
| AM4 | Dashboard: MetricCard contraste ícone | `MetricCard.tsx:34` |
| AM5 | RecentOrdersTable: formatOrderNumber inconsistente | `RecentOrdersTable.tsx:63` |
| AM6 | ProductsTable: img sem loading="lazy" | `ProductsTable.tsx:97-101` |
| AM7 | ProductsTable: skeleton fixo 5 linhas | `ProductsTable.tsx:303-313` |
| AM8 | ProductFormModal: sem clear em Descrição | `ProductFormModal.tsx:223-231` |
| AM9 | ProductFilters: Select "Todas" value inconsistente | `ProductFilters.tsx:53` |
| AM10 | OrdersTable: status badge truncado mobile | `OrdersTable.tsx:64` |
| AM11 | OrdersTable: sem loading visual operações | `OrdersTable.tsx:139-150` |
| AM12 | OrderDetailsModal: sem copy-to-clipboard CNPJ | `OrderDetailsModal.tsx:91-95` |
| AM13 | OrderFilters: botão limpar sem animação | `OrderFilters.tsx:39-50` |
| AM14 | ClientsTable: email pode truncar sem "..." | `ClientsTable.tsx:48,90` |
| AM15 | ClientsTable: formatCNPJ variação | `ClientsTable.tsx:52-53` |
| AM16 | ClientDetailsModal: loader CEP sem texto | `ClientDetailsModal.tsx:369` |
| AM17 | CategoriesPage: total categorias sem número | `CategoriesPage.tsx:74-77` |
| AM18 | CategoriesTable: ícone/cor preview pequeno mobile | `CategoriesTable.tsx:68-75` |
| AM19 | CategoriesTable: botão disabled sem tooltip | `CategoriesTable.tsx:50,58` |
| AM20 | CategoryFormModal: sem emoji picker | `CategoryFormModal.tsx:104-108` |
| AM21 | CategoryFormModal: sem live preview | `CategoryFormModal.tsx:20-126` |
| AM22 | ConfigPage: sem histórico de alterações | `ConfigPage.tsx:43-159` |
| AM23 | BulkActionsBar: ícones mobile sem tooltip | `BulkActionsBar.tsx:37-48` |
| AM24 | BulkActionsBar: delete sem confirmação | `BulkActionsBar.tsx:50-59` |
| AM25 | Pagination: sem aria-label prev/next | `Pagination.tsx:25-45` |
| AM26 | Touch targets inconsistentes (32-44px) | Disperso |

---

## PARTE 3 — Recomendações Priorizadas

### Fase 1 — Críticos (Corrigir Imediatamente)

| Prioridade | Issue | Correção | Esforço |
|------------|-------|----------|---------|
| P1 | C2 | Limpar cart store no logout | ~15min |
| P2 | C1 | Adicionar toast.success ao addItem | ~10min |
| P3 | AC3 | Adicionar min="0.01" no input preço | ~5min |
| P4 | AC8 | Validar Bronze < Silver < Gold | ~15min |
| P5 | AC6 | Validar email regex antes de salvar | ~10min |
| P6 | C4 | Auto-remove item se qty < 1 | ~15min |
| P7 | AC4 | AlertDialog antes de bulk status | ~20min |
| P8 | AC5 | Confirmar antes de mudar status pedido | ~20min |
| P9 | C5 | Toast informativo antes de redirect checkout vazio | ~5min |
| P10 | C6 | Esconder "Carregar mais" quando !hasMore | ~5min |

**Esforço total Fase 1:** ~2h

### Fase 2 — Acessibilidade (WCAG AA Compliance)

| Prioridade | Issue | Correção | Esforço |
|------------|-------|----------|---------|
| P11 | I2/AI2 | Adicionar aria-label em TODOS os icon buttons | ~45min |
| P12 | AI3 | Skip link para conteúdo principal | ~10min |
| P13 | AI20 | aria-pressed nos chips de filtro | ~15min |
| P14 | AI24 | aria-label nas badges Tier/Role/Status | ~15min |
| P15 | I4 | Step indicator >= 44px mobile | ~10min |
| P16 | AI10 | Checkbox touch target >= 44px | ~10min |
| P17 | I8/AI17 | focus-visible ring em dropdown/chips | ~20min |
| P18 | AI4 | role="region" + aria-label em MetricCard | ~10min |
| P19 | AM25 | aria-label em Pagination prev/next | ~10min |

**Esforço total Fase 2:** ~2h30

### Fase 3 — Feedback & Recovery

| Prioridade | Issue | Correção | Esforço |
|------------|-------|----------|---------|
| P20 | AC2 | Retry button em erros do dashboard | ~20min |
| P21 | C3 | Botão "Voltar ao catálogo" em produto 404 | ~15min |
| P22 | AI11/AI12 | Loading state no upload + desabilitar submit | ~20min |
| P23 | I12 | Loading state no toggle favorito | ~15min |
| P24 | AI14 | Loading indicator na busca de produtos | ~10min |
| P25 | M5 | Desabilitar botão checkout após primeiro click | ~10min |
| P26 | AI16 | Histórico de status no OrderDetailsModal | ~1h |

**Esforço total Fase 3:** ~2h30

### Fase 4 — Melhorias de UX

| Prioridade | Issue | Correção | Esforço |
|------------|-------|----------|---------|
| P27 | I9 | Auto-selecionar endereço principal no checkout | ~20min |
| P28 | I13 | Resetar filtro categoria ao voltar pra home | ~10min |
| P29 | AI18 | Botão "Definir como principal" em endereços | ~30min |
| P30 | AI19 | Descrição de impacto em tier/role dropdowns | ~15min |
| P31 | AI23 | Indicador visual de mudanças pendentes config | ~15min |
| P32 | AI21 | Toast com undo ao reordenar categorias | ~30min |
| P33 | I17 | Melhorar empty state de favoritos | ~10min |
| P34 | AM2 | Confirmação de logout no admin | ~15min |

**Esforço total Fase 4:** ~2h30

---

## PARTE 4 — Componentes a Criar/Refatorar

### Componentes Novos Recomendados

1. **`<AsyncButton />`** — Botão com loading/disabled automático para mutations
   - Resolve: C1, M5, I12, AI11/AI12
   - Props: `onClick`, `loadingText`, `successText`

2. **`<RetryError />`** — Card de erro com botão retry
   - Resolve: AC2, C3
   - Props: `error`, `onRetry`, `fallbackUrl`

3. **`<DiscountBadge />`** — Badge unificado de desconto
   - Resolve: M11
   - Props: `percentage`, `size`

4. **`<ConfirmDialog />`** — Wrapper de AlertDialog para confirmações
   - Resolve: AC4, AC5, AM2, AM24
   - Props: `title`, `description`, `onConfirm`, `variant`

### Hooks Novos Recomendados

1. **`useAsyncAction()`** — Loading/error state para ações async
2. **`useCepLookup()`** — Fetch ViaCEP com validação + retry
3. **`useConfirmation()`** — State management para AlertDialog

---

## PARTE 5 — Métricas de Qualidade

### Heurísticas de Nielsen — Score por Área

| Heurística | Customer | Admin | Média |
|------------|----------|-------|-------|
| H1 Visibilidade do status | 5/10 | 5/10 | 5/10 |
| H2 Mundo real | 8/10 | 8/10 | 8/10 |
| H3 Controle do usuário | 6/10 | 5/10 | 5.5/10 |
| H4 Consistência | 6/10 | 7/10 | 6.5/10 |
| H5 Prevenção de erros | 4/10 | 3/10 | 3.5/10 |
| H6 Reconhecimento | 6/10 | 5/10 | 5.5/10 |
| H7 Eficiência | 7/10 | 6/10 | 6.5/10 |
| H8 Estética | 8/10 | 8/10 | 8/10 |
| H9 Recuperação de erros | 4/10 | 3/10 | 3.5/10 |
| H10 Ajuda/Documentação | 5/10 | 4/10 | 4.5/10 |
| **MÉDIA GERAL** | **5.9** | **5.4** | **5.65** |

### WCAG 2.1 AA — Compliance

| Critério | Status | Issues |
|----------|--------|--------|
| 1.1.1 Non-text Content | Parcial | Alt text genérico |
| 1.4.1 Use of Color | Falha | Badges/MetricCard |
| 1.4.3 Contrast | Parcial | 3 elementos < 4.5:1 |
| 2.4.1 Bypass Blocks | Falha | Sem skip link |
| 2.4.7 Focus Visible | Parcial | Dropdown/chips |
| 2.5.5 Target Size | Falha | Step indicator, checkboxes |
| 4.1.2 Name, Role, Value | Falha | 15+ elementos sem label |

---

## Conclusão

O novob2b tem uma **base arquitetural sólida** com bons padrões de componentização, responsividade e uso de React Query. A estética é limpa e profissional (score 8/10).

As maiores oportunidades de melhoria estão em:
1. **Prevenção de erros** (3.5/10) — validações e confirmações
2. **Recuperação de erros** (3.5/10) — retry buttons e fallbacks
3. **Acessibilidade** — aria-labels, touch targets, skip links

Corrigir os 16 itens críticos (~2h de trabalho) elevaria significativamente a qualidade da experiência.

---

*Relatório gerado por Uma (UX Design Expert) — desenhando com empatia*
