-- إضافة جدول البروفايلات أولاً
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  user_role TEXT DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- تمكين RLS على جدول البروفايلات
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- إضافة عمود user_id لجدول المشاريع إذا لم يكن موجوداً
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- إضافة فهرس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(user_role);

-- دالة للتحقق من دور المستخدم
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID DEFAULT auth.uid())
RETURNS TEXT
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT user_role FROM public.profiles WHERE id = user_id;
$$;

-- دالة للتحقق من صلاحيات الإدارة
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND user_role = 'admin'
  );
$$;