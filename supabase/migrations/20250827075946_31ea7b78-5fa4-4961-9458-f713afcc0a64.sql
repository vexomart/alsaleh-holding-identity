-- Create missing rate_limits table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL,
  action_type text NOT NULL,
  count integer NOT NULL DEFAULT 1,
  window_start timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(identifier, action_type)
);

-- Enable RLS
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Create policy for service role to manage rate limits
CREATE POLICY "Service role can manage rate limits" ON public.rate_limits
FOR ALL USING (
  (auth.jwt() ->> 'role'::text) = 'service_role'::text
);

-- Create policy for admins to view rate limits
CREATE POLICY "Admins can view rate limits" ON public.rate_limits
FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role)
);