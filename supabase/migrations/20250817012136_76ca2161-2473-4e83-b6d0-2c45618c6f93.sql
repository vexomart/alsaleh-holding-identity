-- SECURITY FIX - Step 1: Clean up NULL user_id records before applying constraints

-- First, let's identify and handle NULL user_id records safely
-- We'll update records where possible or create a backup for manual review

-- 1. Create a backup table for orphaned records (admin review)
CREATE TABLE IF NOT EXISTS public.orphaned_records_backup (
  id uuid DEFAULT gen_random_uuid(),
  source_table text NOT NULL,
  original_id uuid,
  record_data jsonb,
  created_at timestamp with time zone DEFAULT now(),
  reviewed boolean DEFAULT false,
  action_taken text
);

-- Enable RLS on backup table (admin only)
ALTER TABLE public.orphaned_records_backup ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can manage orphaned records backup"
ON public.orphaned_records_backup
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2. Backup orphaned contract records
INSERT INTO public.orphaned_records_backup (source_table, original_id, record_data)
SELECT 
  'contracts',
  id,
  to_jsonb(contracts.*) - 'id'
FROM public.contracts
WHERE user_id IS NULL;

-- 3. Backup orphaned payment transaction records  
INSERT INTO public.orphaned_records_backup (source_table, original_id, record_data)
SELECT 
  'payment_transactions', 
  id,
  to_jsonb(payment_transactions.*) - 'id'
FROM public.payment_transactions
WHERE user_id IS NULL;

-- 4. Log security events for orphaned records cleanup
INSERT INTO public.security_audit_logs (
  event_type,
  user_id,
  action,
  risk_level,
  metadata
) VALUES (
  'admin_action',
  auth.uid(),
  'orphaned_records_backup_created',
  'high',
  jsonb_build_object(
    'contracts_backed_up', (SELECT COUNT(*) FROM public.contracts WHERE user_id IS NULL),
    'payments_backed_up', (SELECT COUNT(*) FROM public.payment_transactions WHERE user_id IS NULL),
    'timestamp', now()
  )
);

-- 5. For now, we'll delete the orphaned records after backing them up
-- Admins can review the backup table and manually restore legitimate records
DELETE FROM public.contracts WHERE user_id IS NULL;
DELETE FROM public.payment_transactions WHERE user_id IS NULL;

-- 6. Now we can safely add the NOT NULL constraints
ALTER TABLE public.contracts 
  ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE public.payment_transactions 
  ALTER COLUMN user_id SET NOT NULL;