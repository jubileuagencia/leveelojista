import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'

interface UseAuthGuardOptions {
  redirectTo?: string
  requireAdmin?: boolean
}

export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const { redirectTo = '/login', requireAdmin = false } = options
  const { user, profile, loading, initialized, initialize } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!initialized) {
      initialize()
    }
  }, [initialized, initialize])

  useEffect(() => {
    if (loading || !initialized) return

    if (!user) {
      navigate(redirectTo, { replace: true })
      return
    }

    if (requireAdmin && profile && profile.role !== 'admin' && profile.role !== 'super_admin') {
      navigate('/', { replace: true })
    }
  }, [user, profile, loading, initialized, navigate, redirectTo, requireAdmin])

  const isAuthenticated = !!user
  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin'
  const isLoading = loading || !initialized

  return { isAuthenticated, isAdmin, isLoading }
}
