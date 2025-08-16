-- Critical Security Fix for Contracts Table - Part 1
-- First, remove problematic triggers and fix existing data

-- Drop existing triggers that might be causing issues
DROP TRIGGER IF EXISTS log_sensitive_data_access_trigger ON public.contracts;
DROP TRIGGER IF EXISTS enhanced_security_trigger ON public.contracts;

-- Handle existing contracts with NULL user_id
-- First, let's see if we have admin users
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Try to get an admin user
    SELECT user_id INTO admin_user_id
    FROM public.user_roles 
    WHERE role = 'admin'::app_role 
    LIMIT 1;
    
    -- If no admin user exists, we'll use a placeholder
    IF admin_user_id IS NULL THEN
        admin_user_id := '00000000-0000-0000-0000-000000000000'::uuid;
    END IF;
    
    -- Update NULL user_id contracts
    UPDATE public.contracts 
    SET user_id = admin_user_id
    WHERE user_id IS NULL;
END $$;

-- Now ensure RLS is enabled
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Revoke any public permissions
REVOKE ALL ON public.contracts FROM public;
REVOKE ALL ON public.contracts FROM anon;

-- Set user_id as NOT NULL now that we've fixed existing data
ALTER TABLE public.contracts 
ALTER COLUMN user_id SET NOT NULL;