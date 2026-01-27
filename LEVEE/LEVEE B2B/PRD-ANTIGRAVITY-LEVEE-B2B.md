# PRD Antigravity - Levee B2B | Sistema de E-commerce Hortifruti

> **Metodologia**: Desenvolvimento Orientado por IA usando Google Antigravity
> **Versão**: 2.0 Antigravity-Ready
> **Data**: 26 de janeiro de 2026
> **Stack**: Next.js 14 + TypeScript + Supabase + N8N

---

## 📋 ÍNDICE

1. [Visão Geral do Projeto](#visão-geral)
2. [Estrutura de Pastas](#estrutura)
3. [Design System (Tokens Semânticos)](#design-system)
4. [Skills a Serem Criadas](#skills)
5. [Database Schema](#database)
6. [Histórias de Usuário](#user-stories)
7. [Fluxo de Telas](#telas)
8. [Prompts para Antigravity](#prompts)
9. [Dados MOC para Testes](#dados-moc)
10. [Checklist de Validação](#checklist)

---

## <a name="visão-geral"></a>📖 1. VISÃO GERAL DO PROJETO

### Objetivo
Criar uma plataforma web B2B de e-commerce para venda de produtos hortifruti da **Levee Hortiplus** para estabelecimentos comerciais (padarias, restaurantes, escolas, academias) em Belo Horizonte.

### Problema a Resolver
Clientes B2B precisam de:
- ✅ Prazo de pagamento (7, 14 ou 21 dias)
- ✅ Preços diferenciados por volume/categoria
- ✅ Gestão de múltiplos pontos de entrega
- ✅ Processo de compra rápido e sem fricção

### Solução Técnica
- **Frontend**: Next.js 14 (App Router) + TypeScript + TailwindCSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Automações**: N8N via MCP (emails, integrações)
- **Autenticação**: Supabase Auth (sem Clerk para maior controle)
- **Pagamentos**: Gateway brasileiro (Mercado Pago ou PagSeguro)
- **Deploy**: VPS Hostinger + Docker

### Diferenciais
1. **Sistema de Categorias**: Bronze (20%), Prata (25%), Ouro (30%) de markup
2. **Precificação Dinâmica**: Preço calculado em tempo real por categoria
3. **Multi-estabelecimentos**: Cliente gerencia vários pontos de entrega
4. **Sem Sistema de Crédito**: Apenas prazo de pagamento configurável

---

## <a name="estrutura"></a>🗂️ 2. ESTRUTURA DE PASTAS

```
levee-b2b/
├── .agent/
│   ├── skills/
│   │   ├── auth-supabase/
│   │   │   └── skill.md
│   │   ├── pricing-calculator/
│   │   │   └── skill.md
│   │   ├── cart-management/
│   │   │   └── skill.md
│   │   └── payment-integration/
│   │       └── skill.md
│   └── rules/
│       └── design-system.md
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── cadastro/
│   │   └── layout.tsx
│   ├── (cliente)/
│   │   ├── dashboard/
│   │   ├── produtos/
│   │   ├── carrinho/
│   │   ├── checkout/
│   │   ├── pedidos/
│   │   ├── estabelecimentos/
│   │   ├── boletos/
│   │   └── perfil/
│   ├── (admin)/
│   │   ├── pedidos/
│   │   ├── clientes/
│   │   └── produtos/
│   ├── api/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── payments/
│   │   └── webhooks/
│   └── layout.tsx
├── components/
│   ├── ui/ (atoms)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   ├── composed/ (molecules)
│   │   ├── ProductCard.tsx
│   │   ├── CartItem.tsx
│   │   ├── OrderCard.tsx
│   │   └── ...
│   └── layouts/
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── ...
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── types.ts
│   ├── utils/
│   │   ├── pricing.ts
│   │   ├── formatters.ts
│   │   └── validators.ts
│   └── store/
│       └── cart-store.ts (Zustand)
├── types/
│   ├── database.ts
│   ├── api.ts
│   └── index.ts
├── public/
│   └── images/
└── tailwind.config.ts
```

---

## <a name="design-system"></a>🎨 3. DESIGN SYSTEM (Tokens Semânticos)

### Arquivo: `.agent/rules/design-system.md`

```markdown
# Design System - Levee B2B

## REGRA CRÍTICA
Todos os componentes DEVEM seguir estes tokens. Nunca use valores hardcoded.
Sempre referencie variáveis CSS ou classes do Tailwind definidas abaixo.

## Cores (Tailwind Config)

### Primary (Verde - Frescor, Agricultura)
- 50: #ECFDF5
- 100: #D1FAE5
- 500: #10B981 (MAIN)
- 600: #059669
- 900: #064E3B

### Secondary (Rose - Energia, Destaque)
- 50: #FFF1F2
- 500: #F43F5E (MAIN)
- 600: #E11D48
- 900: #881337

### Categorias de Cliente
- bronze: #CD7F32
- prata: #C0C0C0
- ouro: #FFD700

### Neutral (Grays)
- 50: #F9FAFB
- 100: #F3F4F6
- 500: #6B7280
- 700: #374151
- 900: #111827

### Semantic
- success: green-500
- warning: yellow-500
- error: red-500
- info: blue-500

## Tipografia

### Font Family
```css
font-family: 'Poppins', sans-serif;
```
**Importar via Google Fonts no layout.tsx**

### Font Sizes (Tailwind)
- text-xs: 12px
- text-sm: 14px
- text-base: 16px (body padrão)
- text-lg: 18px
- text-xl: 20px
- text-2xl: 24px (headings pequenos)
- text-3xl: 30px (headings médios)
- text-4xl: 36px (headings grandes)

### Font Weights
- font-normal: 400
- font-medium: 500
- font-semibold: 600
- font-bold: 700

## Espaçamento

Sistema base de 4px:
- space-1: 4px
- space-2: 8px
- space-3: 12px
- space-4: 16px
- space-6: 24px
- space-8: 32px
- space-12: 48px
- space-16: 64px

**Container padrão**: max-w-7xl mx-auto px-4

## Border Radius
- rounded-sm: 4px (inputs)
- rounded-md: 8px (cards padrão)
- rounded-lg: 12px (cards destacados)
- rounded-xl: 16px (modal)
- rounded-full: 9999px (avatars, badges pills)

## Shadows
- shadow-sm: pequena elevação (cards)
- shadow-md: média (dropdowns)
- shadow-lg: grande (modais)
- shadow-none: sem sombra

## Componentes Base

### Button
**Variantes**:
1. Primary: bg-primary-500 hover:bg-primary-600 text-white
2. Secondary: bg-secondary-500 hover:bg-secondary-600 text-white
3. Outline: border-2 border-gray-300 hover:border-primary-500
4. Ghost: hover:bg-gray-100

**Tamanhos**:
- sm: px-3 py-1.5 text-sm
- md: px-4 py-2 text-base (padrão)
- lg: px-6 py-3 text-lg

**Estado disabled**: opacity-50 cursor-not-allowed

### Input
- Base: border border-gray-300 rounded-md px-3 py-2
- Focus: focus:ring-2 focus:ring-primary-500 focus:border-primary-500
- Error: border-red-500 focus:ring-red-500

### Card
- Base: bg-white rounded-md shadow-sm p-4 border border-gray-200
- Hover (clicável): hover:shadow-md transition-shadow

### Badge
**Categorias de Cliente**:
- Bronze: bg-[#CD7F32] text-white
- Prata: bg-[#C0C0C0] text-gray-800
- Ouro: bg-[#FFD700] text-gray-900

**Status de Pedido**:
- Pendente: bg-yellow-100 text-yellow-800
- Confirmado: bg-blue-100 text-blue-800
- Em Separação: bg-purple-100 text-purple-800
- Entregue: bg-green-100 text-green-800
- Cancelado: bg-red-100 text-red-800

## Regras de Composição

### Espaçamento entre elementos
- Heading → Conteúdo: space-y-4
- Cards em grid: gap-4 ou gap-6
- Form fields: space-y-3

### Hierarquia Visual
1. H1: text-4xl font-bold text-gray-900
2. H2: text-3xl font-semibold text-gray-800
3. H3: text-2xl font-semibold text-gray-800
4. Body: text-base text-gray-700

### Responsividade
- Mobile first (base classes sem prefixo)
- md: >= 768px
- lg: >= 1024px
- xl: >= 1280px

**Grid responsivo padrão**:
```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4
```
```

---

## <a name="skills"></a>🧠 4. SKILLS A SEREM CRIADAS

### 4.1 Skill: Autenticação com Supabase

**Arquivo**: `.agent/skills/auth-supabase/skill.md`

```markdown
# Skill: Autenticação com Supabase

## Objetivo
Implementar sistema completo de autenticação usando Supabase Auth.

## Stack
- Supabase Client (Browser)
- Supabase Server (Server Components)
- Next.js Middleware para proteção de rotas

## Fluxo

### Setup Inicial
1. Instalar pacotes:
```bash
npm install @supabase/supabase-js @supabase/ssr
```

2. Criar `lib/supabase/client.ts`:
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

3. Criar `lib/supabase/server.ts`:
```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}
```

### Middleware (Proteção de Rotas)
Criar `middleware.ts` na raiz:
```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Proteção de rotas
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

### Páginas de Autenticação

**Login** (`app/(auth)/login/page.tsx`):
```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleLogin}>
      {/* UI com design system */}
    </form>
  )
}
```

**Cadastro** (`app/(auth)/cadastro/page.tsx`):
Similar ao login, usar `signUp` do Supabase.

### Server Actions (Alternativa mais moderna)
Criar `app/actions/auth.ts`:
```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
```

## Checklist
- [ ] Supabase configurado com env vars
- [ ] Middleware protegendo rotas
- [ ] Login funcionando
- [ ] Cadastro funcionando
- [ ] Logout funcionando
- [ ] Redirect correto após auth
```

---

### 4.2 Skill: Calculadora de Preços por Categoria

**Arquivo**: `.agent/skills/pricing-calculator/skill.md`

```markdown
# Skill: Sistema de Precificação por Categoria

## Objetivo
Calcular preço dinâmico de produtos baseado na categoria do cliente.

## Regra de Negócio
- Bronze: cost_price × 1.20 (20% lucro)
- Prata: cost_price × 1.25 (25% lucro)
- Ouro: cost_price × 1.30 (30% lucro)

## Implementação

### 1. Type Definitions (`types/database.ts`)
```typescript
export type CustomerCategory = 'bronze' | 'prata' | 'ouro'

export interface Product {
  id: string
  name: string
  cost_price: number
  unit: string
  // ... outros campos
}

export interface User {
  id: string
  customer_category: CustomerCategory
  // ... outros campos
}
```

### 2. Função de Cálculo (`lib/utils/pricing.ts`)
```typescript
import { CustomerCategory } from '@/types/database'

const MARKUP_MAP: Record<CustomerCategory, number> = {
  bronze: 1.20,
  prata: 1.25,
  ouro: 1.30,
}

export function calculatePrice(
  costPrice: number,
  category: CustomerCategory
): number {
  return costPrice * MARKUP_MAP[category]
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}
```

### 3. Hook para Obter Categoria do Usuário (`hooks/useUserCategory.ts`)
```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { CustomerCategory } from '@/types/database'

export function useUserCategory() {
  const [category, setCategory] = useState<CustomerCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchCategory() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('users')
        .select('customer_category')
        .eq('id', user.id)
        .single()

      setCategory(data?.customer_category || 'bronze')
      setLoading(false)
    }

    fetchCategory()
  }, [])

  return { category, loading }
}
```

### 4. Componente de Exemplo (`components/ProductCard.tsx`)
```typescript
'use client'

import { Product } from '@/types/database'
import { calculatePrice, formatPrice } from '@/lib/utils/pricing'
import { useUserCategory } from '@/hooks/useUserCategory'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { category, loading } = useUserCategory()

  if (loading) return <div>Carregando...</div>

  const finalPrice = category
    ? calculatePrice(product.cost_price, category)
    : product.cost_price

  return (
    <div className="card">
      <h3>{product.name}</h3>
      <p className="text-2xl font-bold text-primary-600">
        {formatPrice(finalPrice)}
      </p>
      <span className="text-sm text-gray-500">/ {product.unit}</span>
    </div>
  )
}
```

### 5. API Route com Server-Side Calculation
```typescript
// app/api/products/route.ts
import { createClient } from '@/lib/supabase/server'
import { calculatePrice } from '@/lib/utils/pricing'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  // Pegar usuário logado
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Pegar categoria do usuário
  const { data: userData } = await supabase
    .from('users')
    .select('customer_category')
    .eq('id', user.id)
    .single()

  // Pegar produtos
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)

  // Calcular preços
  const productsWithPrices = products?.map(product => ({
    ...product,
    price: calculatePrice(
      product.cost_price,
      userData?.customer_category || 'bronze'
    ),
  }))

  return NextResponse.json(productsWithPrices)
}
```

## Testes Manuais
1. Login com cliente Bronze → verificar preço
2. Login com cliente Prata → verificar preço
3. Login com cliente Ouro → verificar preço
4. Admin deve ver preço de custo + 3 variações
```

---

### 4.3 Skill: Gerenciamento de Carrinho

**Arquivo**: `.agent/skills/cart-management/skill.md`

```markdown
# Skill: Gerenciamento de Carrinho com Zustand

## Objetivo
State management do carrinho de compras com persistência.

## Setup

### Instalação
```bash
npm install zustand
```

### Store (`lib/store/cart-store.ts`)
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productId: string
  name: string
  image: string
  price: number // Já calculado pela categoria do usuário
  quantity: number
  unit: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  getSubtotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.productId === newItem.productId
          )

          if (existingIndex >= 0) {
            // Atualizar quantidade
            const updated = [...state.items]
            updated[existingIndex].quantity += newItem.quantity
            return { items: updated }
          }

          // Adicionar novo
          return { items: [...state.items, newItem] }
        })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity }
              : item
          ),
        }))
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }))
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'levee-cart', // Nome no localStorage
    }
  )
)
```

### Uso em Componente

**Adicionar ao Carrinho**:
```typescript
'use client'

