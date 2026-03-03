# 🗄️ Database Schema (Verified v0.10)

Esquema atual do banco de dados (Public Schema), verificado em 14/02/2026.

## Tabela: `app_config`
Armazena configurações globais do aplicativo (ex: descontos).
*   `id` (uuid, PK)
*   `key` (text, Unique) - Chave da configuração (ex: 'tier_discounts')
*   `value` (jsonb) - Valor JSON
*   `created_at` (timestamp, Default: now())

## Tabela: `categories`
Categorias de produtos.
*   `id` (uuid, PK)
*   `name` (text) - Nome da categoria
*   `icon` (text) - Ícone representativo
*   `color` (text) - Cor hex
*   `created_at` (timestamp)

## Tabela: `products`
Catálogo de produtos.
*   `id` (uuid, PK)
*   `name` (text)
*   `description` (text)
*   `price` (numeric)
*   `unit` (text, Default: 'un') - Unidade de medida ('un', 'kg', 'cx', 'maco', 'dz')
*   `image_url` (text)
*   `category_id` (uuid, FK -> categories.id)
*   `is_active` (boolean, Default: true) - Status visibilidade
*   `deleted_at` (timestamp) - Soft Delete (se preenchido, produto foi excluído)
*   `display_id` (integer, Auto-Inc) - ID Amigável para exibição
*   `created_at` (timestamp)

## Tabela: `profiles`
Dados estendidos do usuário (após Auth).
*   `id` (uuid, PK, FK -> auth.users.id)
*   `company_name` (text) - Razão Social / Nome Fantasia
*   `cnpj` (text)
*   `phone` (text)
*   `tier` (text) - Nível de fidelidade ('bronze', 'silver', 'gold')
*   `role` (text) - Função do usuário ('customer', 'admin') [NEW]
*   `created_at` (timestamp)

## Tabela: `user_addresses`
Endereços de entrega dos usuários.
*   `id` (uuid, PK)
*   `user_id` (uuid, FK -> auth.users.id)
*   `zip_code` (text)
*   `street` (text)
*   `number` (text)
*   `district` (text)
*   `city` (text)
*   `state` (text)
*   `is_main` (boolean) - Define se é a "Sede"
*   `created_at` (timestamp)

## Tabela: `orders`
Pedidos realizados.
*   `id` (uuid, PK)
*   `order_number` (integer, Auto-Inc) - ID Amigável (Começa em 1000) [NEW]
*   `user_id` (uuid, FK -> profiles.id) [NEW FK]
*   `status` (enum) - 'pending', 'approved', 'preparing', 'shipped', 'delivered', 'rejected', 'cancelled'
*   `payment_method` (enum) - 'pix', 'boleto'
*   `subtotal` (numeric)
*   `discount` (numeric)
*   `total` (numeric)
*   `address_id` (uuid, FK -> user_addresses.id)
*   `created_at` (timestamp)

## Tabela: `order_items`
Itens dentro de um pedido (Snapshot).
*   `id` (uuid, PK)
*   `order_id` (uuid, FK -> orders.id)
*   `product_id` (uuid, FK -> products.id)
*   `quantity` (integer)
*   `unit_price` (numeric) - Preço unitário no momento da compra
*   `total_price` (numeric) - Total da linha
*   `created_at` (timestamp)

---
*Gerado automaticamente em 2026-02-06. Atualizado em 2026-02-13. Mantenha atualizado.*

## Tabela: `cart_items`
Itens no carrinho de compras do usuário logado.
*   `id` (uuid, PK)
*   `user_id` (uuid, FK -> auth.users.id)
*   `product_id` (uuid, FK -> products.id)
*   `quantity` (integer, Default: 1) - Quantidade do produto
*   `created_at` (timestamp, Default: now())
*   **Unique**: (`user_id`, `product_id`) — Um item por produto por usuário

## Tabela: `favorites`
Produtos marcados como favoritos pelo usuário.
*   `id` (uuid, PK)
*   `user_id` (uuid, FK -> auth.users.id)
*   `product_id` (uuid, FK -> products.id)
*   `created_at` (timestamp, Default: now())
*   **Unique**: (`user_id`, `product_id`) — Um favorito por produto por usuário
