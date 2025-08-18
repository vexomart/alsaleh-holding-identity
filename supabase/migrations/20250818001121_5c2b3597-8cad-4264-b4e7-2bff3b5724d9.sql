-- Fix critical security vulnerability: Remove anonymous access to customer order data
-- Drop the problematic policy that allows anonymous users to view orders
DROP POLICY IF EXISTS "Users can view their own orders" ON public.product_orders;

-- Create a secure policy that only allows authenticated users to view their own orders
CREATE POLICY "Authenticated users can view their own orders" 
ON public.product_orders 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role))
);

-- Also fix the INSERT policy to require authentication for order creation
DROP POLICY IF EXISTS "Users can create orders" ON public.product_orders;

-- Create secure INSERT policy that requires authentication
CREATE POLICY "Authenticated users can create orders" 
ON public.product_orders 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND (user_id = auth.uid() OR user_id IS NULL)
);

-- For guest orders (where user_id might be NULL), create a separate service-only policy
CREATE POLICY "Service can create guest orders" 
ON public.product_orders 
FOR INSERT 
WITH CHECK (
  (auth.jwt() ->> 'role'::text) = 'service_role'::text
);