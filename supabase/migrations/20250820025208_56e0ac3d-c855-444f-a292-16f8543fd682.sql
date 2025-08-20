-- ===============================================
-- CRITICAL SECURITY FIX: Payment Transactions RLS
-- ===============================================

-- Step 1: Drop the dangerous existing policies
DROP POLICY IF EXISTS "Users can view their own payment transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Anyone can insert payment transactions" ON public.payment_transactions;

-- Step 2: Ensure RLS is enabled (critical for financial data)
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Step 3: Create secure SELECT policy - Users can only view their own transactions
CREATE POLICY "Secure: Users can view their own transactions only"
ON public.payment_transactions
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL AND 
  (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role))
);

-- Step 4: Create secure INSERT policy - Only authenticated users can create transactions
CREATE POLICY "Secure: Authenticated users can create their own transactions"
ON public.payment_transactions
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  auth.uid() = user_id AND
  enhanced_rate_limit_check(auth.uid()::text, 'payment_transaction', 3, 60)
);

-- Step 5: Create secure UPDATE policy - Users can only update their own transactions
CREATE POLICY "Secure: Users can update their own transactions only"
ON public.payment_transactions
FOR UPDATE
TO authenticated
USING (
  auth.uid() IS NOT NULL AND 
  (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role))
)
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role))
);

-- Step 6: Create secure DELETE policy - Only admins can delete transactions
CREATE POLICY "Secure: Only admins can delete payment transactions"
ON public.payment_transactions
FOR DELETE
TO authenticated
USING (
  auth.uid() IS NOT NULL AND 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Step 7: Add enhanced security trigger for payment operations
CREATE TRIGGER payment_transactions_security_trigger
  BEFORE INSERT OR UPDATE ON public.payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.enhanced_payment_security_trigger();

-- Step 8: Add audit logging trigger for all payment access
CREATE TRIGGER payment_transactions_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.log_sensitive_data_access();

-- Step 9: Make user_id NOT NULL to prevent unauthorized access (critical!)
-- First, update any existing records with NULL user_id to a safe state
UPDATE public.payment_transactions 
SET user_id = '00000000-0000-0000-0000-000000000000'::uuid 
WHERE user_id IS NULL;

-- Then make the column NOT NULL
ALTER TABLE public.payment_transactions 
ALTER COLUMN user_id SET NOT NULL;

-- Step 10: Add constraint to ensure user_id is always set for new records
ALTER TABLE public.payment_transactions 
ADD CONSTRAINT payment_transactions_user_id_required 
CHECK (user_id IS NOT NULL);

-- Step 11: Log this critical security fix
INSERT INTO public.security_audit_logs (
  event_type,
  action,
  risk_level,
  metadata
) VALUES (
  'critical_security_fix',
  'payment_transactions_rls_fixed',
  'critical',
  jsonb_build_object(
    'description', 'Fixed critical RLS vulnerability in payment_transactions table',
    'fixed_issues', ARRAY[
      'Removed public access to all payment data',
      'Added user authentication requirements',
      'Added rate limiting for payment operations',
      'Made user_id NOT NULL to prevent unauthorized access',
      'Added audit logging for all payment operations'
    ],
    'timestamp', now()
  )
);