import { useCartStore } from '@/lib/store/cart-store'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner' // ou outro toast

export function AddToCartButton({ product, price }) {
  const addItem = useCartStore((state) => state.addItem)

  function handleAdd() {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image_url,
      price: price, // Já calculado
      quantity: 1,
      unit: product.unit,
    })

    toast.success(`${product.name} adicionado ao carrinho!`)
  }

  return (
    <Button onClick={handleAdd}>
      Adicionar à Sacola
    </Button>
  )
}
```

**Badge do Carrinho (Header)**:
```typescript
'use client'

import { useCartStore } from '@/lib/store/cart-store'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'

export function CartButton() {
  const itemCount = useCartStore((state) => state.getItemCount())

  return (
    <Link href="/carrinho" className="relative">
      <ShoppingCart className="w-6 h-6" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-secondary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  )
}
```

**Página do Carrinho**:
```typescript
'use client'

import { useCartStore } from '@/lib/store/cart-store'
import { CartItem } from '@/components/composed/CartItem'
import { formatPrice } from '@/lib/utils/pricing'

export default function CarrinhoPage() {
  const items = useCartStore((state) => state.items)
  const subtotal = useCartStore((state) => state.getSubtotal())

  if (items.length === 0) {
    return <div>Carrinho vazio</div>
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Carrinho</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <CartItem key={item.productId} item={item} />
        ))}
      </div>

      <div className="mt-8 border-t pt-4">
        <div className="flex justify-between text-xl font-bold">
          <span>Subtotal:</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <Link href="/checkout">
          <Button className="w-full mt-4" size="lg">
            Finalizar Pedido
          </Button>
        </Link>
      </div>
    </div>
  )
}
```
```

