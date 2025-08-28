-- إنشاء جدول security_audit_logs المطلوب
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

-- تفعيل RLS
ALTER TABLE security_audit_logs ENABLE ROW LEVEL SECURITY;

-- policy للأدمين فقط
CREATE POLICY "Only admins can view security logs" ON security_audit_logs
    FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- الآن حذف البيانات السابقة من الفواتير
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

-- إنشاء جدول للإشعارات الحقيقية
CREATE TABLE IF NOT EXISTS invoice_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  invoice_id uuid REFERENCES invoices NOT NULL,
  notification_type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  sent_via_email boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE invoice_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON invoice_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON invoice_notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their notifications" ON invoice_notifications
  FOR UPDATE USING (auth.uid() = user_id);