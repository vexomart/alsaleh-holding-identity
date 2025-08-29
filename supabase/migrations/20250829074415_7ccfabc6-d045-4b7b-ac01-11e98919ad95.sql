-- إنشاء سياسات RLS للجدول profiles للسماح للمستخدمين بإدارة ملفاتهم الشخصية

-- السماح للمستخدمين بقراءة ملفاتهم الشخصية
CREATE POLICY IF NOT EXISTS "Users can view their own profiles" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid()::text = id::text);

-- السماح للمستخدمين بإنشاء ملفاتهم الشخصية
CREATE POLICY IF NOT EXISTS "Users can create their own profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR auth.uid()::text = id::text);

-- السماح للمستخدمين بتحديث ملفاتهم الشخصية
CREATE POLICY IF NOT EXISTS "Users can update their own profiles" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id OR auth.uid()::text = id::text)
WITH CHECK (auth.uid() = user_id OR auth.uid()::text = id::text);

-- السماح للأدمن بإدارة جميع الملفات الشخصية
CREATE POLICY IF NOT EXISTS "Admins can manage all profiles" 
ON public.profiles 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));