-- إنشاء الدوال المساعدة لتوليد الأرقام التسلسلية

-- دالة توليد رقم عرض السعر
CREATE OR REPLACE FUNCTION public.generate_quote_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  year_suffix TEXT;
  counter INTEGER;
  quote_num TEXT;
BEGIN
  year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(quote_number FROM 4 FOR 6) AS INTEGER)), 0) + 1
  INTO counter
  FROM public.quotes
  WHERE quote_number LIKE 'QT' || year_suffix || '%';
  
  quote_num := 'QT' || year_suffix || LPAD(counter::TEXT, 6, '0');
  
  RETURN quote_num;
END;
$function$;

-- دالة توليد رقم العقد التجاري
CREATE OR REPLACE FUNCTION public.generate_business_contract_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  year_suffix TEXT;
  counter INTEGER;
  contract_num TEXT;
BEGIN
  year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(contract_number FROM 4 FOR 6) AS INTEGER)), 0) + 1
  INTO counter
  FROM public.business_contracts
  WHERE contract_number LIKE 'BC' || year_suffix || '%';
  
  contract_num := 'BC' || year_suffix || LPAD(counter::TEXT, 6, '0');
  
  RETURN contract_num;
END;
$function$;

-- دالة توليد رقم الفاتورة التجارية
CREATE OR REPLACE FUNCTION public.generate_business_invoice_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  year_suffix TEXT;
  counter INTEGER;
  invoice_num TEXT;
BEGIN
  year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 4 FOR 6) AS INTEGER)), 0) + 1
  INTO counter
  FROM public.business_invoices
  WHERE invoice_number LIKE 'BI' || year_suffix || '%';
  
  invoice_num := 'BI' || year_suffix || LPAD(counter::TEXT, 6, '0');
  
  RETURN invoice_num;
END;
$function$;

-- إنشاء المشغلات (Triggers) لتوليد الأرقام التلقائية

-- مشغل لتوليد رقم عرض السعر
CREATE OR REPLACE FUNCTION public.set_quote_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  IF NEW.quote_number IS NULL OR NEW.quote_number = '' THEN
    NEW.quote_number := public.generate_quote_number();
  END IF;
  RETURN NEW;
END;
$function$;

-- مشغل لتوليد رقم العقد التجاري
CREATE OR REPLACE FUNCTION public.set_business_contract_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  IF NEW.contract_number IS NULL OR NEW.contract_number = '' THEN
    NEW.contract_number := public.generate_business_contract_number();
  END IF;
  RETURN NEW;
END;
$function$;

-- مشغل لتوليد رقم الفاتورة التجارية
CREATE OR REPLACE FUNCTION public.set_business_invoice_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := public.generate_business_invoice_number();
  END IF;
  RETURN NEW;
END;
$function$;

-- ربط المشغلات بالجداول
CREATE TRIGGER set_quote_number_trigger
  BEFORE INSERT ON public.quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.set_quote_number();

CREATE TRIGGER set_business_contract_number_trigger
  BEFORE INSERT ON public.business_contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_business_contract_number();

CREATE TRIGGER set_business_invoice_number_trigger
  BEFORE INSERT ON public.business_invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.set_business_invoice_number();

-- مشغلات تحديث التوقيت
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON public.quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_business_contracts_updated_at
  BEFORE UPDATE ON public.business_contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_business_invoices_updated_at
  BEFORE UPDATE ON public.business_invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();