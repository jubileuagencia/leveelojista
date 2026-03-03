-- ============================================================
-- Migration: Fix Admin RLS for Orders and Order Items
-- Description: Updates the previous policies to also grant full access to 'super_admin'.
-- EXECUTE IN: Supabase SQL Editor
-- ============================================================

-- Drop Previous Policies if they exist
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can delete orders" ON public.orders;

-- 1. Orders Table: Allow Admins/Super Admins to Update Orders
CREATE POLICY "Admins can update orders" ON public.orders
FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin'))
);

-- 2. Ensure Admins/Super Admins can also read all orders
CREATE POLICY "Admins can view all orders" ON public.orders
FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin'))
);

-- 3. Also grant Delete access in case of Administrative Cancellations/Cleanups
CREATE POLICY "Admins can delete orders" ON public.orders
FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'super_admin'))
);

-- Reload Schema Cash
NOTIFY pgrst, 'reload schema';
