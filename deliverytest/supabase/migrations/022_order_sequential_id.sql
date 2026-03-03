-- ============================================================
-- Migration: Add Sequential Order Number (Friendly ID)
-- Description: Creates an auto-increment integer ID for orders starting at 10000.
-- EXECUTE IN: Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. Create a sequence starting at 10000 (if you have many orders already, you can start higher)
CREATE SEQUENCE IF NOT EXISTS orders_order_number_seq START WITH 10000;

-- 2. Add the column to the orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS order_number integer NOT NULL DEFAULT nextval('orders_order_number_seq');

-- 3. Make sure the sequence is owned by the column so it drops if the column drops
ALTER SEQUENCE orders_order_number_seq OWNED BY public.orders.order_number;

-- 4. Reload the schema cache for PostgREST
NOTIFY pgrst, 'reload schema';