---

### 4.4 Skill: Integração com Gateway de Pagamento

**Arquivo**: `.agent/skills/payment-integration/skill.md`

```markdown
# Skill: Integração com Gateway de Pagamento (Mercado Pago)

## Objetivo
Gerar PIX e Boleto com prazo configurável.

## Setup

### Instalação
```bash
npm install mercadopago
```

### Configuração
Adicionar no `.env.local`:
```
MERCADOPAGO_ACCESS_TOKEN=your_token_here
```

### Server Action (`app/actions/payments.ts`)
```typescript
'use server'

import { MercadoPagoConfig, Payment } from 'mercadopago'
import { createClient } from '@/lib/supabase/server'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

const payment = new Payment(client)

export async function generatePayment(orderId: string) {
  const supabase = await createClient()

  // Buscar pedido
  const { data: order } = await supabase
    .from('orders')
    .select('*, users(*)')
    .eq('id', orderId)
    .single()

  if (!order) throw new Error('Pedido não encontrado')

  // Buscar dados de pagamento do usuário
  const paymentTermDays = order.users.payment_term_days

  // Criar pagamento no Mercado Pago
  const response = await payment.create({
    body: {
      transaction_amount: order.total,
      description: `Pedido #${order.order_number}`,
      payment_method_id: order.payment_method === 'pix' ? 'pix' : 'bolbradesco',
      payer: {
        email: order.users.email,
      },
      ...(order.payment_method === 'boleto' && {
        date_of_expiration: calculateDueDate(paymentTermDays),
      }),
    },
  })

  // Salvar dados do pagamento
  await supabase
    .from('payments')
    .insert({
      order_id: orderId,
      method: order.payment_method,
      amount: order.total,
      due_date: order.payment_method === 'boleto'
        ? calculateDueDate(paymentTermDays)
        : null,
      gateway_transaction_id: response.id.toString(),
      pix_qr_code: response.point_of_interaction?.transaction_data?.qr_code,
      pix_qr_code_text: response.point_of_interaction?.transaction_data?.qr_code_base64,
      boleto_url: response.transaction_details?.external_resource_url,
      boleto_barcode: response.barcode?.content,
      status: 'pending',
    })

  return response
}

function calculateDueDate(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString()
}
```

### Webhook (Atualização de Status)
```typescript
// app/api/webhooks/mercadopago/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()

  // Verificar assinatura (importante para segurança)
  // ... validação do webhook

  if (body.action === 'payment.updated') {
    const supabase = await createClient()
    const paymentId = body.data.id

    // Buscar status atualizado no Mercado Pago
    // Atualizar no banco
    await supabase
      .from('payments')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('gateway_transaction_id', paymentId)

    // Atualizar pedido
    const { data: payment } = await supabase
      .from('payments')
      .select('order_id')
      .eq('gateway_transaction_id', paymentId)
      .single()

    await supabase
      .from('orders')
      .update({ status: 'confirmed' })
      .eq('id', payment?.order_id)
  }

  return NextResponse.json({ ok: true })
}
```
```

---

## <a name="database"></a>💾 5. DATABASE SCHEMA

### Arquivo SQL para Supabase

