-- إنشاء جدول security_audit_logs إذا لم يكن موجوداً
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- إنشاء فهارس للأداء
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_user_id ON public.security_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_created_at ON public.security_audit_logs(created_at);

-- تمكين RLS
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- سياسة للأدمن فقط
CREATE POLICY "Admins can view security audit logs" ON public.security_audit_logs
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can insert security audit logs" ON public.security_audit_logs
  FOR INSERT WITH CHECK ((auth.jwt() ->> 'role') = 'service_role' OR has_role(auth.uid(), 'admin'::app_role));

-- الآن حذف الفواتير الوهمية
DELETE FROM public.invoices;

-- إعادة تعيين عداد الفواتير
DELETE FROM public.invoice_counters WHERE year = EXTRACT(YEAR FROM CURRENT_DATE);
INSERT INTO public.invoice_counters (year, counter) VALUES (EXTRACT(YEAR FROM CURRENT_DATE), 0);