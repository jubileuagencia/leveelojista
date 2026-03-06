# Jubileu OS — UX Design Specification

**Version:** 1.0.0
**Date:** 2026-03-06
**Author:** Orion (AIOS Master / UX Expert)
**PRD Reference:** `docs/prd-sistema-operacional.md`
**Architecture Reference:** `docs/architecture-sistema-operacional.md`
**Status:** Draft

---

## Design Philosophy

**Inspiração:** Linear, Vercel Dashboard, Notion
**Princípio:** Workspace profissional com densidade de informação alta, mas sem overwhelm. Cada pixel serve um propósito. Mobile-first, dark-first.

**Design Tenets:**
1. **Speed over decoration** — Animações sutis (150-200ms), sem loading spinners bloqueantes
2. **Content density** — Mostrar mais dados com menos scroll, especialmente em desktop
3. **Contextual actions** — Ações aparecem onde fazem sentido, não em menus enterrados
4. **Consistent patterns** — Mesmo componente para mesmo tipo de interação em todo o app
5. **Progressive disclosure** — Complexidade revelada sob demanda (slide-overs, expandable sections)

---

## Design Tokens

### Colors

```css
/* Base — Neutral Scale (zinc-based) */
--background:        #09090b;    /* zinc-950 */
--foreground:        #fafafa;    /* zinc-50 */
--card:              #18181b;    /* zinc-900 */
--card-foreground:   #fafafa;
--muted:             #27272a;    /* zinc-800 */
--muted-foreground:  #a1a1aa;    /* zinc-400 */
--border:            #27272a;    /* zinc-800 */
--input:             #27272a;
--ring:              #3b82f6;    /* blue-500 — focus ring */

/* Accent — Brand */
--primary:           #3b82f6;    /* blue-500 */
--primary-foreground:#ffffff;
--secondary:         #27272a;
--secondary-foreground:#fafafa;

/* Semantic */
--destructive:       #ef4444;    /* red-500 */
--success:           #22c55e;    /* green-500 */
--warning:           #f59e0b;    /* amber-500 */
--info:              #3b82f6;    /* blue-500 */

/* Status Colors (ClickUp-aligned) */
--status-todo:       #87909e;    /* gray */
--status-progress:   #3b82f6;    /* blue */
--status-review:     #f59e0b;    /* amber */
--status-done:       #22c55e;    /* green */
--status-blocked:    #ef4444;    /* red */

/* Priority Colors */
--priority-urgent:   #ef4444;
--priority-high:     #f59e0b;
--priority-normal:   #3b82f6;
--priority-low:      #a1a1aa;

/* Light mode overrides */
[data-theme="light"] {
  --background:      #ffffff;
  --foreground:      #09090b;
  --card:            #f4f4f5;    /* zinc-100 */
  --muted:           #e4e4e7;    /* zinc-200 */
  --muted-foreground:#71717a;    /* zinc-500 */
  --border:          #e4e4e7;
  --input:           #e4e4e7;
}
```

### Typography

```css
/* Font Family */
--font-sans:  'Inter', system-ui, -apple-system, sans-serif;
--font-mono:  'JetBrains Mono', 'Fira Code', monospace;

/* Font Sizes (rem) */
--text-xs:    0.75rem;    /* 12px — labels, badges */
--text-sm:    0.875rem;   /* 14px — body small, table cells */
--text-base:  1rem;       /* 16px — body default */
--text-lg:    1.125rem;   /* 18px — section headers */
--text-xl:    1.25rem;    /* 20px — page subtitles */
--text-2xl:   1.5rem;     /* 24px — page titles */
--text-3xl:   1.875rem;   /* 30px — hero headers */

/* Font Weights */
--font-normal:   400;
--font-medium:   500;
--font-semibold: 600;
--font-bold:     700;

/* Line Heights */
--leading-tight:  1.25;
--leading-normal: 1.5;
--leading-relaxed:1.625;
```

### Spacing

```css
/* Base unit: 4px */
--space-0:  0;
--space-1:  0.25rem;   /* 4px */
--space-2:  0.5rem;    /* 8px */
--space-3:  0.75rem;   /* 12px */
--space-4:  1rem;      /* 16px */
--space-5:  1.25rem;   /* 20px */
--space-6:  1.5rem;    /* 24px */
--space-8:  2rem;      /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
```