```sql
-- Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUM Types
CREATE TYPE customer_category AS ENUM ('bronze', 'prata', 'ouro');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled');
CREATE TYPE payment_method AS ENUM ('pix', 'boleto');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled');

-- 1. USERS (estende auth.users do Supabase)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'customer', -- customer, admin
  cnpj VARCHAR(18) UNIQUE,
  razao_social VARCHAR(255),
  nome_fantasia VARCHAR(255),
  customer_category customer_category NOT NULL DEFAULT 'bronze',
  payment_term_days INTEGER NOT NULL DEFAULT 7 CHECK (payment_term_days IN (7, 14, 21)),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. USER_ESTABLISHMENTS
CREATE TABLE public.user_establishments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  street VARCHAR(255) NOT NULL,
  number VARCHAR(20),
  complement VARCHAR(255),
  neighborhood VARCHAR(100),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(2) NOT NULL,
  zip_code VARCHAR(10) NOT NULL,
  phone VARCHAR(20),
  responsible_name VARCHAR(255),
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CATEGORIES
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. PRODUCTS
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  cost_price DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  unit_weight DECIMAL(8, 3),
  image_url TEXT,
  stock_quantity DECIMAL(10, 2) DEFAULT 0,
  min_order_quantity DECIMAL(10, 2) DEFAULT 1,
  origin VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. PRODUCT_CATEGORIES (Many-to-Many)
CREATE TABLE public.product_categories (
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

-- 6. ORDERS
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID REFERENCES public.users(id),
  delivery_establishment_id UUID REFERENCES public.user_establishments(id),
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  discount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  payment_method payment_method NOT NULL,
  payment_term_days INTEGER,
  delivery_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. ORDER_ITEMS
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  product_name VARCHAR(255) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. PAYMENTS
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  method payment_method NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  amount DECIMAL(10, 2) NOT NULL,
  due_date DATE,
  paid_at TIMESTAMP WITH TIME ZONE,
  boleto_url TEXT,
  boleto_barcode TEXT,
  pix_qr_code TEXT,
  pix_qr_code_text TEXT,
  gateway_transaction_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. ORDER_STATUS_HISTORY
CREATE TABLE public.order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  changed_by UUID REFERENCES public.users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_products_active ON public.products(is_active);
CREATE INDEX idx_payments_order_id ON public.payments(order_id);
CREATE INDEX idx_payments_status ON public.payments(status);

-- FUNCTIONS

-- Função para gerar order_number automaticamente
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'LEV-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(nextval('order_number_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE order_number_seq START 1;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ROW LEVEL SECURITY (RLS)

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_establishments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Policies

-- Users: podem ver e editar apenas seus próprios dados
CREATE POLICY "Users can view own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Admins podem ver tudo
CREATE POLICY "Admins can view all users" ON public.users FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can update all users" ON public.users FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Establishments: usuário vê apenas os seus
CREATE POLICY "Users can view own establishments" ON public.user_establishments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own establishments" ON public.user_establishments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own establishments" ON public.user_establishments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own establishments" ON public.user_establishments FOR DELETE USING (auth.uid() = user_id);

-- Orders: usuário vê apenas os seus
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins podem ver todos os pedidos
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can update all orders" ON public.orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Products e Categories: todos podem ver (public read)
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT TO authenticated USING (is_active = true);

-- Admins podem gerenciar produtos
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
```

---

## <a name="user-stories"></a>📝 6. HISTÓRIAS DE USUÁRIO

### Épico 1: Autenticação e Cadastro

**US-001: Cadastro de Cliente B2B**
- **Como** um dono de restaurante
- **Quero** criar uma conta no sistema
- **Para** poder fazer pedidos de hortifruti

**Critérios de Aceitação:**
- [ ] Formulário com: Email, Senha, CNPJ, Razão Social, Nome Fantasia
- [ ] Validação de CNPJ (formato)
- [ ] Email de confirmação enviado
- [ ] Status inicial: aguardando aprovação
- [ ] Redirect para tela informando "Aguarde aprovação"

**US-002: Login**
- **Como** um cliente cadastrado
- **Quero** fazer login no sistema
- **Para** acessar minha conta

**Critérios de Aceitação:**
- [ ] Login com email e senha
- [ ] Mensagem de erro clara se credenciais inválidas
- [ ] Redirect para /dashboard após sucesso
- [ ] Link "Esqueci minha senha"

---

### Épico 2: Catálogo e Busca

**US-003: Visualizar Produtos**
- **Como** um cliente
- **Quero** navegar pelo catálogo de produtos
- **Para** escolher o que comprar

**Critérios de Aceitação:**
- [ ] Página inicial mostra categorias
- [ ] Página de categoria mostra grid de produtos
- [ ] Cada produto mostra: imagem, nome, preço (calculado pela minha categoria), unidade
- [ ] Produtos fora de estoque aparecem com badge "Indisponível"

**US-004: Buscar Produtos**
- **Como** um cliente
- **Quero** buscar produtos por nome
- **Para** encontrar rapidamente o que preciso

**Critérios de Aceitação:**
- [ ] Barra de busca no header
- [ ] Busca em nome e descrição (case-insensitive)
- [ ] Resultados mostrados em grid
- [ ] Mensagem "Nenhum resultado" se não achar

---

### Épico 3: Carrinho e Checkout

**US-005: Adicionar ao Carrinho**
- **Como** um cliente
- **Quero** adicionar produtos ao carrinho
- **Para** montar meu pedido

**Critérios de Aceitação:**
- [ ] Botão "Adicionar à Sacola" na página do produto
- [ ] Seletor de quantidade
- [ ] Toast de confirmação ao adicionar
- [ ] Badge no ícone do carrinho atualiza

**US-006: Gerenciar Estabelecimentos**
- **Como** um cliente com múltiplas lojas
- **Quero** cadastrar meus pontos de entrega
- **Para** escolher onde receber cada pedido

**Critérios de Aceitação:**
- [ ] Página /estabelecimentos
- [ ] Botão "+ Novo Estabelecimento"
- [ ] Form: Nome, Endereço completo, Telefone, Responsável
- [ ] Checkbox "Marcar como padrão"
- [ ] Lista mostra todos estabelecimentos com ações (editar, excluir)

**US-007: Finalizar Pedido**
- **Como** um cliente
- **Quero** finalizar minha compra
- **Para** receber os produtos

**Critérios de Aceitação:**
- [ ] Step 1: Escolher estabelecimento de entrega
- [ ] Step 2: Ver forma de pagamento (PIX ou Boleto com meu prazo)
- [ ] Step 3: Revisar pedido completo
- [ ] Botão "Finalizar" cria pedido no banco
- [ ] Gera pagamento (PIX ou Boleto)
- [ ] Email de confirmação enviado
- [ ] Redirect para /pedidos/{id}

---

### Épico 4: Gestão de Pedidos

**US-008: Ver Meus Pedidos**
- **Como** um cliente
- **Quero** ver histórico dos meus pedidos
- **Para** acompanhar entregas e valores

**Critérios de Aceitação:**
- [ ] Lista cronológica de pedidos
- [ ] Card mostra: número, data, valor, status
- [ ] Filtro por período
- [ ] Botão "Ver detalhes"

**US-009: Ver Boletos**
- **Como** um cliente
- **Quero** ver meus boletos
- **Para** pagar no prazo

**Critérios de Aceitação:**
- [ ] Tabs: Pendentes, Pagos
- [ ] Card mostra: vencimento, valor, status
- [ ] Botão "Copiar código de barras"
- [ ] Alerta visual se vencer em < 3 dias

