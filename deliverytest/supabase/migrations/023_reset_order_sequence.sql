-- ============================================================
-- Migration: Reset Order Sequence and Adapt Existing Orders
-- Description: Updates existing orders to start from 1000 based on creation date
--              and restarts the sequence correctly.
-- EXECUTE IN: Supabase SQL Editor
-- ============================================================

-- 1. Update existing orders to have sequential numbers starting from 1000
WITH numbered_orders AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) + 999 AS new_number
    FROM public.orders
)
UPDATE public.orders
SET order_number = numbered_orders.new_number
FROM numbered_orders
WHERE public.orders.id = numbered_orders.id;

-- 2. Restart sequence to continue from the highest number 
-- (or 1000 if the table happens to be empty)
SELECT setval(
    'orders_order_number_seq', 
    COALESCE((SELECT MAX(order_number) FROM public.orders), 999) + 1, 
    false
);

-- 3. Notify PostgREST to ensure cache is good
NOTIFY pgrst, 'reload schema';
