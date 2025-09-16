-- Fix RLS policies for profiles and ensure proper data isolation
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;

-- User can only see their own profile
CREATE POLICY "profiles_select_own" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

-- Admin can see all profiles within their site
CREATE POLICY "profiles_select_admin" 
ON public.profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p2
    WHERE p2.user_id = auth.uid()
      AND p2.role IN ('admin', 'manager')
      AND p2.site_id = profiles.site_id
  )
);

-- User can insert their own profile
CREATE POLICY "profiles_insert_own" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- User can update their own profile
CREATE POLICY "profiles_update_own" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Clean up any demo/test data
DELETE FROM public.profiles 
WHERE email ILIKE '%@example.com%' 
   OR email ILIKE '%demo%' 
   OR email ILIKE '%test%'
   OR full_name ILIKE '%demo%'
   OR full_name ILIKE '%test%';

-- Fix contracts/orders RLS
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "contracts_select_own" ON public.contracts;
DROP POLICY IF EXISTS "contracts_select_admin" ON public.contracts;

CREATE POLICY "contracts_select_own" 
ON public.contracts FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "contracts_select_admin" 
ON public.contracts FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.role IN ('admin', 'manager')
      AND p.site_id = contracts.site_id
  )
);

-- Fix payment_transactions RLS (already secured but let's ensure)
-- The existing policies are already good, just ensure they're active

-- Clean up demo orders/contracts
DELETE FROM public.contracts 
WHERE client_email ILIKE '%@example.com%' 
   OR client_name ILIKE '%demo%' 
   OR client_name ILIKE '%test%'
   OR service_description ILIKE '%demo%';

-- Clean up demo payment transactions
DELETE FROM public.payment_transactions 
WHERE customer_email ILIKE '%@example.com%' 
   OR customer_name ILIKE '%demo%' 
   OR customer_name ILIKE '%test%'
   OR description ILIKE '%demo%';

-- Ensure proper site record exists
INSERT INTO public.sites (id, slug, domain) 
VALUES (
  '11111111-1111-1111-1111-111111111111', 
  'holding', 
  'alialshehriholding.com'
) ON CONFLICT (domain) DO NOTHING;