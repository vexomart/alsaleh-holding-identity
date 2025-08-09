-- إنشاء جدول الفواتير
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES public.payment_transactions(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  offer_title TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'SAR',
  status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, failed, cancelled
  payment_method TEXT,
  issue_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  due_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- إضافة فهرس للبحث السريع
CREATE INDEX idx_invoices_transaction_id ON public.invoices(transaction_id);
CREATE INDEX idx_invoices_customer_email ON public.invoices(customer_email);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_invoices_invoice_number ON public.invoices(invoice_number);

-- تفعيل Row Level Security
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- سياسات الوصول
CREATE POLICY "Users can view their own invoices" 
ON public.invoices 
FOR SELECT 
USING (customer_email = auth.email() OR auth.uid() IN (
  SELECT user_id FROM public.user_roles WHERE role = 'admin'
));

CREATE POLICY "System can insert invoices" 
ON public.invoices 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update invoices" 
ON public.invoices 
FOR UPDATE 
USING (true);

-- دالة لتوليد رقم فاتورة فريد
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  year_suffix TEXT;
  counter INTEGER;
  invoice_num TEXT;
BEGIN
  -- الحصول على آخر رقمين من السنة الحالية
  year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
  
  -- الحصول على العداد التالي لهذه السنة
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 4 FOR 6) AS INTEGER)), 0) + 1
  INTO counter
  FROM public.invoices
  WHERE invoice_number LIKE 'INV' || year_suffix || '%';
  
  -- تنسيق الرقم كـ INV + YY + 6 أرقام
  invoice_num := 'INV' || year_suffix || LPAD(counter::TEXT, 6, '0');
  
  RETURN invoice_num;
END;
$$ LANGUAGE plpgsql;

-- دالة لتحديث تاريخ التعديل تلقائياً
CREATE OR REPLACE FUNCTION public.update_invoice_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- تشغيل الدالة عند التحديث
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_invoice_updated_at();

-- دالة لتوليد رقم الفاتورة تلقائياً عند الإنشاء
CREATE OR REPLACE FUNCTION public.set_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := public.generate_invoice_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- تشغيل الدالة عند الإدراج
CREATE TRIGGER set_invoice_number_trigger
  BEFORE INSERT ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.set_invoice_number();