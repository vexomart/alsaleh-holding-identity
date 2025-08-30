-- إنشاء جدول profiles للمستخدمين
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  account_number TEXT UNIQUE,
  client_id TEXT UNIQUE,
  phone TEXT,
  address TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_user_profile UNIQUE(user_id)
);

-- تمكين RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات الأمان
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- دالة لإنشاء profile تلقائياً عند التسجيل
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    user_id,
    full_name,
    email,
    is_verified
  ) VALUES (
    NEW.id,
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    NEW.email_confirmed_at IS NOT NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger لإنشاء profile تلقائياً
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

-- دالة لتأكيد المستخدم بعد التحقق من الرمز
CREATE OR REPLACE FUNCTION public.confirm_user_after_verification(
  user_email TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- البحث عن المستخدم
  SELECT * INTO user_record 
  FROM auth.users 
  WHERE email = user_email;
  
  IF user_record.id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- تحديث حالة التأكيد في auth.users (يتطلب صلاحيات خاصة)
  -- بدلاً من ذلك، نحديث جدول profiles
  UPDATE public.profiles 
  SET is_verified = TRUE,
      updated_at = NOW()
  WHERE email = user_email;
  
  -- تحديث user_roles إذا لم يكن موجوداً
  INSERT INTO public.user_roles (user_id, role)
  VALUES (user_record.id, 'user'::app_role)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- إضافة trigger لتحديث updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();