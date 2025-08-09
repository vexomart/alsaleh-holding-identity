-- إنشاء جدول أدوار المستخدمين
CREATE TYPE public.app_role AS ENUM ('admin', 'client', 'user');

-- جدول أدوار المستخدمين
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'client',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- تمكين RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- سياسات RLS لجدول الأدوار
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- دالة للتحقق من الأدوار
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- جدول ملفات المستخدمين
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT,
    phone TEXT,
    company TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- تمكين RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- سياسات RLS للملفات الشخصية
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- دالة للتعامل مع المستخدمين الجدد
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- إدراج ملف شخصي
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  
  -- تخصيص دور افتراضي للعميل
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'client');
  
  RETURN new;
END;
$$;

-- تشغيل الدالة عند إنشاء مستخدم جديد
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- جدول طلبات الخدمات
CREATE TABLE public.service_requests (
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

-- دالة تحديث الوقت
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- تشغيل دالة التحديث على الجداول
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

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

-- ربط المعاملات بالمستخدمين إذا لم تكن مربوطة
UPDATE public.payment_transactions 
SET user_id = (
  SELECT id FROM auth.users 
  WHERE email = payment_transactions.customer_email
) 
WHERE user_id IS NULL;