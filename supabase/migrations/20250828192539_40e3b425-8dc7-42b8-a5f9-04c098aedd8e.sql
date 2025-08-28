-- إصلاح search_path في جميع الدوال الأمنية
-- تحديث الدوال الأساسية المهمة

-- دالة تحديث timestamps عامة
CREATE OR REPLACE FUNCTION public._update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- دالة إنشاء محفظة المستخدم
CREATE OR REPLACE FUNCTION public.create_user_wallet()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- إنشاء محفظة للمستخدم الجديد
  INSERT INTO customer_wallets (user_id, balance, currency)
  VALUES (NEW.id, 0.00, 'SAR');
  
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- في حالة وجود خطأ، لا نوقف إنشاء المستخدم
    RETURN NEW;
END;
$$;

-- دالة تنظيف كلمات المرور المنتهية الصلاحية
CREATE OR REPLACE FUNCTION public.cleanup_expired_verification_codes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  DELETE FROM verification_codes 
  WHERE expires_at < NOW() OR used = TRUE;
END;
$$;

-- دالة الفحص الأمني المطور
CREATE OR REPLACE FUNCTION public.enhanced_security_check()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_identifier TEXT;
  rate_limit_passed BOOLEAN;
BEGIN
  -- Create identifier for rate limiting
  user_identifier := COALESCE(auth.uid()::text, inet_client_addr()::text, 'anonymous');
  
  -- Check rate limits for sensitive operations
  IF TG_OP IN ('INSERT', 'UPDATE') AND TG_TABLE_NAME IN ('payment_transactions', 'contracts') THEN
    SELECT enhanced_rate_limit_check(
      user_identifier,
      TG_TABLE_NAME || '_' || TG_OP,
      3, -- Limit to 3 operations
      60 -- Per hour
    ) INTO rate_limit_passed;
    
    IF NOT rate_limit_passed THEN
      RAISE EXCEPTION 'Rate limit exceeded for % operation on %', TG_OP, TG_TABLE_NAME;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- دالة تحديث عداد طرق الدفع
CREATE OR REPLACE FUNCTION public.update_payment_methods_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- دالة إعداد رقم الفاتورة العشوائي كمشغل
CREATE OR REPLACE FUNCTION public.auto_set_invoice_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := generate_random_invoice_number();
  END IF;
  RETURN NEW;
END;
$$;

-- تحديث المشغلات لاستخدام الدوال المحدثة
DROP TRIGGER IF EXISTS trigger_set_random_invoice_number ON invoices;
CREATE TRIGGER trigger_set_random_invoice_number
  BEFORE INSERT ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION auto_set_invoice_number();

-- اختبار نهائي للتأكد من عمل النظام
DO $$
DECLARE
  test_invoice_number TEXT;
BEGIN
  -- اختبار إنشاء رقم فاتورة عشوائي
  test_invoice_number := generate_random_invoice_number();
  RAISE NOTICE 'Test invoice number generated: %', test_invoice_number;
  
  -- اختبار الدالة المساعدة
  test_invoice_number := get_unique_invoice_number();
  RAISE NOTICE 'Unique invoice number generated: %', test_invoice_number;
END $$;