---

### Épico 5: Admin

**US-010: Configurar Cliente (Admin)**
- **Como** admin
- **Quero** configurar categoria e prazo de clientes
- **Para** definir preços e condições de pagamento

**Critérios de Aceitação:**
- [ ] Lista de clientes com busca
- [ ] Botão "Editar" abre modal
- [ ] Dropdown: Categoria (Bronze, Prata, Ouro)
- [ ] Dropdown: Prazo (7, 14, 21 dias)
- [ ] Salvar atualiza imediatamente
- [ ] Log de auditoria registra mudança

**US-011: Gerenciar Produtos (Admin)**
- **Como** admin
- **Quero** cadastrar e editar produtos
- **Para** manter catálogo atualizado

**Critérios de Aceitação:**
- [ ] Form com: Nome, Descrição, Preço de Custo, Unidade, Imagem, Estoque
- [ ] Upload de imagem para Supabase Storage
- [ ] Preços calculados (Bronze/Prata/Ouro) mostrados como readonly
- [ ] Botão "Desativar" em vez de "Excluir"

---

## <a name="telas"></a>🖼️ 7. FLUXO DE TELAS

### Mapa de Navegação

```
┌─────────────────────────────────────────────┐
│              Home (não logado)              │
│  [Login] [Cadastre-se]                      │
└───────────┬─────────────────────────────────┘
            │
     ┌──────┴──────┐
     │             │
┌────▼─────┐ ┌────▼──────┐
│  Login   │ │ Cadastro  │
└────┬─────┘ └────┬──────┘
     │            │
     └──────┬─────┘
            │
     ┌──────▼──────────────────────────────────┐
     │          Dashboard (Cliente)            │
     │  - Badge categoria                       │
     │  - Últimos pedidos                       │
     │  - Boletos vencendo                      │
     │  [Fazer Novo Pedido]                     │
     └──────┬──────────────────────────────────┘
            │
     ┌──────┴────────┬──────────────┬──────────┐
     │               │              │          │
┌────▼─────┐  ┌─────▼─────┐  ┌────▼────┐  ┌──▼──────────┐
│Produtos  │  │Estabeleci-│  │Pedidos  │  │   Perfil    │
│(Catálogo)│  │mentos     │  │         │  │             │
└────┬─────┘  └───────────┘  └────┬────┘  └─────────────┘
     │                             │
┌────▼─────┐                  ┌───▼───────┐
│ Produto  │                  │  Pedido   │
│ Detalhe  │                  │  Detalhe  │
└────┬─────┘                  └───────────┘
     │
     │ [Adicionar]
     │
┌────▼─────┐
│Carrinho  │
└────┬─────┘
     │
     │ [Finalizar]
     │
┌────▼──────────────┐
│    Checkout       │
│  Step 1: Entrega  │
│  Step 2: Pagto    │
│  Step 3: Revisão  │
└────┬──────────────┘
     │
┌────▼──────────────┐
│  Pedido Criado!   │
│  [Ver Boleto/PIX] │
└───────────────────┘


ADMIN
┌─────────────────────────────────────┐
│       Admin Dashboard               │
├─────────────────────────────────────┤
│  [Pedidos] [Clientes] [Produtos]    │
└─────────┬───────────┬──────────────┘
          │           │
    ┌─────▼────┐  ┌──▼──────────┐
    │ Pedidos  │  │  Clientes   │
    │ (lista)  │  │  (lista +   │
    │          │  │   config)   │
    └──────────┘  └─────────────┘
```

---

## <a name="prompts"></a>💬 8. PROMPTS PARA ANTIGRAVITY

### Fase 1: Setup Inicial

**Prompt 1: Criar Projeto Base**
```
Crie um projeto Next.js 14 com as seguintes especificações:

- TypeScript (modo strict)
- App Router
- TailwindCSS
- ESLint + Prettier
- Estrutura de pastas conforme @estrutura-pastas.md
- Configurar font Poppins do Google Fonts
- Instalar dependências: @supabase/supabase-js @supabase/ssr zustand sonner lucide-react

Após criar, execute npm run dev e abra no Simple Browser.
```

**Prompt 2: Configurar Supabase**
```
Configure Supabase seguindo estas etapas:

1. Crie os arquivos client e server em lib/supabase/ conforme @.agent/skills/auth-supabase/skill.md
2. Adicione as env vars no .env.local (eu vou fornecer os valores)
3. Crie o middleware.ts para proteção de rotas
4. Mostre exemplo de como usar em um Server Component e em um Client Component
```

---

### Fase 2: Design System

**Prompt 3: Implementar Design System**
```
Implemente o design system completo:

1. Leia todo o arquivo @.agent/rules/design-system.md
2. Configure o tailwind.config.ts com:
   - Cores personalizadas (primary, secondary, bronze, prata, ouro)
   - Font Poppins
   - Valores de spacing e border-radius
3. Crie os componentes atoms em components/ui/:
   - Button (com todas as variantes)
   - Input
   - Badge
   - Card
   - Label
   - Textarea
4. Cada componente DEVE seguir rigorosamente os tokens do design system
5. Use TypeScript com props bem tipadas
6. Adicione documentação inline nos componentes
```

**Prompt 4: Componentes Composed**
```
Agora crie os componentes composed seguindo o @design-system.md:

1. ProductCard:
   - Recebe: product (Product type)
   - Calcula preço usando @.agent/skills/pricing-calculator
   - Visual: imagem, nome, preço, botão "Adicionar"

2. CartItem:
   - Recebe: item (CartItem type)
   - Seletor de quantidade (+/-)
   - Botão remover
   - Mostra subtotal

3. OrderCard:
   - Recebe: order (Order type)
   - Mostra: número, data, valor, status badge
   - Botão "Ver detalhes"

Todos devem usar apenas componentes UI já criados.
```

---

### Fase 3: Database e Types

**Prompt 5: Executar Schema no Supabase**
```
Execute o schema SQL no Supabase:

1. Acesse o Supabase SQL Editor
2. Execute o script completo de @database-schema.sql
3. Verifique se todas as tabelas foram criadas
4. Teste as RLS policies criando um usuário de teste
5. Gere os types do TypeScript: npx supabase gen types typescript --project-id [ID] > types/database.ts
```

**Prompt 6: Seed de Dados**
```
Crie um script de seed (scripts/seed.ts) que popule:

1. Categorias (5): Frutas, Legumes, Verduras, Temperos, Especiais
2. Produtos (20): usar dados de @dados-moc.md
3. 1 usuário admin (email: admin@levee.com, senha: admin123)
4. 3 usuários clientes (1 de cada categoria: bronze, prata, ouro)

Execute o script e verifique no Supabase Table Editor.
```

