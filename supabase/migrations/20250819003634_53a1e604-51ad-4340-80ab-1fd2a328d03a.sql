-- إصلاح المشاكل الأمنية في سياسات RLS
-- حذف السياسات المفرطة التساهل واستبدالها بسياسات آمنة

-- 1. إصلاح سياسات job_postings
DROP POLICY IF EXISTS "Anyone can view active job postings" ON job_postings;

-- سياسة جديدة آمنة لـ job_postings (إزالة البيانات الحساسة من العرض العام)
CREATE POLICY "Public can view basic job info only"
ON job_postings
FOR SELECT
TO public
USING (
  is_active = true 
  AND (expires_at IS NULL OR expires_at > now())
);

-- 2. إصلاح سياسات pages - تقييد الوصول للمحتوى الحساس
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

-- 3. إصلاح سياسات subsidiaries (إذا وجدت)
DROP POLICY IF EXISTS "Anyone can view published subsidiaries" ON subsidiaries;

CREATE POLICY "Public can view basic subsidiary info only"
ON subsidiaries
FOR SELECT
TO public
USING (
  is_published = true
);

-- 4. إصلاح سياسات cms_subsidiaries
DROP POLICY IF EXISTS "Admins can manage subsidiaries" ON cms_subsidiaries;

CREATE POLICY "Admins can manage subsidiaries"
ON cms_subsidiaries
FOR ALL
TO authenticated
USING (has_admin_role(auth.uid()));

CREATE POLICY "Public can view published subsidiaries only"
ON cms_subsidiaries
FOR SELECT
TO public
USING (
  status = 'published'::page_status
);

-- 5. تأمين subscription_plans بالكامل
DROP POLICY IF EXISTS "Enhanced: Authenticated users can view active subscription plan" ON subscription_plans;

CREATE POLICY "Authenticated users can view active plans only"
ON subscription_plans
FOR SELECT
TO authenticated
USING (
  is_active = true
  AND auth.uid() IS NOT NULL
);

-- 6. تشديد الحماية على الجداول الحساسة
-- حماية newsletter_subscriptions
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

-- 7. تحديث سياسة cms_applications لتقييد التقديم
DROP POLICY IF EXISTS "Secure: Anyone can submit cms applications" ON cms_applications;

CREATE POLICY "Rate limited application submissions"
ON cms_applications
FOR INSERT
TO anon, authenticated
WITH CHECK (
  public.enhanced_rate_limit_check(
    COALESCE(auth.uid()::text, inet_client_addr()::text),
    'job_application',
    3, -- 3 طلبات كحد أقصى
    1440 -- خلال 24 ساعة
  )
);

-- 8. تحديث سياسة job_applicants
DROP POLICY IF EXISTS "Secure: Anyone can submit job applications" ON job_applicants;

CREATE POLICY "Rate limited and monitored job applications"
ON job_applicants
FOR INSERT
TO anon, authenticated
WITH CHECK (
  public.enhanced_rate_limit_check(
    COALESCE(auth.uid()::text, inet_client_addr()::text),
    'job_application',
    2, -- طلبان كحد أقصى
    1440 -- خلال 24 ساعة
  )
);

-- 9. إنشاء trigger لتسجيل الوصول للبيانات الحساسة
CREATE OR REPLACE FUNCTION log_sensitive_table_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- تسجيل الوصول للجداول الحساسة
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
      WHEN 'business_payments' THEN 'restricted'
      WHEN 'job_applications' THEN 'confidential'
      WHEN 'cms_applications' THEN 'confidential'
      WHEN 'newsletter_subscriptions' THEN 'internal'
      ELSE 'internal'
    END,
    TRUE,
    CASE TG_TABLE_NAME
      WHEN 'contracts' THEN 85
      WHEN 'invoices' THEN 85
      WHEN 'payment_history' THEN 90
      WHEN 'business_payments' THEN 90
      WHEN 'job_applications' THEN 70
      WHEN 'cms_applications' THEN 70
      WHEN 'newsletter_subscriptions' THEN 40
      ELSE 30
    END,
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'operation', TG_OP,
      'user_agent', current_setting('request.headers', true)::jsonb->>'user-agent',
      'ip_address', inet_client_addr(),
      'timestamp', now()
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- إضافة triggers للجداول الحساسة
DROP TRIGGER IF EXISTS log_contracts_access ON contracts;
CREATE TRIGGER log_contracts_access
  AFTER INSERT OR UPDATE OR DELETE ON contracts
  FOR EACH ROW EXECUTE FUNCTION log_sensitive_table_access();

