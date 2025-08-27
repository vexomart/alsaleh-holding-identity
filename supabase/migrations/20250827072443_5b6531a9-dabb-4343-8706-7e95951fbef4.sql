-- إضافة جدول البروفايلات وربط المشاريع بالمستخدمين
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- تمكين RLS على جدول البروفايلات
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- إضافة عمود user_id لجدول المشاريع إذا لم يكن موجوداً
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- إضافة فهرس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- دالة للتحقق من دور المستخدم
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID DEFAULT auth.uid())
RETURNS TEXT
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- دالة للتحقق من صلاحيات الإدارة
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
$$;

-- سياسة RLS للبروفايلات
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admins can manage all profiles"
ON public.profiles FOR ALL
USING (public.is_admin());

-- تحديث سياسات RLS للمشاريع
DROP POLICY IF EXISTS "الجميع يمكنهم رؤية المشاريع" ON public.projects;
DROP POLICY IF EXISTS "الجميع يمكنهم إدارة المشاريع" ON public.projects;

CREATE POLICY "Users can view their own projects"
ON public.projects FOR SELECT
USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can create their own projects"
ON public.projects FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all projects"
ON public.projects FOR ALL
USING (public.is_admin());

CREATE POLICY "Users can update their own projects"
ON public.projects FOR UPDATE
USING (auth.uid() = user_id OR public.is_admin());

-- تحديث سياسات مراحل المشاريع
DROP POLICY IF EXISTS "الجميع يمكنهم رؤية مراحل المشاريع" ON public.project_phases;

CREATE POLICY "Users can view phases of their projects"
ON public.project_phases FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_phases.project_id 
    AND (projects.user_id = auth.uid() OR public.is_admin())
  )
);

CREATE POLICY "Admins can manage all project phases"
ON public.project_phases FOR ALL
USING (public.is_admin());

-- تحديث سياسات تحديثات المشاريع
DROP POLICY IF EXISTS "الجميع يمكنهم رؤية تحديثات المشاريع" ON public.project_timeline;

CREATE POLICY "Users can view timeline of their projects"
ON public.project_timeline FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_timeline.project_id 
    AND (projects.user_id = auth.uid() OR public.is_admin())
  )
);

CREATE POLICY "Admins can manage all project timeline"
ON public.project_timeline FOR ALL
USING (public.is_admin());

-- تحديث سياسات إشعارات المشاريع
DROP POLICY IF EXISTS "الجميع يمكنهم رؤية إشعارات المشار" ON public.project_notifications;

CREATE POLICY "Users can view notifications of their projects"
ON public.project_notifications FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_notifications.project_id 
    AND (projects.user_id = auth.uid() OR public.is_admin())
  )
);

CREATE POLICY "Admins can manage all project notifications"
ON public.project_notifications FOR ALL
USING (public.is_admin());

-- دالة إنشاء البروفايل تلقائياً عند التسجيل
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    'client'
  );
  RETURN NEW;
END;
$$;

-- تريجر لإنشاء البروفايل تلقائياً
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();