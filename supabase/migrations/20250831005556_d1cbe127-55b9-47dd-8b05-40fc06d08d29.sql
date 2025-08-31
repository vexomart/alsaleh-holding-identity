-- Fix create_otp_code function security issue
DROP FUNCTION IF EXISTS create_otp_code(uuid, text, text);

CREATE OR REPLACE FUNCTION create_otp_code(p_user_id uuid, p_email text, p_type text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  otp_code TEXT;
  normalized_email TEXT;
BEGIN
  -- توليد رمز 6 أرقام
  otp_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
  normalized_email := TRIM(LOWER(p_email));
  
  -- حذف الرموز القديمة
  DELETE FROM ash_email_otps 
  WHERE email_lower = normalized_email 
    AND type = p_type 
    AND (consumed = TRUE OR expires_at < NOW());
  
  -- إدراج الرمز الجديد
  INSERT INTO ash_email_otps (
    user_id, 
    email_lower, 
    code, 
    normalized_code,
    type, 
    expires_at
  ) VALUES (
    p_user_id,
    normalized_email,
    otp_code,
    otp_code, -- استخدام نفس الكود كمُطبّع
    p_type,
    NOW() + INTERVAL '10 minutes'
  );
  
  RETURN otp_code;
END;
$$;