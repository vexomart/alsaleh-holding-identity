-- حذف جميع التريجرات المتعلقة بالدالة أولاً
DROP TRIGGER IF EXISTS audit_contracts_access ON contracts;
DROP TRIGGER IF EXISTS audit_invoices_access ON invoices;
DROP TRIGGER IF EXISTS audit_payment_history_access ON payment_history;
DROP TRIGGER IF EXISTS audit_job_applications_access ON job_applications;
DROP TRIGGER IF EXISTS sensitive_data_audit_trigger ON job_applications;
DROP TRIGGER IF EXISTS sensitive_data_audit_trigger ON invoices;
DROP TRIGGER IF EXISTS audit_job_applications ON job_applications;
DROP TRIGGER IF EXISTS audit_client_contacts ON client_contacts;
DROP TRIGGER IF EXISTS audit_support_tickets ON support_tickets;
DROP TRIGGER IF EXISTS audit_invoices ON invoices;
DROP TRIGGER IF EXISTS audit_payment_transactions ON payment_transactions;

-- الآن حذف الدالة
DROP FUNCTION IF EXISTS public.log_sensitive_data_access_trigger() CASCADE;

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

-- إنشاء policy للأدمين
CREATE POLICY "Admins can manage security audit logs" ON security_audit_logs
    FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

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