### Radius & Shadows

```css
/* Border Radius */
--radius-sm:  0.25rem;   /* 4px — badges, small elements */
--radius-md:  0.375rem;  /* 6px — buttons, inputs */
--radius-lg:  0.5rem;    /* 8px — cards, panels */
--radius-xl:  0.75rem;   /* 12px — dialogs, modals */

/* Shadows (dark mode optimized) */
--shadow-sm:  0 1px 2px rgba(0,0,0,0.3);
--shadow-md:  0 4px 6px rgba(0,0,0,0.4);
--shadow-lg:  0 10px 15px rgba(0,0,0,0.5);
```

### Breakpoints

```css
--bp-mobile:  320px;    /* min target */
--bp-sm:      640px;    /* small phones landscape */
--bp-md:      768px;    /* tablets */
--bp-lg:      1024px;   /* desktop */
--bp-xl:      1280px;   /* wide desktop */
--bp-2xl:     1440px;   /* ultra-wide */
```

---

## Layout System

### App Shell

```
┌──────────────────────────────────────────────────┐
│ [≡]  Jubileu OS          [🔍 Cmd+K]  [🌙] [👤] │  ← Header (h-14)
├────────┬─────────────────────────────────────────┤
│        │                                         │
│  📊   │  Content Area                           │
│  ✅   │                                         │
│  👥   │  (Pages render here)                    │
│  📄   │                                         │
│  ⚙️   │                                         │
│        │                                         │
│        │                                         │
│ Sidebar│                                         │
│ (w-60) │                                         │
│        │                                         │
├────────┴─────────────────────────────────────────┤
│ (no footer)                                      │
└──────────────────────────────────────────────────┘
```

**Desktop (>1024px):**
- Sidebar: 240px expanded, 64px collapsed (icon-only)
- Header: 56px height, sticky
- Content: flex-1, max-width 1440px, padding 24px

**Tablet (768-1024px):**
- Sidebar: 64px (icon-only por padrão)
- Content: full width com padding 16px

**Mobile (<768px):**
- Sidebar: Hidden, acessível via hamburger menu (drawer overlay)
- Header: 48px height
- Content: full width, padding 12px

### Sidebar Navigation

```
┌──────────┐
│ 🏠 JUBILEU│  ← Logo/brand (collapsible to icon)
├──────────┤
│          │
│ 📊 Home  │  ← Dashboard
│ ✅ Tarefas│  ← ClickUp module
│ 👥 Clientes│ ← Client management
│ 📄 Docs   │  ← Notion integration
│          │
├──────────┤  ← Separator
│ 🤖 Agentes│  ← Phase 2 (dimmed/hidden)
│ ⚡ Flows  │  ← Phase 2
│ 📬 Inbox  │  ← Phase 3
├──────────┤
│ ⚙️ Config │  ← Settings (bottom)
└──────────┘
```

- Active item: `bg-muted` + `text-primary` + left border accent
- Hover: `bg-muted/50`
- Badge de notificação: dot vermelho no ícone
- Tooltip no modo colapsado (64px)

---

## Core Screens

### 1. Login Page

```
┌──────────────────────────────────┐
│                                  │
│                                  │
│        ┌──────────────┐          │
│        │   🏠 JUBILEU  │          │
│        │     OS        │          │
│        │               │          │
│        │ Email          │         │
│        │ [____________] │         │
│        │ Senha          │         │
│        │ [____________] │         │
│        │                │         │
│        │ [  Entrar  ]   │         │
│        │                │         │
│        │ ── ou ──       │         │
│        │                │         │
│        │ [G Continue    ]│         │
│        │  with Google   │         │
│        └──────────────┘          │
│                                  │
└──────────────────────────────────┘
```

- Card centralizado (max-w-sm)
- Background: gradient sutil ou pattern
- Sem navbar/footer — tela limpa
- Error states inline abaixo dos campos
- Loading state no botão (spinner + disabled)

### 2. Dashboard Home

