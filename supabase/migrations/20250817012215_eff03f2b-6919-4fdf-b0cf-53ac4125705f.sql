-- SECURITY FIX - Step 1: Fix existing trigger and clean up orphaned records

-- 1. First, fix the problematic trigger function
CREATE OR REPLACE FUNCTION public.log_sensitive_data_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Log access attempts to sensitive data for security monitoring
  INSERT INTO public.security_audit_logs (
    event_type,
    user_id,
    action,
    resource_type,
    resource_id,
    risk_level,
    metadata
  ) VALUES (
    'data_access',
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_TABLE_NAME = 'payment_transactions' AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN 'high'
      WHEN TG_TABLE_NAME = 'contracts' AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN 'medium'
      WHEN TG_OP IN ('INSERT', 'UPDATE') THEN 'medium'
      WHEN TG_OP = 'DELETE' THEN 'high'
      ELSE 'low'
    END,
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'operation', TG_OP,
      'timestamp', now(),
      'payment_amount', CASE 
        WHEN TG_TABLE_NAME = 'payment_transactions' THEN COALESCE(NEW.amount, OLD.amount)::text
        ELSE NULL
      END,
      'invoice_amount', CASE 
        WHEN TG_TABLE_NAME = 'invoices' THEN COALESCE(NEW.amount, OLD.amount)::text
        ELSE NULL
      END,
      'service_price', CASE 
        WHEN TG_TABLE_NAME = 'contracts' THEN COALESCE(NEW.service_price, OLD.service_price)::text
        ELSE NULL
      END,
      'contract_number', CASE 
        WHEN TG_TABLE_NAME = 'contracts' THEN COALESCE(NEW.contract_number, OLD.contract_number)
        ELSE NULL
      END
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 2. Create backup table for orphaned records (admin review only)
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

DROP POLICY IF EXISTS "Only admins can manage orphaned records backup" ON public.orphaned_records_backup;
CREATE POLICY "Only admins can manage orphaned records backup"
ON public.orphaned_records_backup
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 3. Count and backup orphaned records first
DO $$
DECLARE
    contract_count INTEGER;
    payment_count INTEGER;
BEGIN
    -- Count orphaned records
    SELECT COUNT(*) INTO contract_count FROM public.contracts WHERE user_id IS NULL;
    SELECT COUNT(*) INTO payment_count FROM public.payment_transactions WHERE user_id IS NULL;
    
    -- Log the counts before cleanup
    INSERT INTO public.security_audit_logs (
      event_type,
      user_id,
      action,
      risk_level,
      metadata
    ) VALUES (
      'admin_action',
      auth.uid(),
      'orphaned_records_audit',
      'high',
      jsonb_build_object(
        'contracts_with_null_user_id', contract_count,
        'payments_with_null_user_id', payment_count,
        'timestamp', now()
      )
    );
END
$$;

-- 4. Backup orphaned contract records
INSERT INTO public.orphaned_records_backup (source_table, original_id, record_data)
SELECT 
  'contracts',
  id,
  to_jsonb(contracts.*)
FROM public.contracts
WHERE user_id IS NULL;

-- 5. Backup orphaned payment transaction records  
INSERT INTO public.orphaned_records_backup (source_table, original_id, record_data)
SELECT 
  'payment_transactions', 
  id,
  to_jsonb(payment_transactions.*)
FROM public.payment_transactions
WHERE user_id IS NULL;

-- 6. Delete orphaned records after backing them up
DELETE FROM public.contracts WHERE user_id IS NULL;
DELETE FROM public.payment_transactions WHERE user_id IS NULL;

-- 7. Add NOT NULL constraints
ALTER TABLE public.contracts 
  ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE public.payment_transactions 
  ALTER COLUMN user_id SET NOT NULL;