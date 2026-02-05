-- ===========================================
-- SMS OTP Authentication System
-- ===========================================

-- Table: sms_otp_codes
-- Stores OTP codes with hashing and expiration
CREATE TABLE IF NOT EXISTS public.sms_otp_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  otp_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  verified BOOLEAN NOT NULL DEFAULT false,
  verified_at TIMESTAMPTZ,
  ip_address INET,
  user_agent TEXT,
  purpose VARCHAR(50) NOT NULL DEFAULT 'login',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  tenant_id UUID REFERENCES public.tenants(id)
);

-- Index for fast phone lookup
CREATE INDEX IF NOT EXISTS idx_sms_otp_phone ON public.sms_otp_codes(phone);
CREATE INDEX IF NOT EXISTS idx_sms_otp_expires ON public.sms_otp_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_sms_otp_purpose ON public.sms_otp_codes(purpose);

-- Enable RLS
ALTER TABLE public.sms_otp_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Only backend can access (via service role)
CREATE POLICY "Service role full access on sms_otp_codes"
  ON public.sms_otp_codes
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Table: sms_logs
-- Logs all SMS sent for auditing
CREATE TABLE IF NOT EXISTS public.sms_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  message_type VARCHAR(50) NOT NULL,
  message_content TEXT,
  provider VARCHAR(50) NOT NULL DEFAULT 'msegat',
  provider_response JSONB,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  error_message TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  tenant_id UUID REFERENCES public.tenants(id)
);

-- Index for SMS logs
CREATE INDEX IF NOT EXISTS idx_sms_logs_phone ON public.sms_logs(phone);
CREATE INDEX IF NOT EXISTS idx_sms_logs_status ON public.sms_logs(status);
CREATE INDEX IF NOT EXISTS idx_sms_logs_type ON public.sms_logs(message_type);

-- Enable RLS
ALTER TABLE public.sms_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy for sms_logs
CREATE POLICY "Service role full access on sms_logs"
  ON public.sms_logs
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Function: Clean expired OTPs (run via cron)
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.sms_otp_codes
  WHERE expires_at < now() - INTERVAL '1 hour'
    AND verified = false;
END;
$$;

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_sms_otp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS trigger_sms_otp_updated_at ON public.sms_otp_codes;
CREATE TRIGGER trigger_sms_otp_updated_at
  BEFORE UPDATE ON public.sms_otp_codes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_sms_otp_updated_at();