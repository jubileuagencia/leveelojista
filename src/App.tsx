import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { MainLayout } from '@/components/layout/MainLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'

// Auth pages (not lazy — first paint)
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'

// Lazy-loaded pages
const HomePage = lazy(() => import('@/features/catalog/pages/HomePage'))
const ProductPage = lazy(() => import('@/features/catalog/pages/ProductPage'))
const CartPage = lazy(() => import('@/features/cart/pages/CartPage'))
const FavoritesPage = lazy(() => import('@/features/favorites/pages/FavoritesPage'))
const SearchPage = lazy(() => import('@/features/search/pages/SearchPage'))
const OrdersPage = lazy(() => import('@/features/orders/pages/OrdersPage'))
const OrderDetailsPage = lazy(() => import('@/features/orders/pages/OrderDetailsPage'))
const CheckoutPage = lazy(() => import('@/features/checkout/pages/CheckoutPage'))

// Admin pages
const DashboardPage = lazy(() => import('@/features/admin/pages/DashboardPage'))
const AdminProductsPage = lazy(() => import('@/features/admin/pages/ProductsPage'))
const AdminOrdersPage = lazy(() => import('@/features/admin/pages/OrdersPage'))
const AdminClientsPage = lazy(() => import('@/features/admin/pages/ClientsPage'))
const AdminCategoriesPage = lazy(() => import('@/features/admin/pages/CategoriesPage'))
const AdminConfigPage = lazy(() => import('@/features/admin/pages/ConfigPage'))

const PageFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-pulse text-muted-foreground">Carregando...</div>
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* Auth routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<RegisterPage />} />

            {/* Customer routes */}
            <Route element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="/produto/:id" element={<ProductPage />} />
              <Route path="/carrinho" element={<CartPage />} />
              <Route path="/favoritos" element={<FavoritesPage />} />
              <Route path="/busca" element={<SearchPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/pedidos" element={<OrdersPage />} />
              <Route path="/pedido/:id" element={<OrderDetailsPage />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="produtos" element={<AdminProductsPage />} />
              <Route path="pedidos" element={<AdminOrdersPage />} />
              <Route path="clientes" element={<AdminClientsPage />} />
              <Route path="categorias" element={<AdminCategoriesPage />} />
              <Route path="configuracoes" element={<AdminConfigPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <Toaster richColors position="top-right" />
      </TooltipProvider>
    </BrowserRouter>
  )
}
