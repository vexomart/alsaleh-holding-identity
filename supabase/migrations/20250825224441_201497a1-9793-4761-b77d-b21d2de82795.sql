-- CRITICAL SECURITY FIXES: Enhanced Data Protection
-- Phase 1: Data Masking Functions

-- Enhanced email masking function
CREATE OR REPLACE FUNCTION public.mask_sensitive_email(email_input text, user_requesting uuid DEFAULT auth.uid())
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Only show full email to admins
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
CREATE OR REPLACE FUNCTION public.mask_sensitive_phone(phone_input text, user_requesting uuid DEFAULT auth.uid())
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Only show full phone to admins
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
SET search_path TO ''
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

-- Enhanced rate limiting function for sensitive operations
CREATE OR REPLACE FUNCTION public.check_sensitive_operation_limit(p_user_id uuid, p_operation_type text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  user_identifier TEXT;
  rate_limit_passed BOOLEAN;
BEGIN
  user_identifier := COALESCE(p_user_id::text, 'anonymous');
  
  -- Stricter limits for sensitive operations
  SELECT public.enhanced_rate_limit_check(
    user_identifier,
    p_operation_type,
    CASE 
      WHEN p_operation_type IN ('payment_transaction', 'job_application') THEN 2
      WHEN p_operation_type IN ('invoice_creation', 'contract_creation') THEN 5
      ELSE 10
    END,
    60 -- Per hour
  ) INTO rate_limit_passed;
  
  IF NOT rate_limit_passed THEN
    INSERT INTO public.security_audit_logs (
      event_type,
      user_id,
      action,
      risk_level,
      metadata
    ) VALUES (
      'rate_limit_exceeded',
      p_user_id,
      p_operation_type || '_rate_limit_exceeded',
      'high',
      jsonb_build_object(
        'operation_type', p_operation_type,
        'timestamp', now(),
        'user_id', p_user_id::text
      )
    );
    
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$;

-- Phase 2: Enhanced RLS Policies for Critical Tables

-- DROP existing policies that are not secure enough
DROP POLICY IF EXISTS "job_applicants_admin_only" ON public.job_applicants;
DROP POLICY IF EXISTS "client_contacts_admin_access" ON public.client_contacts;
DROP POLICY IF EXISTS "client_contacts_owner_access" ON public.client_contacts;
DROP POLICY IF EXISTS "support_tickets_admin_access" ON public.support_tickets;
DROP POLICY IF EXISTS "support_tickets_assignee_access" ON public.support_tickets;
DROP POLICY IF EXISTS "invoices_admin_access" ON public.invoices;
DROP POLICY IF EXISTS "invoices_owner_access" ON public.invoices;
DROP POLICY IF EXISTS "payment_transactions_admin_full_access" ON public.payment_transactions;
DROP POLICY IF EXISTS "payment_transactions_owner_access" ON public.payment_transactions;
DROP POLICY IF EXISTS "payment_transactions_secure_insert" ON public.payment_transactions;

-- Enhanced secure policies for job_applicants
CREATE POLICY "job_applicants_admin_only_enhanced" 
ON public.job_applicants FOR ALL 
USING (
  has_role(auth.uid(), 'admin'::app_role) AND 
  auth.uid() IS NOT NULL AND
  public.check_sensitive_operation_limit(auth.uid(), 'job_applicant_access')
);

-- Enhanced secure policies for client_contacts  
CREATE POLICY "client_contacts_admin_access_enhanced" 
ON public.client_contacts FOR ALL 
USING (
  has_role(auth.uid(), 'admin'::app_role) AND 
  auth.uid() IS NOT NULL AND
  public.check_sensitive_operation_limit(auth.uid(), 'client_contact_access')
);

CREATE POLICY "client_contacts_owner_access_enhanced" 
ON public.client_contacts FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM clients 
    WHERE clients.id = client_contacts.client_id 
    AND clients.created_by = auth.uid() 
    AND auth.uid() IS NOT NULL
  ) AND
  public.check_sensitive_operation_limit(auth.uid(), 'client_contact_access')
);

