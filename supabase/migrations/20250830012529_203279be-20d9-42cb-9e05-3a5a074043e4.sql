-- إصلاح مشاكل الأمان وإضافة RLS للجدول الجديد
SET search_path = public;

-- تفعيل RLS على جدول ash_email_otps
ALTER TABLE ash_email_otps ENABLE ROW LEVEL SECURITY;

-- سياسات أمان لجدول ash_email_otps
CREATE POLICY "Admin can manage all OTPs" 
ON ash_email_otps 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM ash_users 
    WHERE id = auth.uid() 
    AND role IN ('superadmin', 'admin')
  )
);

CREATE POLICY "Users can view their own OTPs" 
ON ash_email_otps 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "System can create OTPs" 
ON ash_email_otps 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update OTPs" 
ON ash_email_otps 
FOR UPDATE 
USING (true);

-- إصلاح دوال تطبيع البيانات - إضافة search_path
CREATE OR REPLACE FUNCTION public.normalize_email(email_input TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN LOWER(TRIM(email_input));
END;
$$;

CREATE OR REPLACE FUNCTION public.normalize_digits(text_input TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE  
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- تحويل الأرقام العربية والهندية إلى إنجليزية
  RETURN TRANSLATE(text_input, '٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹', '01234567890123456789');
END;
$$;