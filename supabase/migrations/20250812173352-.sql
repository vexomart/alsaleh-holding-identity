-- Fix critical security issue: Payment transactions RLS policies
-- Remove public access to payment transaction data

-- 1. Drop existing insecure RLS policies
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "System can update payment transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Anyone can insert payment transactions" ON public.payment_transactions;

-- 2. Create secure RLS policies

-- Policy for users to view only their own transactions (remove NULL user_id access)
CREATE POLICY "Users can view their own transactions" ON public.payment_transactions
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Policy for authenticated users to create transactions (must set their own user_id)
CREATE POLICY "Authenticated users can create transactions" ON public.payment_transactions
FOR INSERT 
WITH CHECK (
  (auth.uid() = user_id AND auth.uid() IS NOT NULL) OR 
  has_role(auth.uid(), 'admin'::app_role) OR
  user_id IS NULL -- Allow system/edge functions to create transactions without user_id initially
);

-- Policy for system/admin to update transactions (more restrictive)
CREATE POLICY "System can update transactions" ON public.payment_transactions
FOR UPDATE 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  -- Allow updates only if the transaction belongs to the current user
  (auth.uid() = user_id AND auth.uid() IS NOT NULL)
);

-- Policy for admins to delete transactions if needed
CREATE POLICY "Admins can delete transactions" ON public.payment_transactions
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Create index for better performance on user_id lookups
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON public.payment_transactions(user_id);

-- 4. Update any existing transactions without user_id to be properly secured
-- Note: Transactions without user_id will only be accessible by admins
-- Edge functions should set user_id when creating transactions for authenticated users