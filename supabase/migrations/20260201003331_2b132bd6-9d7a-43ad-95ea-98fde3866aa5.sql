-- PHASE NAFATH-1: Database Schema for Nafath Integration

-- 1. Create nafath_identities table
CREATE TABLE public.nafath_identities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES public.tenants(id) ON DELETE SET NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  nafath_sub text UNIQUE NOT NULL,
  national_id text UNIQUE NOT NULL,
  raw_claims_json jsonb,
  verified_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Create nafath_states table for CSRF protection
CREATE TABLE public.nafath_states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state_token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  used boolean DEFAULT false,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Add KYC fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_kyc_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS kyc_provider text,
ADD COLUMN IF NOT EXISTS kyc_verified_at timestamptz,
ADD COLUMN IF NOT EXISTS national_id text;

-- 4. Create indexes for performance
CREATE INDEX idx_nafath_identities_user_id ON public.nafath_identities(user_id);
CREATE INDEX idx_nafath_identities_national_id ON public.nafath_identities(national_id);
CREATE INDEX idx_nafath_states_token ON public.nafath_states(state_token);
CREATE INDEX idx_nafath_states_expires ON public.nafath_states(expires_at);
CREATE INDEX idx_profiles_national_id ON public.profiles(national_id);

-- 5. Enable RLS
ALTER TABLE public.nafath_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nafath_states ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for nafath_identities
-- Users can only read their own identity
CREATE POLICY "Users can view own nafath identity"
ON public.nafath_identities FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Admins can view all identities in their tenant
CREATE POLICY "Admins can view tenant nafath identities"
ON public.nafath_identities FOR SELECT
TO authenticated
USING (
  public.is_admin(auth.uid(), tenant_id)
);

-- Service role can insert/update (for edge functions)
CREATE POLICY "Service role full access nafath_identities"
ON public.nafath_identities FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 7. RLS Policies for nafath_states
-- Service role only (states are managed by edge functions)
CREATE POLICY "Service role full access nafath_states"
ON public.nafath_states FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 8. Cleanup function for expired states
CREATE OR REPLACE FUNCTION public.cleanup_expired_nafath_states()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  DELETE FROM public.nafath_states 
  WHERE expires_at < now() - interval '1 hour';
END;
$$;