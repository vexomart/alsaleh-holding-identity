-- CRITICAL SECURITY FIXES - Phase 1: Emergency Data Protection (Admin Assignment)

-- First, get an admin user to assign NULL user_id records to
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Get first admin user
    SELECT user_id INTO admin_user_id 
    FROM user_roles 
    WHERE role = 'admin'::app_role 
    LIMIT 1;
    
    -- If we have an admin user, assign NULL records to them
    IF admin_user_id IS NOT NULL THEN
        -- Update contracts with NULL user_id to be assigned to admin
        UPDATE contracts 
        SET user_id = admin_user_id,
            status = 'draft',
            notes = COALESCE(notes, '') || ' [SYSTEM: Orphaned record assigned to admin for security]'
        WHERE user_id IS NULL;
        
        -- Update payment_transactions with NULL user_id to be assigned to admin
        UPDATE payment_transactions
        SET user_id = admin_user_id,
            status = 'cancelled'
        WHERE user_id IS NULL;
    ELSE
        -- If no admin exists, we'll handle this differently
        RAISE NOTICE 'No admin user found. Manual intervention required for NULL user_id records.';
    END IF;
END $$;

-- Add stricter constraints to prevent NULL user_id in future (only if we successfully updated)
DO $$
BEGIN
    -- Check if there are still NULL user_id records
    IF NOT EXISTS (SELECT 1 FROM contracts WHERE user_id IS NULL) 
       AND NOT EXISTS (SELECT 1 FROM payment_transactions WHERE user_id IS NULL) THEN
        
        ALTER TABLE contracts 
        ALTER COLUMN user_id SET NOT NULL;
        
        ALTER TABLE payment_transactions
        ALTER COLUMN user_id SET NOT NULL;
    END IF;
END $$;

-- Enhance RLS policies for contracts - add additional security layer
DROP POLICY IF EXISTS "Users can view their own contracts" ON contracts;
CREATE POLICY "Users can view their own contracts" 
ON contracts 
FOR SELECT 
USING (
  (auth.uid() = user_id AND auth.uid() IS NOT NULL) 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Enhance RLS policies for payment_transactions - add additional security layer
DROP POLICY IF EXISTS "Users can view their own transactions" ON payment_transactions;
CREATE POLICY "Users can view their own transactions" 
ON payment_transactions 
FOR SELECT 
USING (
  (auth.uid() = user_id AND auth.uid() IS NOT NULL) 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Create enhanced security audit logging table
CREATE TABLE IF NOT EXISTS security_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  user_id uuid,
  resource_type text,
  resource_id uuid,
  action text NOT NULL,
  ip_address inet,
  user_agent text,
  risk_level text DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on security audit logs
ALTER TABLE security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view security audit logs
CREATE POLICY "Admins can view security audit logs"
ON security_audit_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Service role can insert security audit logs
CREATE POLICY "Service role can insert security audit logs"
ON security_audit_logs
FOR INSERT
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'service_role'::text OR has_role(auth.uid(), 'admin'::app_role));

-- Add rate limiting enhancement for sensitive operations
CREATE OR REPLACE FUNCTION enhanced_rate_limit_check(
  p_identifier text, 
  p_action_type text, 
  p_limit integer DEFAULT 5, 
  p_window_minutes integer DEFAULT 60
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_count integer;
  window_start_time timestamp with time zone;
  is_sensitive_action boolean;
BEGIN
  -- More restrictive limits for sensitive actions
  is_sensitive_action := p_action_type IN ('contract_creation', 'payment_processing', 'data_export');
  
  IF is_sensitive_action THEN
    p_limit := LEAST(p_limit, 3); -- Max 3 sensitive operations per hour
    p_window_minutes := GREATEST(p_window_minutes, 60); -- At least 1 hour window
  END IF;
  
  window_start_time := now() - (p_window_minutes || ' minutes')::interval;
  
  -- Clean up old entries
  DELETE FROM rate_limits 
  WHERE window_start < window_start_time;
  
  -- Get current count
  SELECT count INTO current_count
  FROM rate_limits
  WHERE identifier = p_identifier 
    AND action_type = p_action_type
    AND window_start >= window_start_time;
  
  -- Log suspicious activity to security audit logs if table exists
  IF current_count >= p_limit THEN
    INSERT INTO security_audit_logs (
      event_type,
      user_id,
      action,
      risk_level,
      metadata
    ) VALUES (
      'rate_limit_exceeded',
      auth.uid(),
      p_action_type,
      'high',
      jsonb_build_object(
        'identifier', p_identifier,
        'current_count', current_count,
        'limit', p_limit,
        'window_minutes', p_window_minutes
      )
    );
    RETURN false;
  END IF;
  
  -- Update or insert rate limit record
  INSERT INTO rate_limits (identifier, action_type, count, window_start)
  VALUES (p_identifier, p_action_type, 1, now())
  ON CONFLICT (identifier, action_type) 
  DO UPDATE SET 
    count = CASE 
      WHEN rate_limits.window_start < window_start_time THEN 1
      ELSE rate_limits.count + 1 
    END,
    window_start = CASE 
      WHEN rate_limits.window_start < window_start_time THEN now()
      ELSE rate_limits.window_start 
    END;
    
  RETURN true;
END;
$$;