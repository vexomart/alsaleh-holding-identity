-- حذف الدالة القديمة وإنشاء واحدة جديدة
DROP FUNCTION IF EXISTS public.verify_otp_code(text,text,text);

-- إنشاء دالة verify_otp_code مبسطة
CREATE OR REPLACE FUNCTION public.verify_otp_code(
  p_email text,
  p_code text,
  p_type text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_otp_record RECORD;
  v_normalized_email text;
  v_normalized_code text;
BEGIN
  -- تطبيع البيانات المدخلة
  v_normalized_email := normalize_email(p_email);
  v_normalized_code := p_code; -- استخدام الرمز كما هو مؤقتاً
  
  -- البحث عن رمز OTP الصالح
  SELECT * INTO v_otp_record
  FROM ash_email_otps
  WHERE email_lower = v_normalized_email
    AND (code = p_code OR normalized_code = p_code)
    AND type = p_type
    AND consumed = false
    AND expires_at > NOW();
  
  -- التحقق من وجود الرمز
  IF v_otp_record IS NULL THEN
    RETURN false;
  END IF;
  
  -- تحديث الرمز كمستهلك
  UPDATE ash_email_otps
  SET consumed = true
  WHERE id = v_otp_record.id;
  
  -- تحديث حالة المستخدم إذا كان التسجيل
  IF p_type = 'register' THEN
    UPDATE ash_users
    SET status = 'active', verified_at = NOW()
    WHERE id = v_otp_record.user_id;
  END IF;
  
  RETURN true;
END;
$$;