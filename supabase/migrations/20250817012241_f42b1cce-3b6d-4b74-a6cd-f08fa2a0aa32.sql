-- SECURITY FIX - Step 1: Remove problematic triggers and apply basic fixes

-- 1. Drop all existing triggers that might be causing issues
DROP TRIGGER IF EXISTS log_sensitive_data_access_trigger ON public.contracts;
DROP TRIGGER IF EXISTS log_sensitive_data_access_trigger ON public.payment_transactions;
DROP TRIGGER IF EXISTS log_sensitive_data_access_trigger ON public.invoices;

-- 2. Create a simple, safe backup table for orphaned records
CREATE TABLE IF NOT EXISTS public.orphaned_records_backup (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  source_table text NOT NULL,
  original_id uuid,
  record_data jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- 3. Enable RLS on backup table (admin only access)
ALTER TABLE public.orphaned_records_backup ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin only backup access" ON public.orphaned_records_backup;
CREATE POLICY "Admin only backup access"
ON public.orphaned_records_backup
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 4. Log security audit for this cleanup operation
INSERT INTO public.security_audit_logs (
  event_type,
  user_id,
  action,
  risk_level,
  metadata
) VALUES (
  'admin_action',
  auth.uid(),
  'security_hardening_started',
  'high',
  jsonb_build_object(
    'operation', 'orphaned_records_cleanup',
    'timestamp', now()
  )
);

-- 5. Backup and remove orphaned contract records
INSERT INTO public.orphaned_records_backup (source_table, original_id, record_data)
SELECT 
  'contracts',
  id,
  to_jsonb(contracts.*)
FROM public.contracts
WHERE user_id IS NULL;

DELETE FROM public.contracts WHERE user_id IS NULL;

-- 6. Backup and remove orphaned payment transaction records  
INSERT INTO public.orphaned_records_backup (source_table, original_id, record_data)
SELECT 
  'payment_transactions', 
  id,
  to_jsonb(payment_transactions.*)
FROM public.payment_transactions
WHERE user_id IS NULL;

DELETE FROM public.payment_transactions WHERE user_id IS NULL;

-- 7. Add NOT NULL constraints safely
ALTER TABLE public.contracts 
  ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE public.payment_transactions 
  ALTER COLUMN user_id SET NOT NULL;