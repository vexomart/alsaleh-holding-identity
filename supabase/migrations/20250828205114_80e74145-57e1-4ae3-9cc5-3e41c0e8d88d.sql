-- إزالة جميع triggers المتعلقة بـ security audit logs
DROP TRIGGER IF EXISTS log_sensitive_data_access_trigger_invoices ON invoices;
DROP TRIGGER IF EXISTS log_sensitive_data_access_trigger_contracts ON contracts;
DROP TRIGGER IF EXISTS log_sensitive_data_access_trigger_payment_transactions ON payment_transactions;
DROP TRIGGER IF EXISTS log_sensitive_data_access_trigger_job_applications ON job_applications;

-- إزالة الدالة المشكلة
DROP FUNCTION IF EXISTS public.log_sensitive_data_access_trigger();

-- إنشاء جدول security_audit_logs
CREATE TABLE IF NOT EXISTS security_audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid,
    resource_type text,
    resource_id text,
    access_type text,
    data_classification text,
    success boolean DEFAULT true,
    risk_score integer DEFAULT 0,
    metadata jsonb DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE security_audit_logs ENABLE ROW LEVEL SECURITY;

-- حذف البيانات السابقة من الفواتير
DELETE FROM invoices;

-- إضافة دالة لإنشاء أرقام فواتير عشوائية
CREATE OR REPLACE FUNCTION public.generate_random_invoice_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    random_number TEXT;
    year_part TEXT;
    month_part TEXT;
BEGIN
    random_number := LPAD(floor(random() * 1000000)::text, 6, '0');
    year_part := TO_CHAR(CURRENT_DATE, 'YY');
    month_part := TO_CHAR(CURRENT_DATE, 'MM');
    RETURN 'INV-' || year_part || month_part || '-' || random_number;
END;
$function$;