-- ============================================================
-- Migration: Admin RLS for Orders and Order Items
-- Description: Grants users with the 'admin' role permission to UPDATE orders 
--              (allowing status changes) and FULL ACCESS to order management.
-- EXECUTE IN: Supabase SQL Editor
-- ============================================================

-- 1. Orders Table: Allow Admins to Update Orders (for Status Changes, etc)
CREATE POLICY "Admins can update orders" ON public.orders
FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- 2. Ensure Admins can also read all orders (just in case they couldn't before)
-- Note: 'get_admin_clients' uses SECURITY DEFINER, but direct table queries in frontend need this
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders" ON public.orders
FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- 3. Also grant Delete access in case of Administrative Cancellations/Cleanups
CREATE POLICY "Admins can delete orders" ON public.orders
FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Reload Schema Cash
NOTIFY pgrst, 'reload schema';