---

### Fase 4: Autenticação

**Prompt 7: Implementar Auth**
```
Implemente autenticação completa seguindo @.agent/skills/auth-supabase/skill.md:

1. Páginas de Login e Cadastro com UI do design system
2. Server Actions para login, logout, signup
3. Proteção de rotas no middleware
4. Header com botão de logout (se logado) ou login (se não logado)
5. Teste o fluxo completo:
   - Cadastro → confirmar email → login → dashboard
   - Logout → redirect para home
```

---

### Fase 5: Catálogo (com dados MOC)

**Prompt 8: Criar Catálogo**
```
Crie as páginas de catálogo usando DADOS MOC (sem ainda calcular preço real):

1. Página /produtos:
   - Grid de categorias (cards clicáveis)
   - Seção "Produtos em Destaque" (8 produtos)

2. Página /categoria/[slug]:
   - Grid de ProductCards
   - Filtro de ordenação (menor preço, nome A-Z)
   - Paginação (20 por página)

3. Página /produto/[id]:
   - Imagem grande
   - Nome, descrição, origem, unidade
   - Preço (use $99,99 fixo por enquanto)
   - Seletor de quantidade
   - Botão "Adicionar à Sacola" (ainda não funcional)

IMPORTANTE: Use dados hardcoded de @dados-moc.md para validar visual.
```

---

### Fase 6: Carrinho

**Prompt 9: Implementar Carrinho**
```
Implemente o sistema de carrinho seguindo @.agent/skills/cart-management/skill.md:

1. Setup Zustand store completo
2. AddToCartButton funcional na página de produto
3. Badge no header com contador
4. Página /carrinho:
   - Lista de CartItems
   - Botões de quantidade e remover funcionais
   - Cálculo de subtotal
   - Botão "Finalizar Pedido" (ainda desabilitado)

Teste: adicionar 3 produtos diferentes, atualizar quantidades, remover 1, verificar persistência (refresh da página).
```

---

### Fase 7: Sistema de Preços Real

**Prompt 10: Integrar Cálculo de Preços**
```
Agora conecte o sistema de preços real:

1. Implemente a função calculatePrice de @.agent/skills/pricing-calculator
2. Crie o hook useUserCategory
3. Atualize ProductCard para calcular preço baseado na categoria do usuário logado
4. Teste:
   - Login como Bronze → ver preço X
   - Login como Prata → ver preço 1.04x maior
   - Login como Ouro → ver preço 1.08x maior que Bronze

Certifique-se que o preço no carrinho também usa o preço correto calculado.
```

---

### Fase 8: Checkout

**Prompt 11: Criar Fluxo de Checkout**
```
Implemente o checkout em 3 steps:

1. Step 1 - Entrega (/checkout/entrega):
   - Listar estabelecimentos do usuário (user_establishments)
   - Botão "+ Novo Estabelecimento" (abre modal com form)
   - Radio buttons para selecionar
   - Botão "Continuar"

2. Step 2 - Pagamento (/checkout/pagamento):
   - Mostrar prazo do usuário (buscar de users.payment_term_days)
   - Radio: PIX ou Boleto
   - Info: vencimento = hoje + prazo
   - Botão "Continuar"

3. Step 3 - Confirmação (/checkout/confirmacao):
   - Resumo completo: endereço, pagamento, itens, total
   - Checkbox "Aceito os termos"
   - Botão "Finalizar Pedido"

Ao finalizar: criar order no banco, limpar carrinho, redirect para /pedidos/[id].
```

**Prompt 12: Integrar Pagamento**
```
Integre o gateway de pagamento seguindo @.agent/skills/payment-integration/skill.md:

1. Configure Mercado Pago (SDK)
2. Server Action: generatePayment
3. Após criar order, chame generatePayment
4. Salve dados em payments table
5. Na página /pedidos/[id], mostre:
   - Se PIX: QR code + código copia e cola
   - Se Boleto: botão "Ver Boleto" + código de barras

Configure webhook em /api/webhooks/mercadopago para atualizar status.
```

---

### Fase 9: Admin Panel

**Prompt 13: Criar Admin Dashboard**
```
Crie o admin panel em /admin:

1. Layout separado com navbar: Pedidos | Clientes | Produtos
2. Middleware: só permite role = 'admin'
3. Página /admin/pedidos:
   - Lista todos pedidos (tabela)
   - Filtros: status, período
   - Ações: Aprovar, Cancelar, Atualizar Status

4. Página /admin/clientes:
   - Lista clientes (tabela com busca)
   - Coluna: Categoria (badge colorido)
   - Coluna: Prazo
   - Botão "Editar" (abre modal)
   - Modal: dropdowns para categoria e prazo, botão Salvar

5. Página /admin/produtos:
   - Lista produtos
   - Botão "+ Novo Produto"
   - Form: todos campos do product
   - Upload de imagem para Supabase Storage
   - Mostrar preços calculados (readonly): Bronze / Prata / Ouro
```

---

### Fase 10: Testes e Deploy

**Prompt 14: Testes Finais**
```
Execute os testes do @checklist-validacao.md:

1. Fluxo completo como Cliente Bronze:
   - Cadastro → aprovação admin → login
   - Navegar catálogo → adicionar 3 produtos
   - Checkout → selecionar estabelecimento → boleto
   - Verificar se vencimento = hoje + 7 dias
   - Ver pedido criado

2. Repita com Cliente Ouro (verificar preços diferentes)

3. Admin:
   - Aprovar cliente pendente
   - Mudar categoria de cliente
   - Adicionar novo produto
   - Atualizar status de pedido

Liste TODOS os bugs encontrados.
```

**Prompt 15: Deploy**
```
Prepare para deploy:

1. Build local: npm run build (corrigir erros TypeScript)
2. Teste build: npm start
3. Configure variáveis de ambiente no Vercel/Hostinger
4. Conecte repositório GitHub
5. Deploy
6. Teste em produção com dados reais (usar cartão de teste do Mercado Pago)
```

---

## <a name="dados-moc"></a>📦 9. DADOS MOC PARA TESTES

### Categorias
```json
[
  { "name": "Frutas", "slug": "frutas", "icon": "apple" },
  { "name": "Legumes", "slug": "legumes", "icon": "carrot" },
  { "name": "Verduras", "slug": "verduras", "icon": "leaf" },
  { "name": "Temperos", "slug": "temperos", "icon": "soup" },
  { "name": "Especiais", "slug": "especiais", "icon": "star" }
]
```

