import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Package } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useAuthStore } from '@/stores/auth-store'
import { getUserOrders } from '@/features/orders/services/orders'
import { OrderCard, OrderCardSkeleton } from '@/features/orders/components/OrderCard'
import type { Order, OrderStatus } from '@/types/database'

const PAGE_SIZE = 10

const IN_PROGRESS_STATUSES: OrderStatus[] = ['pending', 'approved', 'preparing', 'shipped']
const DELIVERED_STATUSES: OrderStatus[] = ['delivered']

type TabValue = 'todos' | 'andamento' | 'entregues'

function filterOrders(orders: Order[], tab: TabValue): Order[] {
  switch (tab) {
    case 'andamento':
      return orders.filter((o) => IN_PROGRESS_STATUSES.includes(o.status))
    case 'entregues':
      return orders.filter((o) => DELIVERED_STATUSES.includes(o.status))
    default:
      return orders
  }
}

export default function OrdersPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  const [orders, setOrders] = useState<Order[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [activeTab, setActiveTab] = useState<TabValue>('todos')

  const fetchOrders = useCallback(async (pageNum: number, append = false) => {
    if (!user?.id) return

    try {
      if (append) {
        setLoadingMore(true)
      } else {
        setLoading(true)
      }

      const { orders: data, totalCount: total } = await getUserOrders(
        user.id,
        pageNum,
        PAGE_SIZE
      )

      if (append) {
        setOrders((prev) => [...prev, ...data])
      } else {
        setOrders(data)
      }
      setTotalCount(total)
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Erro ao carregar pedidos')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [user?.id])

  useEffect(() => {
    setPage(1)
    fetchOrders(1)
  }, [fetchOrders])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchOrders(nextPage, true)
  }

  const filteredOrders = filterOrders(orders, activeTab)
  const hasMore = orders.length < totalCount

  return (
    <div className="bg-background pb-4">
      {/* Sticky header */}
      <div className="sticky top-14 md:top-16 z-20 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="size-5" />
          </Button>
          <h1 className="text-lg font-semibold">Meus Pedidos</h1>
        </div>

        {/* Tabs */}
        <div className="px-4 pb-2">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as TabValue)}
          >
            <TabsList className="w-full">
              <TabsTrigger value="todos" className="flex-1">
                Todos
              </TabsTrigger>
              <TabsTrigger value="andamento" className="flex-1">
                Em andamento
              </TabsTrigger>
              <TabsTrigger value="entregues" className="flex-1">
                Entregues
              </TabsTrigger>
            </TabsList>

            {/* These TabsContent containers are needed for proper Tabs behavior but content is rendered below */}
            <TabsContent value="todos" />
            <TabsContent value="andamento" />
            <TabsContent value="entregues" />
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 pt-4">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <OrderCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 px-8">
            <div className="flex size-24 items-center justify-center rounded-full bg-muted">
              <Package className="size-12 text-muted-foreground/50" />
            </div>
            <div className="text-center space-y-1">
              <h2 className="text-xl font-semibold">Nenhum pedido encontrado</h2>
              <p className="text-sm text-muted-foreground">
                {activeTab === 'todos'
                  ? 'Voce ainda nao fez nenhum pedido.'
                  : activeTab === 'andamento'
                    ? 'Nenhum pedido em andamento no momento.'
                    : 'Nenhum pedido entregue ainda.'}
              </p>
            </div>
            {activeTab === 'todos' && (
              <Button onClick={() => navigate('/')} variant="outline">
                Ver catalogo
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}

            {/* Load more */}
            {hasMore && activeTab === 'todos' && (
              <div className="flex justify-center pt-4 pb-2">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="w-full max-w-xs"
                >
                  {loadingMore ? 'Carregando...' : 'Carregar mais'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
