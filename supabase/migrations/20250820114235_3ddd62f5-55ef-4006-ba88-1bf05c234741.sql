-- تحسين أمان جدول payment_transactions
-- حل مشكلة التعرض العام للبيانات المالية الحساسة

-- أولاً: إنشاء functions آمنة للتحقق من الصلاحيات
CREATE OR REPLACE FUNCTION public.owns_payment_transaction(transaction_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT transaction_user_id = auth.uid() AND auth.uid() IS NOT NULL;
$$;

CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
      AND role = 'admin'
      AND auth.uid() IS NOT NULL
  );
$$;

-- ثانياً: حذف السياسات القديمة
DROP POLICY IF EXISTS "Secure: Users can view their own transactions only" ON public.payment_transactions;
DROP POLICY IF EXISTS "Secure: Users can update their own transactions only" ON public.payment_transactions;
DROP POLICY IF EXISTS "Secure: Authenticated users can create their own transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Secure: Only admins can delete payment transactions" ON public.payment_transactions;

-- ثالثاً: إنشاء سياسات أمان محسنة
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

-- رابعاً: إضافة trigger لتسجيل العمليات
CREATE OR REPLACE FUNCTION public.log_payment_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
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
      WHEN TG_OP IN ('INSERT', 'UPDATE') THEN 'high'
      WHEN TG_OP = 'DELETE' THEN 'critical'
      ELSE 'low'
    END,
    jsonb_build_object(
      'table', 'payment_transactions',
      'operation', TG_OP,
      'amount', COALESCE(NEW.amount, OLD.amount)::text,
      'customer_email', COALESCE(NEW.customer_email, OLD.customer_email),
      'timestamp', now()
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- إنشاء trigger
DROP TRIGGER IF EXISTS payment_transactions_access_log ON public.payment_transactions;
CREATE TRIGGER payment_transactions_access_log
  AFTER INSERT OR UPDATE OR DELETE ON public.payment_transactions
  FOR EACH ROW EXECUTE FUNCTION public.log_payment_access();