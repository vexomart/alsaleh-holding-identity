-- CRITICAL SECURITY FIXES: Comprehensive Data Protection
-- Fixing all major security vulnerabilities identified in the security review

-- ====================
-- PHASE 1: CLIENT CONTACTS SECURITY
-- ====================

-- Drop existing unsafe policies
DROP POLICY IF EXISTS "Admin can manage all contacts" ON public.client_contacts;
DROP POLICY IF EXISTS "Users can manage contacts for their clients" ON public.client_contacts;

-- Create secure policies for client contacts
CREATE POLICY "client_contacts_admin_full_access" 
ON public.client_contacts 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "client_contacts_owner_access" 
ON public.client_contacts 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.clients 
    WHERE clients.id = client_contacts.client_id 
    AND clients.created_by = auth.uid()
    AND auth.uid() IS NOT NULL
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.clients 
    WHERE clients.id = client_contacts.client_id 
    AND clients.created_by = auth.uid()
    AND auth.uid() IS NOT NULL
  )
);

-- ====================
-- PHASE 2: JOB APPLICANTS SECURITY
-- ====================

-- Drop existing policies
DROP POLICY IF EXISTS "Rate limited job applications" ON public.job_applicants;
DROP POLICY IF EXISTS "Secure: Only admins can manage job applicants" ON public.job_applicants;
DROP POLICY IF EXISTS "Secure: Only admins can view job applicants" ON public.job_applicants;

-- Create ultra-secure job applicant policies
CREATE POLICY "job_applicants_admin_only_access" 
ON public.job_applicants 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Separate policy for rate-limited insertions
CREATE POLICY "job_applicants_rate_limited_insert" 
ON public.job_applicants 
FOR INSERT 
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR
  enhanced_rate_limit_check(
    COALESCE(auth.uid()::text, inet_client_addr()::text), 
    'job_application'::text, 
    2, 
    1440
  )
);

-- ====================
-- PHASE 3: JOB APPLICATIONS SECURITY  
-- ====================

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can submit job applications" ON public.job_applications;
DROP POLICY IF EXISTS "Only admins can delete job applications" ON public.job_applications;
DROP POLICY IF EXISTS "Only admins can update job applications" ON public.job_applications;
DROP POLICY IF EXISTS "Only admins can view job applications" ON public.job_applications;

-- Create secure job applications policies
CREATE POLICY "job_applications_admin_full_access" 
ON public.job_applications 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "job_applications_secure_insert" 
ON public.job_applications 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND check_recent_job_application(email)
  AND enhanced_rate_limit_check(
    auth.uid()::text, 
    'job_application_submit'::text, 
    3, 
    1440
  )
);

-- ====================
-- PHASE 4: SUPPORT TICKETS SECURITY
-- ====================

-- Drop existing policies
DROP POLICY IF EXISTS "Admin can manage all tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Assignees can manage their assigned tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Users can view tickets for their clients" ON public.support_tickets;

-- Create secure support ticket policies
CREATE POLICY "support_tickets_admin_access" 
ON public.support_tickets 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "support_tickets_assignee_access" 
ON public.support_tickets 
FOR ALL 
TO authenticated
USING (
  assignee_id = auth.uid() 
  AND auth.uid() IS NOT NULL
)
WITH CHECK (
  assignee_id = auth.uid() 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "support_tickets_client_owner_view" 
ON public.support_tickets 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.clients 
    WHERE clients.id = support_tickets.client_id 
    AND clients.created_by = auth.uid()
    AND auth.uid() IS NOT NULL
  )
);

-- ====================
-- PHASE 5: ENHANCED AUDIT LOGGING
-- ====================

