-- إنشاء سياسات RLS للجدول profiles للسماح للمستخدمين بإدارة ملفاتهم الشخصية

-- حذف السياسات الموجودة إن وجدت
DROP POLICY IF EXISTS "Users can view their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

-- السماح للمستخدمين بقراءة ملفاتهم الشخصية
CREATE POLICY "Users can view their own profiles" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid()::text = id::text);

-- السماح للمستخدمين بإنشاء ملفاتهم الشخصية
CREATE POLICY "Users can create their own profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR auth.uid()::text = id::text);

-- السماح للمستخدمين بتحديث ملفاتهم الشخصية
CREATE POLICY "Users can update their own profiles" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id OR auth.uid()::text = id::text)
WITH CHECK (auth.uid() = user_id OR auth.uid()::text = id::text);

-- السماح للأدمن بإدارة جميع الملفات الشخصية (إذا كان لديك دالة has_role)
CREATE POLICY "Admins can manage all profiles" 
ON public.profiles 
FOR ALL 
USING (
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'has_role') 
    THEN has_role(auth.uid(), 'admin'::app_role)
    ELSE false
  END
)
WITH CHECK (
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'has_role') 
    THEN has_role(auth.uid(), 'admin'::app_role)
    ELSE false
  END
);