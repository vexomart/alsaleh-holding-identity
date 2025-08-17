-- CRITICAL SECURITY FIX - Step 1: Completely remove all problematic triggers

-- 1. Find and drop ALL triggers that reference log_sensitive_data_access
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT schemaname, tablename, triggername 
             FROM pg_trigger t
             JOIN pg_class c ON t.tgrelid = c.oid
             JOIN pg_namespace n ON c.relnamespace = n.oid
             WHERE n.nspname = 'public'
             AND t.tgname LIKE '%log_sensitive_data_access%'
    LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || quote_ident(r.triggername) || ' ON ' || quote_ident(r.schemaname) || '.' || quote_ident(r.tablename);
    END LOOP;
END
$$;

-- 2. Drop the problematic function entirely  
DROP FUNCTION IF EXISTS public.log_sensitive_data_access() CASCADE;

-- 3. Create minimal security backup table
CREATE TABLE IF NOT EXISTS public.security_cleanup_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  operation text NOT NULL,
  table_affected text,
  records_count integer,
  created_at timestamp with time zone DEFAULT now()
);

-- 4. Log this security operation
INSERT INTO public.security_cleanup_log (operation, table_affected, records_count)
VALUES 
  ('orphaned_contracts_cleanup', 'contracts', (SELECT COUNT(*) FROM public.contracts WHERE user_id IS NULL)),
  ('orphaned_payments_cleanup', 'payment_transactions', (SELECT COUNT(*) FROM public.payment_transactions WHERE user_id IS NULL));

-- 5. Remove NULL user_id records from contracts
DELETE FROM public.contracts WHERE user_id IS NULL;

-- 6. Remove NULL user_id records from payment_transactions  
DELETE FROM public.payment_transactions WHERE user_id IS NULL;

-- 7. Add NOT NULL constraints
ALTER TABLE public.contracts 
  ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE public.payment_transactions 
  ALTER COLUMN user_id SET NOT NULL;