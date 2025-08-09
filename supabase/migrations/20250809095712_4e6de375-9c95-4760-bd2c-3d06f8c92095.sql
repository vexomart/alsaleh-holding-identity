-- إنشاء جدول الفواتير
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  transaction_id UUID REFERENCES public.payment_transactions(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  service_title TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'SAR',
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL,
  invoice_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  due_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  tax_amount NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تمكين RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- إنشاء السياسات
CREATE POLICY "Users can view their own invoices" 
ON public.invoices 
FOR SELECT 
USING (true);

CREATE POLICY "System can insert invoices" 
ON public.invoices 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update invoices" 
ON public.invoices 
FOR UPDATE 
USING (true);

-- دالة إنشاء رقم الفاتورة
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  year_suffix TEXT;
  month_suffix TEXT;
  counter INTEGER;
  invoice_num TEXT;
BEGIN
  year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
  month_suffix := TO_CHAR(CURRENT_DATE, 'MM');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 8 FOR 4) AS INTEGER)), 0) + 1
  INTO counter
  FROM public.invoices
  WHERE invoice_number LIKE 'INV' || year_suffix || month_suffix || '%';
  
  invoice_num := 'INV' || year_suffix || month_suffix || LPAD(counter::TEXT, 4, '0');
  
  RETURN invoice_num;
END;
$$ LANGUAGE plpgsql;

-- تريجر لإعداد رقم الفاتورة تلقائياً
CREATE OR REPLACE FUNCTION public.set_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := public.generate_invoice_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_invoice_number_trigger
  BEFORE INSERT ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.set_invoice_number();

-- تريجر لتحديث الوقت
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();