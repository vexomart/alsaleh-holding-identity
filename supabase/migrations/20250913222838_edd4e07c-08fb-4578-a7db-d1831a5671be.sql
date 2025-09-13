-- إصلاح مشاكل الأمان وتحديث RLS policies للـ Multi-Tenancy

-- 1. إنشاء سياسات RLS محسّنة للجداول الرئيسية

-- سياسات platform_users مع عزل التينانت
DROP POLICY IF EXISTS "platform_users_tenant_isolation" ON public.platform_users;
CREATE POLICY "platform_users_tenant_isolation" 
ON public.platform_users 
FOR ALL 
USING (public.belongs_to_tenant(tenant_id))
WITH CHECK (tenant_id = public.get_current_tenant_id());

-- سياسات services مع عزل التينانت
DROP POLICY IF EXISTS "services_tenant_isolation" ON public.services;
CREATE POLICY "services_tenant_isolation" 
ON public.services 
FOR ALL 
USING (public.belongs_to_tenant(tenant_id))
WITH CHECK (tenant_id = public.get_current_tenant_id());

-- سياسات invoices مع عزل التينانت
DROP POLICY IF EXISTS "invoices_tenant_isolation" ON public.invoices;
CREATE POLICY "invoices_tenant_isolation" 
ON public.invoices 
FOR ALL 
USING (public.belongs_to_tenant(tenant_id))
WITH CHECK (tenant_id = public.get_current_tenant_id());

-- سياسات payment_transactions مع عزل التينانت
DROP POLICY IF EXISTS "payment_transactions_tenant_isolation" ON public.payment_transactions;
CREATE POLICY "payment_transactions_tenant_isolation" 
ON public.payment_transactions 
FOR ALL 
USING (public.belongs_to_tenant(tenant_id))
WITH CHECK (tenant_id = public.get_current_tenant_id());

-- سياسات quotes مع عزل التينانت
DROP POLICY IF EXISTS "quotes_tenant_isolation" ON public.quotes;
CREATE POLICY "quotes_tenant_isolation" 
ON public.quotes 
FOR ALL 
USING (public.belongs_to_tenant(tenant_id))
WITH CHECK (tenant_id = public.get_current_tenant_id());

-- سياسات support_tickets مع عزل التينانت
DROP POLICY IF EXISTS "support_tickets_tenant_isolation" ON public.support_tickets;
CREATE POLICY "support_tickets_tenant_isolation" 
ON public.support_tickets 
FOR ALL 
USING (public.belongs_to_tenant(tenant_id))
WITH CHECK (tenant_id = public.get_current_tenant_id());

-- سياسات clients مع عزل التينانت (إذا كان موجود)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'clients') THEN
        DROP POLICY IF EXISTS "clients_tenant_isolation" ON public.clients;
        EXECUTE 'CREATE POLICY "clients_tenant_isolation" 
                 ON public.clients 
                 FOR ALL 
                 USING (public.belongs_to_tenant(tenant_id))
                 WITH CHECK (tenant_id = public.get_current_tenant_id())';
    END IF;
END $$;

-- 2. إنشاء دالة لتعيين التينانت تلقائياً عند الإدراج
CREATE OR REPLACE FUNCTION public.set_tenant_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tenant_id IS NULL THEN
    NEW.tenant_id := public.get_current_tenant_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- 3. إضافة تريجرز لتعيين التينانت تلقائياً
DROP TRIGGER IF EXISTS set_tenant_id_trigger ON public.platform_users;
CREATE TRIGGER set_tenant_id_trigger
  BEFORE INSERT ON public.platform_users
  FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();

DROP TRIGGER IF EXISTS set_tenant_id_trigger ON public.services;
CREATE TRIGGER set_tenant_id_trigger
  BEFORE INSERT ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();

DROP TRIGGER IF EXISTS set_tenant_id_trigger ON public.invoices;
CREATE TRIGGER set_tenant_id_trigger
  BEFORE INSERT ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();

DROP TRIGGER IF EXISTS set_tenant_id_trigger ON public.payment_transactions;
CREATE TRIGGER set_tenant_id_trigger
  BEFORE INSERT ON public.payment_transactions
  FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();

DROP TRIGGER IF EXISTS set_tenant_id_trigger ON public.quotes;
CREATE TRIGGER set_tenant_id_trigger
  BEFORE INSERT ON public.quotes
  FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();

DROP TRIGGER IF EXISTS set_tenant_id_trigger ON public.support_tickets;
CREATE TRIGGER set_tenant_id_trigger
  BEFORE INSERT ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();

-- 4. إنشاء دالة للتبديل بين التينانتس للأدمن
CREATE OR REPLACE FUNCTION public.switch_tenant(tenant_code TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  tenant_uuid UUID;
BEGIN
  -- التحقق من صلاحيات الأدمن
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Only admins can switch tenants';
  END IF;
  
  -- البحث عن التينانت
  SELECT id INTO tenant_uuid 
  FROM public.tenants 
  WHERE code = tenant_code AND is_active = true;
  
  IF tenant_uuid IS NULL THEN
    RAISE EXCEPTION 'Tenant not found or inactive: %', tenant_code;
  END IF;
  
  -- تعيين التينانت الحالي
  PERFORM set_config('app.current_tenant_id', tenant_uuid::text, true);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';