-- إضافة سياسات RLS للبروفايلات والمشاريع
CREATE POLICY IF NOT EXISTS "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

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

-- دالة إنشاء البروفايل تلقائياً عند التسجيل
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, user_role)
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