import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'
import { useFavoritesStore } from '@/features/favorites/stores/favorites-store'
import {
  ProductCard,
  ProductCardSkeleton,
} from '@/features/catalog/components/ProductCard'

export default function FavoritesPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { favorites, loading, fetchFavorites } = useFavoritesStore()

  useEffect(() => {
    if (user && favorites.length === 0) {
      fetchFavorites(user.id)
    }
  }, [user, favorites.length, fetchFavorites])

  const handleNavigateToProduct = useCallback(
    (productId: string) => {
      navigate(`/produto/${productId}`)
    },
    [navigate]
  )

  const favoritesWithProduct = favorites.filter((f) => f.product)

  return (
    <div className="bg-background pb-4">
      {/* Sticky header */}
      <div className="sticky top-14 md:top-16 z-20 flex items-center gap-3 bg-background/95 backdrop-blur-sm border-b px-4 py-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="size-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-base font-semibold">Favoritos</h1>
          {!loading && favoritesWithProduct.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {favoritesWithProduct.length}{' '}
              {favoritesWithProduct.length === 1
                ? 'produto favoritado'
                : 'produtos favoritados'}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-4">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            /* Loading state */
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : favoritesWithProduct.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-8">
              <div className="flex size-24 items-center justify-center rounded-full bg-muted">
                <Heart className="size-12 text-muted-foreground/50" />
              </div>
              <div className="text-center space-y-1">
                <h2 className="text-xl font-semibold">
                  Nenhum favorito ainda
                </h2>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Explore o catalogo e marque seus produtos favoritos
                </p>
              </div>
              <Button onClick={() => navigate('/')} className="gap-2">
                Explorar catalogo
              </Button>
            </div>
          ) : (
            /* Favorites grid */
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {favoritesWithProduct.map((favorite) => (
                <ProductCard
                  key={favorite.id}
                  product={favorite.product!}
                  onNavigate={handleNavigateToProduct}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
