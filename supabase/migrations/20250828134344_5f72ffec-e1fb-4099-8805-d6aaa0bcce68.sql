-- إنشاء جدول لحفظ طلبات الخدمات
CREATE TABLE public.service_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  request_number TEXT NOT NULL DEFAULT ('REQ-' || TO_CHAR(now(), 'YYYYMMDD') || '-' || LPAD((EXTRACT(EPOCH FROM now())::bigint % 10000)::TEXT, 4, '0')),
  service_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  budget TEXT,
  priority TEXT DEFAULT 'medium',
  deadline DATE,
  additional_services TEXT[],
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'in_progress', 'completed', 'cancelled')),
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  customer_company TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  estimated_cost DECIMAL(10,2),
  estimated_duration_days INTEGER,
  assigned_to UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء فهرس لتحسين الأداء
CREATE INDEX idx_service_requests_user_id ON public.service_requests(user_id);
CREATE INDEX idx_service_requests_status ON public.service_requests(status);
CREATE INDEX idx_service_requests_created_at ON public.service_requests(created_at);

-- تفعيل RLS
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- سياسة للمستخدمين لرؤية طلباتهم فقط
CREATE POLICY "Users can view their own service requests" 
ON public.service_requests 
FOR SELECT 
USING (auth.uid() = user_id);

-- سياسة للمستخدمين لإنشاء طلبات خاصة بهم
CREATE POLICY "Users can create their own service requests" 
ON public.service_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- سياسة للمستخدمين لتحديث طلباتهم (محدودة)
CREATE POLICY "Users can update their own service requests" 
ON public.service_requests 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- سياسة للأدمن لرؤية جميع الطلبات
CREATE POLICY "Admins can view all service requests" 
ON public.service_requests 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- دالة لتحديث updated_at
CREATE TRIGGER update_service_requests_updated_at
BEFORE UPDATE ON public.service_requests
FOR EACH ROW
EXECUTE FUNCTION public._update_updated_at();

-- سجل الأمان
CREATE TRIGGER log_service_requests_access
AFTER INSERT OR UPDATE OR DELETE ON public.service_requests
FOR EACH ROW
EXECUTE FUNCTION public.log_customer_data_access();