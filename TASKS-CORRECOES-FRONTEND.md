# Correções Frontend Cliente — novob2b

**Data:** 2026-03-23
**Branch:** `feature/fase-5-fundacao`
**Origem:** Auditoria de navegação do cliente — links mortos, páginas inexistentes, bug carrinho KG

---

## Resumo Executivo

7 correções identificadas no frontend do cliente. Nenhuma envolve backend/migrations.
Todas as alterações são em arquivos dentro de `src/`.

---

## Tarefas

### C1 — Remover "Destaques" do menu mobile
- **Responsável:** @dev
- **Complexidade:** Simples
- **Arquivo:** `src/components/layout/Header.tsx` (linha ~71)
- **Ação:** Remover o item `{ label: 'Destaques', href: '/destaques', icon: <Star /> }` do array `MOBILE_NAV_ITEMS`
- **Motivo:** A página `/destaques` não existe e não está no roadmap
- [x] Concluída

### C2 — Remover "Ofertas" do sidebar desktop
- **Responsável:** @dev
- **Complexidade:** Simples
- **Arquivo:** `src/components/layout/Sidebar.tsx` (linha ~48)
- **Ação:** Remover o item `{ label: 'Ofertas', href: '/ofertas', icon: <Tag /> }` do array `NAV_ITEMS`
- **Cleanup:** Remover import de `Tag` do lucide-react se não for usado em outro lugar
- **Motivo:** A página `/ofertas` não existe e não está no roadmap
- [x] Concluída

### C3 — Remover "Configurações" do dropdown de perfil
- **Responsável:** @dev
- **Complexidade:** Simples
- **Arquivo:** `src/components/layout/Header.tsx` (linha ~237)
- **Ação:** Remover o `<DropdownMenuItem>` que navega para `/configuracoes`
- **Cleanup:** Remover import de `Settings` do lucide-react se não for usado em outro lugar
- **Motivo:** A página `/configuracoes` não existe e não está no roadmap
- [x] Concluída

### C4 — Criar página de Categorias (`/categorias`)

#### C4.1 — UX: Wireframe/Spec da CategoriesPage
- **Responsável:** @ux-design-expert
- **Complexidade:** Média
- **Entregável:** Spec de UX com wireframe (layout, fluxo de navegação, estados)
- **Decisões a tomar:**
  - Layout: grid de cards? lista com ícones? agrupamento por seção?
  - Fluxo ao clicar: navega para HomePage com filtro? página própria com produtos da categoria?
  - Hierarquia visual: como destacar categorias com mais produtos? mostrar contagem? imagem/ícone?
  - Mobile-first: grid 2 cols? swipe horizontal? lista vertical?
  - Estados: loading (skeleton), empty (sem categorias), erro
- **Contexto para o UX:**
  - Stack: React 19 + Tailwind 4 + shadcn/ui (Card, Badge, Skeleton)
  - Categorias vêm de `getCategories()` — retorna `{ id, name, icon, color, created_at }`
  - Padrão existente: HomePage já tem `CategoryFilter` (chips horizontais)
  - Sidebar e BottomNav apontam para `/categorias`
  - A página deve ser coerente com o visual existente da loja
- **Entregável:** `docs/ux-specs/categories-page-spec.md`
- [x] Concluída

#### C4.2 — Dev: Implementar CategoriesPage
- **Responsável:** @dev
- **Complexidade:** Média
- **Depende de:** C4.1 (spec do UX)
- **Arquivos a criar:**
  - `src/features/catalog/pages/CategoriesPage.tsx`
- **Arquivos a modificar:**
  - `src/App.tsx` — adicionar rota `/categorias` apontando para `CategoriesPage`
- **Requisitos:**
  - Implementar conforme spec do @ux-design-expert (C4.1)
  - Puxar categorias via `getCategories()` de `src/features/catalog/services/products.ts`
  - Seguir padrão visual existente (shadcn/ui + Tailwind)
  - Responsivo (mobile-first)
- **Motivo:** Link `/categorias` existe no Sidebar, BottomNav e Header mobile — precisa de uma página real
- [x] Concluída

