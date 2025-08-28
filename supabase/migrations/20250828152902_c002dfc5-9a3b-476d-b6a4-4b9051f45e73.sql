-- حذف البيانات المكررة والجدول إذا كان موجوداً
DROP TABLE IF EXISTS public.payment_methods CASCADE;

-- إنشاء جدول طرق الدفع من جديد
CREATE TABLE public.payment_methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  provider TEXT NOT NULL UNIQUE,
  icon_name TEXT NOT NULL DEFAULT 'CreditCard',
  api_key TEXT,
  secret_key TEXT,
  webhook_secret TEXT,
  is_active BOOLEAN NOT NULL DEFAULT false,
  is_live_mode BOOLEAN NOT NULL DEFAULT false,
  configuration JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تمكين RLS
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- إنشاء السياسات الأمنية
CREATE POLICY "Admin can manage all payment methods" 
ON public.payment_methods 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can view active payment methods" 
ON public.payment_methods 
FOR SELECT 
USING (is_active = true AND auth.uid() IS NOT NULL);

-- إدراج طرق الدفع الافتراضية
INSERT INTO public.payment_methods (name, name_ar, provider, icon_name, is_active, configuration) VALUES
('Electronic Payment', 'الدفع الإلكتروني', 'tap_now', 'CreditCard', true, '{"supports": ["visa", "mastercard", "mada", "apple_pay", "google_pay"]}'),
('Tamara', 'تمارا', 'tamara', 'Calendar', true, '{"installments": ["3_months", "4_months", "next_month"]}'),
('Bank Transfer', 'حوالة بنكية', 'bank_transfer', 'Building2', true, '{"bank_name": "البنك الأهلي السعودي", "account_number": "161000010006086071040", "iban": "SA1980000161608016071040", "account_holder": "شركة علي صالح الشهري القابضة"}');

-- إنشاء trigger لتحديث updated_at
CREATE OR REPLACE FUNCTION public.update_payment_methods_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON public.payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION public.update_payment_methods_updated_at();