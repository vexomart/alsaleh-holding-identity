-- إزالة التينانت المستقل وتنظيف النظام
-- 1. إزالة masteredupath من جدول التينانتس
UPDATE public.tenants 
SET is_active = false 
WHERE code = 'masteredupath';

-- 2. تحديث الدالة للتركيز على موقع علي الشهري فقط
CREATE OR REPLACE FUNCTION public.get_current_tenant_id()
RETURNS UUID AS $$
DECLARE
  tenant_uuid UUID;
BEGIN
  -- محاولة الحصول على التينانت من المتغيرات
  BEGIN
    tenant_uuid := current_setting('app.current_tenant_id')::uuid;
    IF tenant_uuid IS NOT NULL THEN
      RETURN tenant_uuid;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    -- تجاهل الخطأ والمتابعة
  END;
  
  -- استخدام موقع علي الشهري كافتراضي وحيد
  SELECT id INTO tenant_uuid 
  FROM public.tenants 
  WHERE code = 'alishehri' AND is_active = true 
  LIMIT 1;
  
  RETURN tenant_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = 'public';

-- 3. تحديث دالة كشف التينانت لتركز على موقع علي الشهري فقط
COMMENT ON FUNCTION public.get_current_tenant_id() IS 'Returns Ali Al-Shahri holding company tenant ID as the primary tenant for this system';

-- 4. تحديث جميع البيانات الموجودة لتنتمي لموقع علي الشهري
DO $$
DECLARE
  alishehri_tenant_id UUID;
BEGIN
  -- الحصول على معرف تينانت علي الشهري
  SELECT id INTO alishehri_tenant_id 
  FROM public.tenants 
  WHERE code = 'alishehri' AND is_active = true
  LIMIT 1;
  
  IF alishehri_tenant_id IS NOT NULL THEN
    -- تحديث جميع الجداول للتأكد من انتمائها لموقع علي الشهري
    UPDATE public.platform_users SET tenant_id = alishehri_tenant_id WHERE tenant_id IS NULL OR tenant_id != alishehri_tenant_id;
    UPDATE public.services SET tenant_id = alishehri_tenant_id WHERE tenant_id IS NULL OR tenant_id != alishehri_tenant_id;
    UPDATE public.invoices SET tenant_id = alishehri_tenant_id WHERE tenant_id IS NULL OR tenant_id != alishehri_tenant_id;
    UPDATE public.payment_transactions SET tenant_id = alishehri_tenant_id WHERE tenant_id IS NULL OR tenant_id != alishehri_tenant_id;
    UPDATE public.quotes SET tenant_id = alishehri_tenant_id WHERE tenant_id IS NULL OR tenant_id != alishehri_tenant_id;
    UPDATE public.support_tickets SET tenant_id = alishehri_tenant_id WHERE tenant_id IS NULL OR tenant_id != alishehri_tenant_id;
    UPDATE public.user_notifications SET tenant_id = alishehri_tenant_id WHERE tenant_id IS NULL OR tenant_id != alishehri_tenant_id;
    UPDATE public.updates SET tenant_id = alishehri_tenant_id WHERE tenant_id IS NULL OR tenant_id != alishehri_tenant_id;
    UPDATE public.security_audit_logs SET tenant_id = alishehri_tenant_id WHERE tenant_id IS NULL OR tenant_id != alishehri_tenant_id;
    
    -- تحديث الجداول الأخرى إذا كانت موجودة
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'clients') THEN
        EXECUTE 'UPDATE public.clients SET tenant_id = $1 WHERE tenant_id IS NULL OR tenant_id != $1' USING alishehri_tenant_id;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'business_payments') THEN
        EXECUTE 'UPDATE public.business_payments SET tenant_id = $1 WHERE tenant_id IS NULL OR tenant_id != $1' USING alishehri_tenant_id;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tickets') THEN
        EXECUTE 'UPDATE public.tickets SET tenant_id = $1 WHERE tenant_id IS NULL OR tenant_id != $1' USING alishehri_tenant_id;
    END IF;
  END IF;
END $$;