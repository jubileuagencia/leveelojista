import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import { useAuthStore } from '@/stores/auth-store'
import { useCartStore } from '@/stores/cart-store'

export function MainLayout() {
  const navigate = useNavigate()
  const { user, profile, loading, initialized, initialize } = useAuthStore()
  const fetchCart = useCartStore((s) => s.fetchCart)

  // Initialize auth on mount
  useEffect(() => {
    initialize()
  }, [initialize])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (initialized && !loading && !user) {
      navigate('/login', { replace: true })
    }
  }, [initialized, loading, user, navigate])

  // Fetch cart when user is available
  useEffect(() => {
    if (user?.id) {
      fetchCart(user.id)
    }
  }, [user?.id, fetchCart])

  // Show loading skeleton while initializing
  if (!initialized || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="text-2xl font-bold tracking-tight text-emerald-600">
            Levee
          </span>
          <div className="size-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
        </div>
      </div>
    )
  }

  // Don't render layout if not authenticated
  if (!user || !profile) {
    return null
  }

  return (
    <div className="bg-muted/30 min-h-screen">
      <Header />

      <div className="flex">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="min-w-0 min-h-[calc(100vh-3.5rem)] flex-1 overflow-x-clip md:min-h-[calc(100vh-4rem)] pb-16 md:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
