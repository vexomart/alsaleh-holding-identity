-- إضافة عمود user_role لجدول البروفايلات الموجود
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_role TEXT DEFAULT 'client';

-- إضافة عمود user_id لجدول المشاريع إذا لم يكن موجوداً
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- إضافة فهرس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_role ON public.profiles(user_role);

-- سياسات للمشاريع
DROP POLICY IF EXISTS "الجميع يمكنهم رؤية المشاريع" ON public.projects;
DROP POLICY IF EXISTS "الجميع يمكنهم إدارة المشاريع" ON public.projects;

CREATE POLICY "Users can view their own projects"
ON public.projects FOR SELECT
USING (auth.uid() = user_id OR auth.uid() IN (
  SELECT id FROM public.profiles WHERE user_role = 'admin'
));

CREATE POLICY "Users can create their own projects"
ON public.projects FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects or admins can update all"
ON public.projects FOR UPDATE
USING (auth.uid() = user_id OR auth.uid() IN (
  SELECT id FROM public.profiles WHERE user_role = 'admin'
));

-- تحديث سياسات مراحل المشاريع
DROP POLICY IF EXISTS "الجميع يمكنهم رؤية مراحل المشاريع" ON public.project_phases;

CREATE POLICY "Users can view phases of their projects"
ON public.project_phases FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_phases.project_id 
    AND (projects.user_id = auth.uid() OR auth.uid() IN (
      SELECT id FROM public.profiles WHERE user_role = 'admin'
    ))
  )
);

-- دالة إنشاء البروفايل تلقائياً عند التسجيل
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, user_role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'client'
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- تريجر لإنشاء البروفايل تلقائياً
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();