-- إنشاء نظام Multi-Tenancy محسّن
-- 1. إضافة تينانت جديد لموقع علي الشهري
INSERT INTO public.tenants (code, name, domain, is_active, settings) VALUES 
(
  'alishehri',
  'شركة علي صالح الشهري القابضة',
  'alialshehriholding.com',
  true,
  '{
    "branding": {
      "logo_url": "/assets/alishehri-logo.png",
      "primary_color": "#1e3a8a",
      "secondary_color": "#fbbf24"
    },
    "currency": "SAR",
    "language": "ar",
    "timezone": "Asia/Riyadh",
    "theme": "corporate",
    "features": ["tech_services", "consulting", "digital_solutions"]
  }'::jsonb
) ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  domain = EXCLUDED.domain,
  settings = EXCLUDED.settings,
  updated_at = now();

-- 2. إنشاء دالة للحصول على التينانت الحالي
CREATE OR REPLACE FUNCTION public.get_current_tenant_id()
RETURNS UUID AS $$
DECLARE
  tenant_uuid UUID;
  current_domain TEXT;
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
  
  -- استخدام التينانت الافتراضي (علي الشهري)
  SELECT id INTO tenant_uuid 
  FROM public.tenants 
  WHERE code = 'alishehri' AND is_active = true 
  LIMIT 1;
  
  RETURN tenant_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 3. إنشاء دالة لفحص الانتماء للتينانت
CREATE OR REPLACE FUNCTION public.belongs_to_tenant(record_tenant_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- إذا كان المستخدم أدمن، يمكنه الوصول لجميع التينانتس
  IF public.has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN true;
  END IF;
  
  -- فحص انتماء السجل للتينانت الحالي
  RETURN record_tenant_id = public.get_current_tenant_id() 
    OR record_tenant_id IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 4. تحديث الجداول الرئيسية لضمان وجود tenant_id
-- تحديث الجداول التي تفتقر للتينانت ID

-- تحديث جدول platform_users
ALTER TABLE public.platform_users 
ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);

-- تحديث جدول services
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);

-- تحديث جدول user_notifications
ALTER TABLE public.user_notifications 
ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);

-- تحديث جدول updates
ALTER TABLE public.updates 
ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);

-- تحديث جدول security_audit_logs
ALTER TABLE public.security_audit_logs 
ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);

-- 5. تحديث السجلات الموجودة لتنتمي للتينانت الافتراضي
DO $$
DECLARE
  default_tenant_id UUID;
BEGIN
  -- الحصول على معرف التينانت الافتراضي
  SELECT id INTO default_tenant_id 
  FROM public.tenants 
  WHERE code = 'alishehri' 
  LIMIT 1;
  
  IF default_tenant_id IS NOT NULL THEN
    -- تحديث الجداول
    UPDATE public.platform_users SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
    UPDATE public.services SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
    UPDATE public.user_notifications SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
    UPDATE public.updates SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
    UPDATE public.security_audit_logs SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
  END IF;
END $$;