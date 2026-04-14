import { useEffect, useState } from 'react'
import { getProducts } from '@/features/catalog/services/products'
import type { Product } from '@/types/database'

export function useFeaturedProducts(categoryId: string, limit = 10) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)

    getProducts({ categoryId, limit })
      .then((data) => {
        if (mounted) setProducts(data)
      })
      .catch((e: unknown) => {
        if (mounted) {
          const err = e instanceof Error ? e : new Error(String(e))
          console.error('useFeaturedProducts:', err)
          setError(err)
        }
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [categoryId, limit])

  return { products, loading, error }
}
