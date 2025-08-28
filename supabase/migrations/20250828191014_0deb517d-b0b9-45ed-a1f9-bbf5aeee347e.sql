-- Create security_audit_logs table that's missing
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid,
  resource_id uuid,
  ip_address inet,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  event_type text NOT NULL,
  resource_type text,
  action text NOT NULL,
  user_agent text,
  risk_level text DEFAULT 'low'
);

-- Enable RLS on security_audit_logs
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for security_audit_logs
CREATE POLICY "Admins can view security audit logs" 
ON public.security_audit_logs 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can insert security audit logs" 
ON public.security_audit_logs 
FOR INSERT 
WITH CHECK (
  (auth.jwt() ->> 'role') = 'service_role' OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Create missing rate_limits table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier text NOT NULL,
  action_type text NOT NULL,
  count integer NOT NULL DEFAULT 1,
  window_start timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(identifier, action_type)
);

-- Enable RLS on rate_limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Create policy for rate_limits
CREATE POLICY "Service role can manage rate limits" 
ON public.rate_limits 
FOR ALL 
USING ((auth.jwt() ->> 'role') = 'service_role');

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_user_id ON public.security_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_created_at ON public.security_audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_action ON public.rate_limits(identifier, action_type);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window_start ON public.rate_limits(window_start);