```
┌────────┬─────────────────────────────────────────┐
│Sidebar │ Bom dia, Fernando 👋                    │
│        ├─────────────────┬───────────────────────┤
│        │ ⚡ Ações Rápidas │ [+ Tarefa] [+ Doc]   │
│        ├─────────────────┴───────────────────────┤
│        │                                         │
│        │  ┌─────────────┐  ┌─────────────┐      │
│        │  │🔴 Tarefas   │  │📊 Atividade │      │
│        │  │  Urgentes   │  │   Recente   │      │
│        │  │             │  │             │      │
│        │  │ • Task 1    │  │ Fernando    │      │
│        │  │ • Task 2    │  │  editou...  │      │
│        │  │ • Task 3    │  │ Gabriel     │      │
│        │  │             │  │  criou...   │      │
│        │  └─────────────┘  └─────────────┘      │
│        │                                         │
│        │  ┌──────────────────────────────┐       │
│        │  │📅 Calendário da Semana       │       │
│        │  │ Seg  Ter  Qua  Qui  Sex     │       │
│        │  │  3    4    5    6    7       │       │
│        │  │      •         ••           │       │
│        │  └──────────────────────────────┘       │
│        │                                         │
└────────┴─────────────────────────────────────────┘
```

- Grid: 2 cols desktop, 1 col mobile
- Widgets como Cards com header + content
- Skeleton loading para cada widget independente
- Greeting dinâmico baseado no horário

### 3. Tasks — List View

```
┌────────┬─────────────────────────────────────────┐
│Sidebar │ ✅ Tarefas          [📋 Lista] [▦ Kanban]│
│        ├─────────────────────────────────────────┤
│        │ Filtros: [Lista ▾] [Status ▾] [Quem ▾] │
│        │          [🔍 Buscar...            ]      │
│        ├─────────────────────────────────────────┤
│        │ Nome              Status   Quem  Prazo  │
│        │─────────────────────────────────────────│
│        │ ● Criar LP        🟡 doing  👤FS  07/03 │
│        │ ● Gravar reels    🔵 todo   👤GC  08/03 │
│        │ ● Review copy     🟠 review 👤KM  06/03 │
│        │ ● Deploy staging  🟢 done   👤FS  05/03 │
│        │ ● Briefing S2     🔵 todo   👤FS  10/03 │
│        │                                         │
│        │ [Load more...]                          │
└────────┴─────────────────────────────────────────┘
```

- Table com rows clicáveis → abre Task Detail Panel
- Status badges coloridos (pill shape)
- Assignee como avatar circle (com tooltip nome)
- Priority flag icon na esquerda do nome
- Filtros como dropdown pills (persistem na URL)
- Responsive: mobile mostra card list em vez de table

### 4. Tasks — Kanban View

```
┌────────┬─────────────────────────────────────────────┐
│Sidebar │ ✅ Tarefas          [📋 Lista] [▦ Kanban]    │
│        ├─────────────────────────────────────────────┤
│        │ Filtros: [Lista ▾] [Quem ▾]                 │
│        ├────────────┬────────────┬───────────────────┤
│        │  📋 To Do  │ ⚡ Doing   │  ✅ Done           │
│        │    (5)     │    (3)     │    (8)            │
│        │ ┌────────┐ │ ┌────────┐ │ ┌────────┐       │
│        │ │Task A  │ │ │Task D  │ │ │Task G  │       │
│        │ │👤 🔴 03/│ │ │👤 🟡 05/│ │ │👤 🟢 01/│       │
│        │ └────────┘ │ └────────┘ │ └────────┘       │
│        │ ┌────────┐ │ ┌────────┐ │ ┌────────┐       │
│        │ │Task B  │ │ │Task E  │ │ │Task H  │       │
│        │ │👤 🟡 04/│ │ │👤 🔴 06/│ │ │👤 🟢 02/│       │
│        │ └────────┘ │ └────────┘ │ └────────┘       │
│        │ ┌────────┐ │            │                   │
│        │ │Task C  │ │            │                   │
│        │ │👤 🔵 07/│ │            │                   │
│        │ └────────┘ │            │                   │
└────────┴────────────┴────────────┴───────────────────┘
```

- Colunas = statuses da lista ClickUp selecionada
- Cards compactos: nome, assignee avatar, priority flag, due date
- Drag-and-drop entre colunas (@dnd-kit)
- Column header com contagem
- Mobile: scroll horizontal entre colunas (swipe)
- Drop zone visual ao arrastar (border dashed + bg highlight)

