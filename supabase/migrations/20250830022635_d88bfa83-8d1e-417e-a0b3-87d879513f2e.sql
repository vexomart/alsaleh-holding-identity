-- إنشاء دالة verify_otp_code 
CREATE OR REPLACE FUNCTION public.verify_otp_code(
  p_email text,
  p_code text,
  p_type text
)
RETURNS TABLE(
  success boolean,
  message text,
  user_id uuid
)
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
  v_normalized_code := normalize_digits(p_code);
  
  -- البحث عن رمز OTP الصالح
  SELECT * INTO v_otp_record
  FROM ash_email_otps
  WHERE email_lower = v_normalized_email
    AND normalized_code = v_normalized_code
    AND type = p_type
    AND consumed = false
    AND expires_at > NOW();
  
  -- التحقق من وجود الرمز
  IF v_otp_record IS NULL THEN
    RETURN QUERY SELECT false, 'رمز التحقق غير صحيح أو منتهي الصلاحية', null::uuid;
    RETURN;
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
  
  -- إرجاع النجاح
  RETURN QUERY SELECT true, 'تم التحقق بنجاح', v_otp_record.user_id;
END;
$$;

-- تطبيع الأرقام العربية والفارسية إلى إنجليزية
CREATE OR REPLACE FUNCTION public.normalize_digits(text_input text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN REGEXP_REPLACE(
    REGEXP_REPLACE(
      text_input,
      '[٠١٢٣٤٥٦٧٨٩]',
      CASE
        WHEN text_input LIKE '%٠%' THEN '0'
        WHEN text_input LIKE '%١%' THEN '1'
        WHEN text_input LIKE '%٢%' THEN '2'
        WHEN text_input LIKE '%٣%' THEN '3'
        WHEN text_input LIKE '%٤%' THEN '4'
        WHEN text_input LIKE '%٥%' THEN '5'
        WHEN text_input LIKE '%٦%' THEN '6'
        WHEN text_input LIKE '%٧%' THEN '7'
        WHEN text_input LIKE '%٨%' THEN '8'
        WHEN text_input LIKE '%٩%' THEN '9'
        ELSE substring(text_input FROM '[٠١٢٣٤٥٦٧٨٩]')
      END,
      'g'
    ),
    '[۰۱۲۳۴۵۶۷۸۹]',
    CASE
      WHEN text_input LIKE '%۰%' THEN '0'
      WHEN text_input LIKE '%۱%' THEN '1'
      WHEN text_input LIKE '%۲%' THEN '2'
      WHEN text_input LIKE '%۳%' THEN '3'
      WHEN text_input LIKE '%۴%' THEN '4'
      WHEN text_input LIKE '%۵%' THEN '5'
      WHEN text_input LIKE '%۶%' THEN '6'
      WHEN text_input LIKE '%۷%' THEN '7'
      WHEN text_input LIKE '%۸%' THEN '8'
      WHEN text_input LIKE '%۹%' THEN '9'
      ELSE substring(text_input FROM '[۰۱۲۳۴۵۶۷۸۹]')
    END,
    'g'
  );
END;
$$;