### Produtos (20 itens)
```json
[
  {
    "name": "Tomate Italiano",
    "description": "Tomate italiano fresco, ideal para molhos e saladas",
    "cost_price": 6.50,
    "unit": "kg",
    "origin": "Minas Gerais",
    "stock_quantity": 150,
    "category": "Legumes"
  },
  {
    "name": "Alface Crespa",
    "description": "Alface crespa verde, fresquinha",
    "cost_price": 3.20,
    "unit": "maço",
    "origin": "São Paulo",
    "stock_quantity": 80,
    "category": "Verduras"
  },
  {
    "name": "Banana Prata",
    "description": "Banana prata madura, perfeita para consumo",
    "cost_price": 4.80,
    "unit": "kg",
    "origin": "Bahia",
    "stock_quantity": 200,
    "category": "Frutas"
  },
  {
    "name": "Cebola Roxa",
    "description": "Cebola roxa de primeira qualidade",
    "cost_price": 5.00,
    "unit": "kg",
    "origin": "Rio Grande do Sul",
    "stock_quantity": 300,
    "category": "Legumes"
  },
  {
    "name": "Cenoura",
    "description": "Cenoura fresca e crocante",
    "cost_price": 3.80,
    "unit": "kg",
    "origin": "Minas Gerais",
    "stock_quantity": 250,
    "category": "Legumes"
  },
  {
    "name": "Couve Manteiga",
    "description": "Couve manteiga orgânica",
    "cost_price": 2.50,
    "unit": "maço",
    "origin": "Minas Gerais",
    "stock_quantity": 100,
    "category": "Verduras"
  },
  {
    "name": "Laranja Lima",
    "description": "Laranja lima doce e suculenta",
    "cost_price": 4.20,
    "unit": "kg",
    "origin": "São Paulo",
    "stock_quantity": 180,
    "category": "Frutas"
  },
  {
    "name": "Batata Inglesa",
    "description": "Batata inglesa tipo 1",
    "cost_price": 3.50,
    "unit": "kg",
    "origin": "Paraná",
    "stock_quantity": 400,
    "category": "Legumes"
  },
  {
    "name": "Rúcula",
    "description": "Rúcula fresca com sabor marcante",
    "cost_price": 4.00,
    "unit": "maço",
    "origin": "Minas Gerais",
    "stock_quantity": 60,
    "category": "Verduras"
  },
  {
    "name": "Abacaxi Pérola",
    "description": "Abacaxi pérola maduro",
    "cost_price": 5.50,
    "unit": "un",
    "origin": "Pará",
    "stock_quantity": 90,
    "category": "Frutas"
  },
  {
    "name": "Pimentão Verde",
    "description": "Pimentão verde fresco",
    "cost_price": 8.00,
    "unit": "kg",
    "origin": "São Paulo",
    "stock_quantity": 120,
    "category": "Legumes"
  },
  {
    "name": "Alho Roxo",
    "description": "Alho roxo nacional de primeira",
    "cost_price": 25.00,
    "unit": "kg",
    "origin": "Minas Gerais",
    "stock_quantity": 50,
    "category": "Temperos"
  },
  {
    "name": "Limão Taiti",
    "description": "Limão taiti suculento",
    "cost_price": 3.90,
    "unit": "kg",
    "origin": "São Paulo",
    "stock_quantity": 200,
    "category": "Frutas"
  },
  {
    "name": "Cheiro Verde",
    "description": "Maço de cheiro verde (cebolinha e coentro)",
    "cost_price": 1.80,
    "unit": "maço",
    "origin": "Minas Gerais",
    "stock_quantity": 150,
    "category": "Temperos"
  },
  {
    "name": "Morango",
    "description": "Morango fresco e selecionado",
    "cost_price": 12.00,
    "unit": "bandeja 250g",
    "origin": "Minas Gerais",
    "stock_quantity": 40,
    "category": "Especiais"
  },
  {
    "name": "Abobrinha Italiana",
    "description": "Abobrinha italiana verde",
    "cost_price": 5.20,
    "unit": "kg",
    "origin": "São Paulo",
    "stock_quantity": 110,
    "category": "Legumes"
  },
  {
    "name": "Manjericão",
    "description": "Manjericão fresco aromático",
    "cost_price": 3.00,
    "unit": "maço",
    "origin": "Minas Gerais",
    "stock_quantity": 70,
    "category": "Temperos"
  },
  {
    "name": "Mamão Papaya",
    "description": "Mamão papaya maduro",
    "cost_price": 4.50,
    "unit": "un",
    "origin": "Bahia",
    "stock_quantity": 100,
    "category": "Frutas"
  },
  {
    "name": "Gengibre",
    "description": "Gengibre fresco nacional",
    "cost_price": 18.00,
    "unit": "kg",
    "origin": "Paraná",
    "stock_quantity": 30,
    "category": "Temperos"
  },
  {
    "name": "Uva Niagara",
    "description": "Uva niagara rosada",
    "cost_price": 9.80,
    "unit": "kg",
    "origin": "Rio Grande do Sul",
    "stock_quantity": 80,
    "category": "Especiais"
  }
]
```

### Usuários de Teste
```json
[
  {
    "email": "bronze@teste.com",
    "cnpj": "12.345.678/0001-90",
    "razao_social": "Padaria Pão Quente LTDA",
    "nome_fantasia": "Padaria Pão Quente",
    "customer_category": "bronze",
    "payment_term_days": 7
  },
  {
    "email": "prata@teste.com",
    "cnpj": "98.765.432/0001-10",
    "razao_social": "Restaurante Sabor Mineiro LTDA",
    "nome_fantasia": "Rest. Sabor Mineiro",
    "customer_category": "prata",
    "payment_term_days": 14
  },
  {
    "email": "ouro@teste.com",
    "cnpj": "11.222.333/0001-44",
    "razao_social": "Escola Dom Bosco",
    "nome_fantasia": "Escola Dom Bosco",
    "customer_category": "ouro",
    "payment_term_days": 21
  }
]
```

---

## <a name="checklist"></a>✅ 10. CHECKLIST DE VALIDAÇÃO