### 5. Task Detail Panel (Slide-Over)

```
                          ┌───────────────────┐
                          │ ✕  Task Detail     │
                          ├───────────────────┤
                          │                   │
                          │ Criar LP Pelicula │ ← Editable title
                          │                   │
                          │ Status: [Doing ▾] │
                          │ Quem:   [👤 FS ▾] │
                          │ Prio:   [🔴 High▾]│
                          │ Prazo:  [07/03 📅]│
                          │ Tags:   pelicula  │
                          │                   │
                          ├───────────────────┤
                          │ 📝 Descrição      │
                          │ Markdown rendered │
                          │ content here...   │
                          │                   │
                          ├───────────────────┤
                          │ ☑ Checklist       │
                          │ [x] Step 1        │
                          │ [ ] Step 2        │
                          │ [ ] Step 3        │
                          │                   │
                          ├───────────────────┤
                          │ 💬 Comentários    │
                          │                   │
                          │ FS: Boa, vou...   │
                          │ GC: Preciso do... │
                          │                   │
                          │ [Escrever...]     │
                          │ [Enviar]          │
                          └───────────────────┘
```

- Sheet component (shadcn/ui) — desliza da direita
- Width: 480px desktop, fullscreen mobile
- Close: ESC, click fora, botão X
- URL atualizada com `?task=ID` para deep linking
- Sections colapsáveis
- Scroll interno quando conteúdo excede viewport

### 6. Client Hub

```
┌────────┬─────────────────────────────────────────┐
│Sidebar │ 👥 Clientes              [+ Novo Cliente]│
│        ├─────────────────────────────────────────┤
│        │                                         │
│        │  ┌──────────┐  ┌──────────┐             │
│        │  │ 🟣        │  │ 🔴        │             │
│        │  │ Pelicula  │  │ Levee    │             │
│        │  │ Sideral   │  │          │             │
│        │  │           │  │          │             │
│        │  │ 5 tarefas │  │ 3 tarefas│             │
│        │  │ ativo     │  │ ativo    │             │
│        │  └──────────┘  └──────────┘             │
│        │                                         │
│        │  ┌──────────┐  ┌──────────┐             │
│        │  │ 🟡        │  │ ⚫        │             │
│        │  │ Caracol   │  │ Jubileu  │             │
│        │  │ Records   │  │ Internal │             │
│        │  │           │  │          │             │
│        │  │ 2 tarefas │  │ 8 tarefas│             │
│        │  │ ativo     │  │ ativo    │             │
│        │  └──────────┘  └──────────┘             │
│        │                                         │
└────────┴─────────────────────────────────────────┘
```

- Grid de cards (2 cols desktop, 1 col mobile)
- Card com: color accent, logo/initial, nome, task count, status
- Click → Client Dashboard (`/clients/[slug]`)
- Hover: subtle border highlight

### 7. Notion Browser

```
┌────────┬──────────┬──────────────────────────────┐
│Sidebar │Categories│ 📄 Documentos                 │
│        │          │ 🔍 [Buscar docs...]           │
│        │ Skills   │──────────────────────────────│
│        │ Roteiros │                              │
│        │ SOPs     │ 📄 Roteiro Reels S1          │
│        │ Briefings│    Editado 2h atrás          │
│        │ Geral    │                              │
│        │          │ 📄 Briefing Eclipse Lunar     │
│        │          │    Editado ontem             │
│        │          │                              │
│        │          │ 📄 SOP Publicação Instagram   │
│        │          │    Editado 3 dias atrás      │
│        │          │                              │
│        │          │ 📄 Skill Copy Persuasiva      │
│        │          │    Editado 1 sem atrás       │
│        │          │                              │
│        │          │ [Abrir no Notion ↗]          │
│        │          │                              │
└────────┴──────────┴──────────────────────────────┘
```

- Layout 3-panel: sidebar nav + category sidebar + content
- Category sidebar collapsa em mobile (tabs no topo)
- Click em doc → Page Viewer inline (substitui lista)
- Botão "Abrir no Notion" como escape hatch
- Search com debounce (300ms)

---

## Interaction Patterns

