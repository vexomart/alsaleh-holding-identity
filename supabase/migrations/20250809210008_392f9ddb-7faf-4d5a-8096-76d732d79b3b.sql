-- إضافة عمود payment_status إلى جدول invoices
ALTER TABLE public.invoices 
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending';

-- إضافة فهرس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_invoices_payment_status ON public.invoices(payment_status);

-- تحديث السجلات الموجودة حسب الحالة
UPDATE public.invoices 
SET payment_status = CASE 
  WHEN status = 'paid' THEN 'paid'
  WHEN status = 'sent' THEN 'pending'
  ELSE 'pending'
END;