-- إصلاح مشكلة الفواتير وإضافة جدول security_audit_logs المفقود

-- إنشاء جدول security_audit_logs إذا لم يكن موجوداً
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type text NOT NULL,
  user_id uuid,
  resource_type text,
  resource_id uuid,
  action text NOT NULL,
  risk_level text DEFAULT 'low',
  metadata jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- تفعيل RLS لجدول security_audit_logs
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- حذف السياسات الموجودة وإعادة إنشاؤها
DROP POLICY IF EXISTS "Admins can view security audit logs" ON public.security_audit_logs;
CREATE POLICY "Admins can view security audit logs" ON public.security_audit_logs
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Service role can insert security audit logs" ON public.security_audit_logs;
CREATE POLICY "Service role can insert security audit logs" ON public.security_audit_logs
FOR INSERT WITH CHECK (
  (auth.jwt() ->> 'role') = 'service_role' OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- تحديث سياسات الفواتير لتسمح بالحذف للأدمن
DROP POLICY IF EXISTS "Admins can delete invoices" ON public.invoices;
CREATE POLICY "Admins can delete invoices" ON public.invoices
FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- تحديث سياسة الأدمن للفواتير لتشمل جميع العمليات
DROP POLICY IF EXISTS "Admins can manage invoices" ON public.invoices;
CREATE POLICY "Admins can manage invoices" ON public.invoices
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- إصلاح دالة تسجيل الوصول للبيانات الحساسة
CREATE OR REPLACE FUNCTION public.log_customer_data_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Log all access to tables containing customer PII
  INSERT INTO public.security_audit_logs (
    event_type,
    user_id,
    action,
    resource_type,
    resource_id,
    risk_level,
    metadata
  ) VALUES (
    'customer_pii_access',
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_TABLE_NAME IN ('payment_transactions', 'job_applications') THEN 'critical'
      WHEN TG_TABLE_NAME IN ('invoices', 'business_contracts') THEN 'high'
      ELSE 'medium'
    END,
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'operation', TG_OP,
      'has_email', CASE 
        WHEN TG_TABLE_NAME = 'invoices' THEN (COALESCE(NEW.customer_email, OLD.customer_email) IS NOT NULL)
        WHEN TG_TABLE_NAME = 'payment_transactions' THEN (COALESCE(NEW.customer_email, OLD.customer_email) IS NOT NULL)
        WHEN TG_TABLE_NAME = 'job_applications' THEN (COALESCE(NEW.email, OLD.email) IS NOT NULL)
        ELSE false
      END,
      'has_phone', CASE 
        WHEN TG_TABLE_NAME = 'invoices' THEN (COALESCE(NEW.customer_phone, OLD.customer_phone) IS NOT NULL)
        WHEN TG_TABLE_NAME = 'payment_transactions' THEN (COALESCE(NEW.customer_phone, OLD.customer_phone) IS NOT NULL)
        WHEN TG_TABLE_NAME = 'job_applications' THEN (COALESCE(NEW.phone, OLD.phone) IS NOT NULL)
        ELSE false
      END,
      'timestamp', now(),
      'ip_address', inet_client_addr()
    )
  );
  
  RETURN COALESCE(NEW, OLD);
EXCEPTION
  WHEN OTHERS THEN
    -- في حالة وجود خطأ، لا نوقف العملية
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- إضافة مشغل للفواتير إذا لم يكن موجوداً
DROP TRIGGER IF EXISTS log_invoice_access ON public.invoices;
CREATE TRIGGER log_invoice_access
  AFTER INSERT OR UPDATE OR DELETE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION log_customer_data_access();

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_user_id ON public.security_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_created_at ON public.security_audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_event_type ON public.security_audit_logs(event_type);