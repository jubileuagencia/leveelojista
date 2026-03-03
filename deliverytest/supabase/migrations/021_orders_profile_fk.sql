-- ============================================================
-- Migration: Add Foreign Key from Orders to Profiles (Phase 21)
-- Description: Allows PostgREST to automatically JOIN orders and profiles.
-- EXECUTE IN: Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Add the foreign key relationship
ALTER TABLE public.orders
ADD CONSTRAINT fk_orders_profile
FOREIGN KEY (user_id) 
REFERENCES public.profiles(id)
ON DELETE CASCADE;

-- Clear Schema Cache to make sure PostgREST picks up the new relationship
NOTIFY pgrst, 'reload schema';