### Command Palette (Cmd+K)

- Overlay centralizado (max-w-lg)
- Input com auto-focus
- Resultados agrupados: Páginas, Tarefas, Clientes, Ações
- Keyboard navigation (↑↓ Enter Esc)
- Fuzzy search across all entities

### Toast Notifications

- Position: bottom-right (desktop), bottom-center (mobile)
- Duração: 4s auto-dismiss (errors: persist until dismissed)
- Tipos: success (green), error (red), info (blue), warning (amber)
- Stack: max 3 visible, older auto-dismiss

### Loading States

- **Page transitions:** Top progress bar (NProgress-style)
- **Data loading:** Skeleton components matching final layout
- **Actions (create/update):** Button spinner + disabled state
- **Optimistic updates:** Immediate UI change, subtle "saving" indicator

### Empty States

- Ícone ilustrativo (Lucide icon em tamanho grande, muted)
- Título curto: "Nenhuma tarefa encontrada"
- Descrição: "Tente ajustar os filtros ou criar uma nova tarefa"
- CTA button quando aplicável

### Confirmation Dialogs

- AlertDialog (shadcn/ui) para ações destrutivas
- Título claro: "Desativar cliente?"
- Descrição do impacto: "O cliente não aparecerá mais na listagem"
- Dois botões: "Cancelar" (secondary) + "Desativar" (destructive)

---

## Responsive Behavior

### Mobile Adaptations (<768px)

| Component | Desktop | Mobile |
|-----------|---------|--------|
| Sidebar | Permanent, collapsible | Hidden, drawer overlay |
| Task List | Table view | Card list |
| Kanban | Side-by-side columns | Horizontal scroll |
| Task Detail | Slide-over 480px | Fullscreen sheet |
| Dashboard Widgets | 2-3 columns grid | Single column stack |
| Client Grid | 2 columns | Single column |
| Notion Browser | 3-panel | Tabbed (categories → list → content) |
| Dialogs | Centered modal | Bottom sheet |
| Filters | Inline dropdowns | Collapsible filter panel |
| Command Palette | Centered overlay | Fullscreen overlay |

### Touch Targets

- Minimum touch target: 44x44px (WCAG)
- Interactive elements: min height 40px
- Spacing between touch targets: min 8px

### Gestures

- Swipe right → open sidebar drawer
- Swipe left on sidebar → close
- Pull down → refresh data
- Horizontal scroll → kanban columns

---

## Accessibility (WCAG AA)

### Requirements

- **Color Contrast:** Min 4.5:1 for normal text, 3:1 for large text
- **Keyboard Navigation:** Tab through all interactive elements, visible focus ring
- **Screen Readers:** ARIA labels on all icons, live regions for dynamic content
- **Focus Management:** Focus trap in modals/sheets, return focus on close
- **Reduced Motion:** Respect `prefers-reduced-motion` media query
- **Text Sizing:** All text in rem, supports browser zoom up to 200%

### Component Accessibility

| Component | ARIA Pattern | Keyboard |
|-----------|-------------|----------|
| Sidebar | `nav` + `role="navigation"` | Tab, Arrow keys |
| Kanban | `role="listbox"` per column | Tab between cards, Space to grab |
| Task Detail | `role="dialog"` | Esc to close, Tab through fields |
| Command Palette | `role="combobox"` | ↑↓ navigate, Enter select, Esc close |
| Toasts | `role="alert"` + `aria-live="polite"` | Auto-announced |
| Filters | `role="combobox"` | Type to filter, ↑↓ select |

---

## Animation Guidelines

```css
/* Standard transitions */
--transition-fast:    150ms ease;    /* Hover effects, color changes */
--transition-normal:  200ms ease;    /* Panel slides, opacity changes */
--transition-slow:    300ms ease;    /* Page transitions, expand/collapse */

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * { transition-duration: 0ms !important; animation-duration: 0ms !important; }
}
```

**What to animate:**
- Sidebar collapse/expand
- Sheet/dialog open/close (slide + fade)
- Kanban card drag (transform)
- Toast enter/exit (slide up + fade)
- Skeleton shimmer

**What NOT to animate:**
- Page navigations (instant)
- Data updates (instant)
- Filter changes (instant)
- Scroll behavior (native)
