-- ============================================================
-- Migration: Fix Admin RLS for Products
-- Description: Updates the previous policies on products to also grant full access to 'super_admin'.
-- EXECUTE IN: Supabase SQL Editor
-- ============================================================

-- Drop Previous Policies if they exist (Assuming basic names from past migrations)
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

-- 1. Insert
CREATE POLICY "Admins can insert products" ON public.products
FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin'))
);

-- 2. Update
CREATE POLICY "Admins can update products" ON public.products
FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin'))
);

-- 3. Delete
CREATE POLICY "Admins can delete products" ON public.products
FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin'))
);

-- Reload Schema Cash
NOTIFY pgrst, 'reload schema';