-- Enhanced secure policies for support_tickets
CREATE POLICY "support_tickets_admin_access_enhanced" 
ON public.support_tickets FOR ALL 
USING (
  has_role(auth.uid(), 'admin'::app_role) AND 
  auth.uid() IS NOT NULL AND
  public.check_sensitive_operation_limit(auth.uid(), 'support_ticket_access')
);

CREATE POLICY "support_tickets_assignee_access_enhanced" 
ON public.support_tickets FOR ALL 
USING (
  assignee_id = auth.uid() AND 
  auth.uid() IS NOT NULL AND
  public.check_sensitive_operation_limit(auth.uid(), 'support_ticket_access')
);

-- Enhanced secure policies for invoices
CREATE POLICY "invoices_admin_access_enhanced" 
ON public.invoices FOR ALL 
USING (
  has_role(auth.uid(), 'admin'::app_role) AND 
  auth.uid() IS NOT NULL AND
  public.check_sensitive_operation_limit(auth.uid(), 'invoice_access')
);

CREATE POLICY "invoices_owner_access_enhanced" 
ON public.invoices FOR ALL 
USING (
  user_id = auth.uid() AND 
  auth.uid() IS NOT NULL AND
  public.check_sensitive_operation_limit(auth.uid(), 'invoice_access')
);

-- Enhanced secure policies for payment_transactions
CREATE POLICY "payment_transactions_admin_full_access_enhanced" 
ON public.payment_transactions FOR ALL 
USING (
  has_role(auth.uid(), 'admin'::app_role) AND 
  auth.uid() IS NOT NULL AND
  public.check_sensitive_operation_limit(auth.uid(), 'payment_transaction_access')
);

CREATE POLICY "payment_transactions_owner_access_enhanced" 
ON public.payment_transactions FOR SELECT 
USING (
  user_id = auth.uid() AND 
  auth.uid() IS NOT NULL AND
  public.check_sensitive_operation_limit(auth.uid(), 'payment_transaction_access')
);

CREATE POLICY "payment_transactions_secure_insert_enhanced" 
ON public.payment_transactions FOR INSERT 
WITH CHECK (
  user_id = auth.uid() AND 
  auth.uid() IS NOT NULL AND 
  public.check_sensitive_operation_limit(auth.uid(), 'payment_transaction_create')
);

-- Phase 3: Security Audit Logging Triggers

-- Enhanced audit logging trigger for sensitive data access
CREATE OR REPLACE FUNCTION public.log_sensitive_data_access_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
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

-- Add triggers for sensitive tables
DROP TRIGGER IF EXISTS audit_job_applications ON public.job_applications;
CREATE TRIGGER audit_job_applications
  AFTER INSERT OR UPDATE OR DELETE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_data_access_trigger();

DROP TRIGGER IF EXISTS audit_client_contacts ON public.client_contacts;
CREATE TRIGGER audit_client_contacts
  AFTER INSERT OR UPDATE OR DELETE ON public.client_contacts
  FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_data_access_trigger();

DROP TRIGGER IF EXISTS audit_support_tickets ON public.support_tickets;
CREATE TRIGGER audit_support_tickets
  AFTER INSERT OR UPDATE OR DELETE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_data_access_trigger();

DROP TRIGGER IF EXISTS audit_invoices ON public.invoices;
CREATE TRIGGER audit_invoices
  AFTER INSERT OR UPDATE OR DELETE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_data_access_trigger();

DROP TRIGGER IF EXISTS audit_payment_transactions ON public.payment_transactions;
CREATE TRIGGER audit_payment_transactions
  AFTER INSERT OR UPDATE OR DELETE ON public.payment_transactions
  FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_data_access_trigger();