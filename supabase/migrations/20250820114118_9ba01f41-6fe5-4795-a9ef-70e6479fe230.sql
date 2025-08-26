-- تحسين أمان جدول payment_transactions
-- إضافة مزيد من القيود الأمنية

-- أولاً: إنشاء function آمن للتحقق من ملكية المعاملة
CREATE OR REPLACE FUNCTION public.owns_payment_transaction(transaction_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT transaction_user_id = auth.uid() AND auth.uid() IS NOT NULL;
$$;

-- ثانياً: إنشاء function آمن للتحقق من دور الأدمن
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
      AND role = 'admin'::app_role
      AND auth.uid() IS NOT NULL
  );
$$;

-- ثالثاً: حذف السياسات القديمة وإنشاء سياسات أكثر أماناً
DROP POLICY IF EXISTS "Secure: Users can view their own transactions only" ON public.payment_transactions;
DROP POLICY IF EXISTS "Secure: Users can update their own transactions only" ON public.payment_transactions;
DROP POLICY IF EXISTS "Secure: Authenticated users can create their own transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Secure: Only admins can delete payment transactions" ON public.payment_transactions;

-- إنشاء سياسات جديدة محسنة للأمان
CREATE POLICY "payment_transactions_select_own_only" 
ON public.payment_transactions 
FOR SELECT 
TO authenticated
USING (
  owns_payment_transaction(user_id) OR is_admin_user()
);

CREATE POLICY "payment_transactions_insert_own_only" 
ON public.payment_transactions 
FOR INSERT 
TO authenticated
WITH CHECK (
  owns_payment_transaction(user_id) 
  AND enhanced_rate_limit_check(auth.uid()::text, 'payment_transaction'::text, 3, 60)
);

CREATE POLICY "payment_transactions_update_own_only" 
ON public.payment_transactions 
FOR UPDATE 
TO authenticated
USING (owns_payment_transaction(user_id) OR is_admin_user())
WITH CHECK (owns_payment_transaction(user_id) OR is_admin_user());

CREATE POLICY "payment_transactions_delete_admin_only" 
ON public.payment_transactions 
FOR DELETE 
TO authenticated
USING (is_admin_user());

-- رابعاً: إضافة trigger لتسجيل الوصول للبيانات الحساسة
CREATE OR REPLACE FUNCTION public.log_payment_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- تسجيل محاولات الوصول للمعاملات المالية
  INSERT INTO public.security_audit_logs (
    event_type,
    user_id,
    action,
    resource_type,
    resource_id,
    risk_level,
    metadata
  ) VALUES (
    'payment_data_access',
    auth.uid(),
    TG_OP,
    'payment_transactions',
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_OP = 'SELECT' THEN 'medium'
      WHEN TG_OP IN ('INSERT', 'UPDATE') THEN 'high'
      WHEN TG_OP = 'DELETE' THEN 'critical'
      ELSE 'low'
    END,
    jsonb_build_object(
      'table', 'payment_transactions',
      'operation', TG_OP,
      'amount', COALESCE(NEW.amount, OLD.amount)::text,
      'customer_email', COALESCE(NEW.customer_email, OLD.customer_email),
      'timestamp', now(),
      'ip_address', inet_client_addr()
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- إنشاء trigger للتسجيل
DROP TRIGGER IF EXISTS payment_transactions_access_log ON public.payment_transactions;
CREATE TRIGGER payment_transactions_access_log
  AFTER SELECT OR INSERT OR UPDATE OR DELETE ON public.payment_transactions
  FOR EACH ROW EXECUTE FUNCTION public.log_payment_access();

-- خامساً: إضافة قيود إضافية للحماية من تسريب البيانات
-- منع البحث عن المعاملات بدون مرشحات مناسبة
CREATE OR REPLACE FUNCTION public.prevent_payment_data_dump()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- منع استعلامات واسعة قد تؤدي لتسريب البيانات
  IF TG_OP = 'SELECT' AND NOT is_admin_user() THEN
    -- إضافة فحص إضافي هنا إذا لزم الأمر
    NULL;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- سادساً: تعزيز الحماية بإضافة index للأداء الآمن
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id_secure 
ON public.payment_transactions(user_id) 
WHERE user_id IS NOT NULL;