DROP TRIGGER IF EXISTS log_invoices_access ON invoices;
CREATE TRIGGER log_invoices_access
  AFTER INSERT OR UPDATE OR DELETE ON invoices
  FOR EACH ROW EXECUTE FUNCTION log_sensitive_table_access();

DROP TRIGGER IF EXISTS log_payment_history_access ON payment_history;
CREATE TRIGGER log_payment_history_access
  AFTER INSERT OR UPDATE OR DELETE ON payment_history
  FOR EACH ROW EXECUTE FUNCTION log_sensitive_table_access();

DROP TRIGGER IF EXISTS log_job_applications_access ON job_applications;
CREATE TRIGGER log_job_applications_access
  AFTER INSERT OR UPDATE OR DELETE ON job_applications
  FOR EACH ROW EXECUTE FUNCTION log_sensitive_table_access();

-- 10. إنشاء دالة للتحقق من الأذونات المتقدمة
CREATE OR REPLACE FUNCTION check_advanced_permissions(
  resource_type TEXT,
  operation TEXT,
  user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  is_admin BOOLEAN := FALSE;
  rate_limit_passed BOOLEAN := TRUE;
BEGIN
  -- التحقق من صلاحيات المشرف
  is_admin := has_role(user_id, 'admin'::app_role);
  
  -- التحقق من rate limiting للعمليات الحساسة
  IF NOT is_admin AND resource_type IN ('financial', 'personal', 'restricted') THEN
    rate_limit_passed := public.enhanced_rate_limit_check(
      user_id::text,
      resource_type || '_' || operation,
      CASE resource_type
        WHEN 'financial' THEN 3
        WHEN 'personal' THEN 5
        WHEN 'restricted' THEN 2
        ELSE 10
      END,
      60
    );
  END IF;
  
  -- تسجيل محاولة الوصول
  INSERT INTO sensitive_data_audit (
    user_id,
    resource_type,
    access_type,
    data_classification,
    success,
    risk_score,
    metadata
  ) VALUES (
    user_id,
    resource_type,
    operation,
    'restricted',
    rate_limit_passed AND (is_admin OR user_id IS NOT NULL),
    CASE 
      WHEN NOT rate_limit_passed THEN 95
      WHEN NOT is_admin AND resource_type = 'financial' THEN 80
      WHEN NOT is_admin AND resource_type = 'personal' THEN 60
      ELSE 20
    END,
    jsonb_build_object(
      'is_admin', is_admin,
      'rate_limit_passed', rate_limit_passed,
      'timestamp', now()
    )
  );
  
  RETURN rate_limit_passed AND (is_admin OR user_id IS NOT NULL);
END;
$$;

-- 11. دالة آمنة لإرجاع بيانات الوظائف العامة
CREATE OR REPLACE FUNCTION get_public_job_postings()
RETURNS TABLE(
  id UUID,
  title TEXT,
  title_ar TEXT,
  description TEXT,
  description_ar TEXT,
  department TEXT,
  location TEXT,
  job_type job_type,
  created_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    jp.id,
    jp.title,
    jp.title_ar,
    jp.description,
    jp.description_ar,
    jp.department,
    jp.location,
    jp.job_type,
    jp.created_at,
    jp.expires_at
  FROM job_postings jp
  WHERE jp.is_active = true 
    AND (jp.expires_at IS NULL OR jp.expires_at > now())
  ORDER BY jp.created_at DESC;
$$;

-- 12. دالة آمنة لإرجاع بيانات الشركات التابعة
CREATE OR REPLACE FUNCTION get_public_subsidiaries()
RETURNS TABLE(
  id UUID,
  name TEXT,
  short_desc TEXT,
  logo TEXT,
  banner TEXT,
  website_url TEXT,
  services TEXT[],
  gallery TEXT[],
  order_index INTEGER
)
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    cs.id,
    cs.name,
    cs.short_desc,
    cs.logo,
    cs.banner,
    cs.website_url,
    cs.services,
    cs.gallery,
    cs.order_index
  FROM cms_subsidiaries cs
  WHERE cs.status = 'published'::page_status
  ORDER BY cs.order_index, cs.name;
$$;