-- Create comprehensive audit trigger for sensitive data access
CREATE OR REPLACE FUNCTION public.log_sensitive_data_access_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- تسجيل الوصول للبيانات الحساسة فقط
  IF TG_TABLE_NAME IN ('contracts', 'invoices', 'payment_history', 'job_applications') THEN
    INSERT INTO security_audit_logs (
      user_id,
      resource_type,
      resource_id,
      access_type,
      data_classification,
      success,
      risk_score,
      metadata
    ) VALUES (
      auth.uid(),
      TG_TABLE_NAME,
      COALESCE(NEW.id::text, OLD.id::text),
      TG_OP,
      CASE TG_TABLE_NAME
        WHEN 'contracts' THEN 'restricted'
        WHEN 'invoices' THEN 'restricted'
        WHEN 'payment_history' THEN 'restricted'
        WHEN 'job_applications' THEN 'confidential'
        ELSE 'internal'
      END,
      TRUE,
      CASE TG_TABLE_NAME
        WHEN 'contracts' THEN 85
        WHEN 'invoices' THEN 85
        WHEN 'payment_history' THEN 90
        WHEN 'job_applications' THEN 70
        ELSE 30
      END,
      jsonb_build_object(
        'table', TG_TABLE_NAME,
        'operation', TG_OP,
        'timestamp', now(),
        'ip_address', inet_client_addr()
      )
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Apply audit triggers to sensitive tables
DROP TRIGGER IF EXISTS sensitive_data_audit_trigger ON public.job_applications;
CREATE TRIGGER sensitive_data_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_data_access_trigger();

DROP TRIGGER IF EXISTS sensitive_data_audit_trigger ON public.invoices;
CREATE TRIGGER sensitive_data_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_data_access_trigger();

-- ====================
-- PHASE 6: ENHANCED RATE LIMITING FOR SENSITIVE OPERATIONS
-- ====================

-- Create enhanced rate limiting for sensitive data submissions
CREATE OR REPLACE FUNCTION public.enhanced_sensitive_data_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  user_identifier TEXT;
  rate_limit_passed BOOLEAN;
BEGIN
  -- Create identifier for rate limiting
  user_identifier := COALESCE(auth.uid()::text, inet_client_addr()::text, 'anonymous');
  
  -- Check rate limits for sensitive data operations
  IF TG_OP = 'INSERT' THEN
    SELECT public.enhanced_rate_limit_check(
      user_identifier,
      TG_TABLE_NAME || '_submit',
      5, -- Max 5 submissions per hour
      60
    ) INTO rate_limit_passed;
    
    IF NOT rate_limit_passed THEN
      -- Log security event
      INSERT INTO public.security_audit_logs (
        event_type,
        user_id,
        action,
        risk_level,
        metadata
      ) VALUES (
        'rate_limit_exceeded',
        auth.uid(),
        TG_TABLE_NAME || '_submission_blocked',
        'high',
        jsonb_build_object(
          'table', TG_TABLE_NAME,
          'user_identifier', user_identifier,
          'blocked_submission', true,
          'timestamp', now()
        )
      );
      
      RAISE EXCEPTION 'Rate limit exceeded for % submissions. Please try again later.', TG_TABLE_NAME;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Apply rate limiting to sensitive forms
DROP TRIGGER IF EXISTS rate_limit_trigger ON public.job_applications;
CREATE TRIGGER rate_limit_trigger
  BEFORE INSERT ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.enhanced_sensitive_data_rate_limit();

-- ====================
-- PHASE 7: DATA MASKING FUNCTIONS FOR PRIVACY
-- ====================

-- Enhanced email masking function
CREATE OR REPLACE FUNCTION public.mask_email(email_input text, user_requesting uuid DEFAULT auth.uid())
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only show full email to admins or the data owner
  IF public.has_role(user_requesting, 'admin'::app_role) THEN
    RETURN email_input;
  END IF;
  
  -- Mask email for others: show first 2 chars + *** + domain
  IF email_input IS NOT NULL AND email_input != '' THEN
    RETURN LEFT(email_input, 2) || '***@' || SPLIT_PART(email_input, '@', 2);
  END IF;
  
  RETURN NULL;
END;
$$;

-- Enhanced phone masking function  
CREATE OR REPLACE FUNCTION public.mask_phone(phone_input text, user_requesting uuid DEFAULT auth.uid())
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only show full phone to admins or the data owner
  IF public.has_role(user_requesting, 'admin'::app_role) THEN
    RETURN phone_input;
  END IF;
  
  -- Mask phone: show only last 4 digits
  IF phone_input IS NOT NULL AND LENGTH(phone_input) > 4 THEN
    RETURN '***-' || RIGHT(phone_input, 4);
  END IF;
  
  RETURN NULL;
END;
$$;

-- ID number masking function
CREATE OR REPLACE FUNCTION public.mask_id_number(id_input text, user_requesting uuid DEFAULT auth.uid())
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only show full ID to admins
  IF public.has_role(user_requesting, 'admin'::app_role) THEN
    RETURN id_input;
  END IF;
  
  -- Completely mask ID numbers for non-admins
  IF id_input IS NOT NULL AND id_input != '' THEN
    RETURN '***MASKED***';
  END IF;
  
  RETURN NULL;
END;
$$;