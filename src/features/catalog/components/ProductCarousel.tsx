import { useNavigate } from 'react-router-dom'
import { Sparkles, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import {
  ProductCard,
  ProductCardSkeleton,
} from '@/features/catalog/components/ProductCard'
import { useFeaturedProducts } from '@/features/catalog/hooks/useFeaturedProducts'

export interface ProductCarouselProps {
  categoryId: string
  title?: string
  limit?: number
  viewAllHref?: string
  icon?: LucideIcon
  onProductClick?: (productId: string) => void
}

const SKELETON_COUNT = 4

export function ProductCarousel({
  categoryId,
  title = 'Destaques',
  limit = 10,
  viewAllHref,
  icon: Icon = Sparkles,
  onProductClick,
}: ProductCarouselProps) {
  const navigate = useNavigate()
  const { products, loading, error } = useFeaturedProducts(categoryId, limit)

  if (error) return null
  if (!loading && products.length === 0) return null

  const handleNavigate = (productId: string) => {
    if (onProductClick) onProductClick(productId)
    else navigate(`/produto/${productId}`)
  }

  return (
    <section
      aria-label={title}
      className="mx-auto max-w-7xl px-4 md:px-6 pt-2 pb-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className="size-4 text-amber-500" aria-hidden="true" />
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {viewAllHref && (
          <Link
            to={viewAllHref}
            className="ml-auto text-xs text-primary hover:underline whitespace-nowrap"
          >
            Ver todos &rarr;
          </Link>
        )}
      </div>

      <Carousel
        opts={{ align: 'start', loop: false, dragFree: false }}
        className="group relative"
      >
        <CarouselContent>
          {loading
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <CarouselItem
                  key={`sk-${i}`}
                  className="basis-[66%] sm:basis-[40%] md:basis-1/3 lg:basis-1/4 [&>*]:h-full"
                >
                  <ProductCardSkeleton />
                </CarouselItem>
              ))
            : products.map((product, index) => (
                <CarouselItem
                  key={product.id}
                  aria-label={`Produto ${index + 1} de ${products.length}`}
                  className="basis-[66%] sm:basis-[40%] md:basis-1/3 lg:basis-1/4 [&>*]:h-full"
                >
                  <ProductCard product={product} onNavigate={handleNavigate} />
                </CarouselItem>
              ))}
        </CarouselContent>

        {!loading && products.length > 1 && (
          <>
            <CarouselPrevious className="-left-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CarouselNext className="-right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
          </>
        )}
      </Carousel>
    </section>
  )
}
