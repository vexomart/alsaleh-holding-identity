-- جدول طلبات الخدمات
CREATE TABLE IF NOT EXISTS public.service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    service_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    estimated_cost NUMERIC,
    actual_cost NUMERIC,
    estimated_delivery_date DATE,
    actual_delivery_date DATE,
    attachments JSONB DEFAULT '[]',
    notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- تمكين RLS
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- سياسات RLS لطلبات الخدمات
CREATE POLICY "Users can view their own service requests"
ON public.service_requests
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own service requests"
ON public.service_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own service requests"
ON public.service_requests
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all service requests"
ON public.service_requests
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- تشغيل دالة التحديث على جدول طلبات الخدمات
CREATE TRIGGER update_service_requests_updated_at
    BEFORE UPDATE ON public.service_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ربط الفواتير بالمستخدمين
ALTER TABLE public.invoices 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- تحديث سياسة RLS للفواتير
DROP POLICY IF EXISTS "Users can view their own invoices" ON public.invoices;
CREATE POLICY "Users can view their own invoices"
ON public.invoices
FOR SELECT
USING (
  (auth.uid() = user_id) OR 
  (customer_email = auth.email()) OR 
  (auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'))
);

-- ربط المعاملات بالمستخدمين
UPDATE public.payment_transactions 
SET user_id = (
  SELECT id FROM auth.users 
  WHERE email = payment_transactions.customer_email
) 
WHERE user_id IS NULL AND customer_email IS NOT NULL;