### C5 — Criar página placeholder de Perfil (`/perfil`)
- **Responsável:** @dev
- **Complexidade:** Simples
- **Arquivos a criar:**
  - `src/features/account/pages/ProfilePage.tsx`
- **Arquivos a modificar:**
  - `src/App.tsx` — adicionar rota `/perfil` apontando para `ProfilePage`
- **Requisitos:**
  - Página simples mostrando dados do perfil logado (company_name, email, tier, CNPJ/CPF)
  - Usar dados de `useAuthStore` (profile)
  - Layout com Card do shadcn/ui
  - Texto "Em breve: edição de perfil" como placeholder para funcionalidades futuras
  - Responsivo (single column)
- **Motivo:** Link `/perfil` existe no BottomNav mobile e dropdown desktop
- [x] Concluída

### C6 — Corrigir badge/contador do carrinho para produtos KG
- **Responsável:** @dev
- **Complexidade:** Média
- **Arquivos a modificar:**
  - `src/stores/cart-store.ts` — método `getItemCount()` (linha ~128)
  - `src/components/layout/Header.tsx` — exibição do badge (linha ~81)
  - `src/components/layout/BottomNav.tsx` — exibição do badge
- **Problema atual:**
  ```typescript
  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0)
  }
  ```
  Quando produto é por KG (ex: 0.5 kg), o badge mostra "0.5" ou "1.7" ao invés de contar itens distintos.
- **Solução proposta:**
  - `getItemCount()` deve retornar **número de itens distintos** no carrinho (`items.length`), não soma de quantidades
  - OU: mostrar sempre número inteiro arredondado para cima (`Math.ceil`)
  - **Recomendação:** `items.length` — o badge indica "quantos produtos diferentes estão no carrinho"
- **Motivo:** Notificação/badge fracionado confunde o usuário
- [x] Concluída

### C7 — Remover categorias hardcoded do Sidebar
- **Responsável:** @dev
- **Complexidade:** Simples
- **Arquivo:** `src/components/layout/Sidebar.tsx` (linhas ~51-59)
- **Ação:** Remover o array `CATEGORIES` inteiro e toda a seção de renderização de categorias no sidebar
- **Cleanup:** Remover imports de ícones não mais utilizados (`Flame`, `Leaf`, `Droplets`, `Paintbrush`, `Wrench`, `Sparkles`, `Star`)
- **Motivo:** Categorias são hardcoded e não refletem a base real. Com a página `/categorias` (C4), a navegação fica no menu principal
- [x] Concluída

---

## Ordem de Execução Recomendada

```
Fase A (limpeza — @dev):     C1 + C2 + C3 + C7       (paralelo)     ✅ CONCLUÍDA
Fase B (bug fix — @dev):     C6                        (sequencial)   ✅ CONCLUÍDA
Fase C (placeholder — @dev): C5                        (sequencial)   ✅ CONCLUÍDA
Fase D (UX — @ux-design-expert): C4.1                  (spec/wireframe)
Fase E (dev — @dev):         C4.2                      (depende de C4.1)
```

---

## Arquivos Impactados (resumo)

| Arquivo | Tarefas |
|---------|---------|
| `src/components/layout/Header.tsx` | C1, C3, C6 |
| `src/components/layout/Sidebar.tsx` | C2, C7 |
| `src/components/layout/BottomNav.tsx` | C6 |
| `src/stores/cart-store.ts` | C6 |
| `src/App.tsx` | C4, C5 |
| `src/features/catalog/pages/CategoriesPage.tsx` | C4 (novo) |
| `src/features/account/pages/ProfilePage.tsx` | C5 (novo) |

---

## Validação (pós-implementação)

- [ ] Nenhum link morto nos menus (mobile + desktop)
- [ ] Página `/categorias` carrega e mostra categorias reais da base
- [ ] Página `/perfil` mostra dados do usuário logado
- [ ] Badge do carrinho mostra número inteiro (contagem de itens distintos)
- [ ] Build sem erros: `npm run build`
- [ ] Lint limpo: `npm run lint`
- [ ] Navegação mobile testada (BottomNav, Header Sheet)
- [ ] Navegação desktop testada (Sidebar, Dropdown)
