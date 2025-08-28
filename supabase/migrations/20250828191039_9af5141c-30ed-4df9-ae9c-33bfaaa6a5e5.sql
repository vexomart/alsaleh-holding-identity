-- Create missing rate_limits table if it doesn't exist (this is what's causing the delete issue)
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier text NOT NULL,
  action_type text NOT NULL,
  count integer NOT NULL DEFAULT 1,
  window_start timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(identifier, action_type)
);

-- Enable RLS on rate_limits if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'rate_limits' 
    AND policyname = 'Service role can manage rate limits'
  ) THEN
    ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Service role can manage rate limits" 
    ON public.rate_limits 
    FOR ALL 
    USING ((auth.jwt() ->> 'role') = 'service_role');
  END IF;
END $$;

-- Add indexes for performance if they don't exist
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_action ON public.rate_limits(identifier, action_type);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window_start ON public.rate_limits(window_start);