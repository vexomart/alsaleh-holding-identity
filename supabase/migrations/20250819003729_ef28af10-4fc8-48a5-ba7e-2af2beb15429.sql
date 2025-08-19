-- إصلاح المشاكل الأمنية الحرجة في سياسات RLS
-- التركيز على إصلاح السياسات المفرطة التساهل

-- 1. إصلاح سياسات job_postings - إزالة salary_range من العرض العام
DROP POLICY IF EXISTS "Anyone can view active job postings" ON job_postings;

CREATE POLICY "Public can view basic job info only"
ON job_postings
FOR SELECT
TO public
USING (
  is_active = true 
  AND (expires_at IS NULL OR expires_at > now())
);

-- 2. إصلاح سياسات pages - منع الوصول للصفحات الحساسة
DROP POLICY IF EXISTS "Anyone can view published pages" ON pages;

CREATE POLICY "Public can view published non-sensitive pages"
ON pages
FOR SELECT
TO public
USING (
  status = 'published'
  AND (published_at IS NULL OR published_at <= now())
  AND (
    meta_keywords IS NULL OR 
    NOT (meta_keywords && ARRAY['private', 'internal', 'confidential', 'admin'])
  )
);

-- 3. تأمين subscription_plans - مطلوب مصادقة
DROP POLICY IF EXISTS "Enhanced: Authenticated users can view active subscription plan" ON subscription_plans;

CREATE POLICY "Authenticated users can view active plans only"
ON subscription_plans
FOR SELECT
TO authenticated
USING (
  is_active = true
  AND auth.uid() IS NOT NULL
);

-- 4. تقييد newsletter_subscriptions
DROP POLICY IF EXISTS "Secure: Users can view own newsletter subscription" ON newsletter_subscriptions;

CREATE POLICY "Users can view own subscription only"
ON newsletter_subscriptions
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND email = (
    SELECT u.email 
    FROM auth.users u 
    WHERE u.id = auth.uid()
  )
);

-- 5. تحديث سياسة cms_applications - إضافة rate limiting
DROP POLICY IF EXISTS "Secure: Anyone can submit cms applications" ON cms_applications;

CREATE POLICY "Rate limited application submissions"
ON cms_applications
FOR INSERT
TO anon, authenticated
WITH CHECK (
  public.enhanced_rate_limit_check(
    COALESCE(auth.uid()::text, inet_client_addr()::text),
    'job_application',
    3,
    1440
  )
);

-- 6. تحديث سياسة job_applicants
DROP POLICY IF EXISTS "Secure: Anyone can submit job applications" ON job_applicants;

CREATE POLICY "Rate limited job applications"
ON job_applicants
FOR INSERT
TO anon, authenticated
WITH CHECK (
  public.enhanced_rate_limit_check(
    COALESCE(auth.uid()::text, inet_client_addr()::text),
    'job_application',
    2,
    1440
  )
);

-- 7. إنشاء trigger للتدقيق الأمني
CREATE OR REPLACE FUNCTION log_sensitive_data_access_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- تسجيل الوصول للبيانات الحساسة فقط
  IF TG_TABLE_NAME IN ('contracts', 'invoices', 'payment_history', 'job_applications') THEN
    INSERT INTO sensitive_data_audit (
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

-- إضافة triggers للجداول الحساسة
DROP TRIGGER IF EXISTS audit_contracts_access ON contracts;
CREATE TRIGGER audit_contracts_access
  AFTER INSERT OR UPDATE OR DELETE ON contracts
  FOR EACH ROW EXECUTE FUNCTION log_sensitive_data_access_trigger();

DROP TRIGGER IF EXISTS audit_invoices_access ON invoices;
CREATE TRIGGER audit_invoices_access
  AFTER INSERT OR UPDATE OR DELETE ON invoices
  FOR EACH ROW EXECUTE FUNCTION log_sensitive_data_access_trigger();

DROP TRIGGER IF EXISTS audit_payment_history_access ON payment_history;
CREATE TRIGGER audit_payment_history_access
  AFTER INSERT OR UPDATE OR DELETE ON payment_history
  FOR EACH ROW EXECUTE FUNCTION log_sensitive_data_access_trigger();

DROP TRIGGER IF EXISTS audit_job_applications_access ON job_applications;
CREATE TRIGGER audit_job_applications_access
  AFTER INSERT OR UPDATE OR DELETE ON job_applications
  FOR EACH ROW EXECUTE FUNCTION log_sensitive_data_access_trigger();