### Fase 1: Autenticação ✓
- [ ] Cadastro funciona e cria usuário no Supabase
- [ ] Email de confirmação é enviado
- [ ] Login funciona com credenciais corretas
- [ ] Mensagem de erro aparece com credenciais erradas
- [ ] Logout funciona e redirect para home
- [ ] Middleware protege rotas /dashboard/* (redirect para /login se não logado)
- [ ] Middleware redirect /login para /dashboard se já logado

### Fase 2: Catálogo ✓
- [ ] Página /produtos mostra categorias em grid
- [ ] Click em categoria vai para /categoria/[slug]
- [ ] Produtos aparecem em grid responsivo
- [ ] ProductCard mostra imagem, nome, preço, unidade
- [ ] Click em produto vai para /produto/[id]
- [ ] Página de produto mostra todos detalhes
- [ ] Busca no header funciona
- [ ] Resultados da busca aparecem corretamente

### Fase 3: Sistema de Preços ✓
- [ ] Login como Bronze → ver preço X
- [ ] Login como Prata → ver preço 1.04x maior (X × 1.25 / 1.20)
- [ ] Login como Ouro → ver preço 1.08x maior (X × 1.30 / 1.20)
- [ ] Admin vê preço de custo + 3 variações
- [ ] Preço formatado corretamente (R$ 12,50)

### Fase 4: Carrinho ✓
- [ ] Adicionar produto atualiza carrinho
- [ ] Badge do carrinho mostra quantidade correta
- [ ] Página /carrinho lista todos itens
- [ ] Botões +/- atualizam quantidade
- [ ] Botão remover funciona
- [ ] Subtotal calculado corretamente
- [ ] Carrinho persiste após refresh (localStorage)
- [ ] Limpar carrinho funciona

### Fase 5: Estabelecimentos ✓
- [ ] Página /estabelecimentos lista meus pontos
- [ ] Botão "+ Novo" abre form/modal
- [ ] Salvar cria estabelecimento no banco
- [ ] Editar atualiza corretamente
- [ ] Excluir remove do banco
- [ ] Marcar como padrão funciona (desmarca outros)

### Fase 6: Checkout ✓
- [ ] Step 1: lista estabelecimentos, permite selecionar
- [ ] Step 2: mostra prazo do usuário, permite escolher PIX ou Boleto
- [ ] Step 3: resumo completo está correto
- [ ] Finalizar cria order no banco com status 'pending'
- [ ] Order_number gerado automaticamente (LEV-2026-XXXX)
- [ ] Carrinho é limpo após finalizar
- [ ] Redirect para /pedidos/[id]

### Fase 7: Pagamento ✓
- [ ] PIX: QR code é gerado e exibido
- [ ] PIX: código copia e cola funciona
- [ ] Boleto: URL do boleto é gerada
- [ ] Boleto: código de barras copiável
- [ ] Vencimento do boleto = data_pedido + prazo_dias
- [ ] Payment salvo na tabela payments com status 'pending'

### Fase 8: Histórico de Pedidos ✓
- [ ] Dashboard mostra últimos 5 pedidos
- [ ] Página /pedidos lista todos meus pedidos
- [ ] Filtro por período funciona
- [ ] Click em pedido vai para detalhe
- [ ] Detalhe mostra: itens, total, status, pagamento, entrega

### Fase 9: Boletos ✓
- [ ] Página /boletos lista boletos pendentes
- [ ] Tab "Pagos" lista boletos pagos
- [ ] Boletos próximos de vencer (< 3 dias) têm destaque visual
- [ ] Copiar código de barras funciona

### Fase 10: Admin - Clientes ✓
- [ ] Página /admin/clientes lista todos clientes
- [ ] Busca por CNPJ/nome funciona
- [ ] Editar cliente abre modal
- [ ] Mudar categoria atualiza imediatamente
- [ ] Mudar prazo atualiza imediatamente
- [ ] Desativar cliente funciona
- [ ] RLS: admin vê todos, cliente vê só o seu

### Fase 11: Admin - Produtos ✓
- [ ] Lista produtos com busca
- [ ] Adicionar produto funciona
- [ ] Upload de imagem para Supabase Storage funciona
- [ ] Editar produto atualiza no banco
- [ ] Preços calculados (Bronze/Prata/Ouro) mostrados corretamente
- [ ] Desativar produto remove do catálogo público
- [ ] RLS: admin pode CRUD, cliente só read

### Fase 12: Admin - Pedidos ✓
- [ ] Lista todos pedidos de todos clientes
- [ ] Filtro por status funciona
- [ ] Filtro por período funciona
- [ ] Aprovar pedido muda status para 'confirmed'
- [ ] Atualizar status registra em order_status_history
- [ ] Cancelar pedido muda status para 'cancelled'

### Fase 13: Responsividade ✓
- [ ] Header responsivo (mobile menu funciona)
- [ ] Grids de produtos responsivos (1 col mobile, 4 col desktop)
- [ ] Forms usáveis no mobile
- [ ] Checkout funciona no mobile
- [ ] Tabelas do admin scrollam horizontalmente no mobile

### Fase 14: Performance ✓
- [ ] Lighthouse Performance > 90
- [ ] Imagens otimizadas (Next.js Image)
- [ ] Sem erros no console
- [ ] Build sem erros TypeScript
- [ ] Sem warnings críticos

### Fase 15: Segurança ✓
- [ ] RLS policies funcionando
- [ ] Middleware protegendo rotas
- [ ] Env vars não expostas no frontend
- [ ] SQL injection prevenido (uso de Supabase client)
- [ ] XSS prevenido (React escapa por padrão)

---

## 🎯 PRÓXIMOS PASSOS

### Passo 1: Prepare o Ambiente
1. Instale o Google Antigravity
2. Conecte ao GitHub (crie repo vazio)
3. Tenha em mãos as credenciais do Supabase

### Passo 2: Carregue os Arquivos de Contexto
1. Copie este PRD para o projeto
2. Crie a pasta `.agent/skills/` e `.agent/rules/`
3. Crie os arquivos de skill (auth, pricing, cart, payment)
4. Crie o `design-system.md`

### Passo 3: Execute os Prompts Sequencialmente
- Siga a ordem dos prompts da seção 8
- Valide cada fase antes de avançar
- Use o Simple Browser do Antigravity para testar em tempo real

### Passo 4: Teste com Dados Reais
- Após MVP funcionando com dados MOC
- Conecte ao Supabase real
- Teste com gateway de pagamento em sandbox
- Convide 2-3 clientes piloto

### Passo 5: Deploy
- Vercel (mais fácil) ou VPS Hostinger (mais controle)
- Configure env vars de produção
- Teste em produção

---

## 📚 REFERÊNCIAS

- **Metodologia**: Guia Estratégico de Desenvolvimento com Google Antigravity
- **Design System**: Inspirado em Shadcn/ui + Tailwind
- **Arquitetura**: Next.js Best Practices + Supabase Docs
- **Personas**: Pesquisa "Perfil Psicológico Comprador Atacado Hortifruti BH"
- **Mercado**: Pesquisa "App Hortifruti B2B Brasil"

---

**Versão 2.0 Antigravity-Ready - Pronto para Implementação**
**Data: 26/01/2026**
