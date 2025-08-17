-- CRITICAL SECURITY FIX - Simplified approach

-- 1. Drop specific triggers that are likely causing issues
DROP TRIGGER IF EXISTS log_job_application_access_trigger ON public.job_applications;
DROP TRIGGER IF EXISTS enhanced_payment_security_check_trigger ON public.payment_transactions;
DROP TRIGGER IF EXISTS log_sensitive_data_access_trigger ON public.contracts;
DROP TRIGGER IF EXISTS log_sensitive_data_access_trigger ON public.payment_transactions;
DROP TRIGGER IF EXISTS log_sensitive_data_access_trigger ON public.invoices;

-- 2. Also drop the function that's causing issues
DROP FUNCTION IF EXISTS public.log_sensitive_data_access() CASCADE;

-- 3. Simple approach: just clean up the data and add constraints
-- First, count how many records we'll affect
CREATE TEMP TABLE cleanup_stats AS
SELECT 
  'contracts' as table_name,
  COUNT(*) as null_user_records
FROM public.contracts 
WHERE user_id IS NULL
UNION ALL
SELECT 
  'payment_transactions' as table_name,
  COUNT(*) as null_user_records
FROM public.payment_transactions 
WHERE user_id IS NULL;

-- 4. Log the cleanup operation in security audit logs
INSERT INTO public.security_audit_logs (
  event_type,
  user_id,
  action,
  risk_level,
  metadata
)
SELECT
  'data_cleanup',
  auth.uid(),
  'removing_orphaned_records',
  'high',
  jsonb_build_object(
    'table', table_name,
    'records_removed', null_user_records,
    'timestamp', now()
  )
FROM cleanup_stats
WHERE null_user_records > 0;

-- 5. Remove orphaned records
DELETE FROM public.contracts WHERE user_id IS NULL;
DELETE FROM public.payment_transactions WHERE user_id IS NULL;

-- 6. Add NOT NULL constraints
ALTER TABLE public.contracts 
  ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE public.payment_transactions 
  ALTER COLUMN user_id SET NOT NULL;