-- إصلاح التحذيرات الأمنية بإضافة search_path للدوال
CREATE OR REPLACE FUNCTION public.normalize_email(email_input TEXT)
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF email_input IS NULL OR email_input = '' THEN
    RETURN NULL;
  END IF;
  
  -- تطبيع البريد: trim + lowercase
  RETURN LOWER(TRIM(email_input));
END;
$$;

CREATE OR REPLACE FUNCTION public.normalize_digits(text_input TEXT)
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  result TEXT := text_input;
BEGIN
  IF result IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- تحويل الأرقام العربية إلى إنجليزية
  result := REPLACE(result, '٠', '0');
  result := REPLACE(result, '١', '1');
  result := REPLACE(result, '٢', '2');
  result := REPLACE(result, '٣', '3');
  result := REPLACE(result, '٤', '4');
  result := REPLACE(result, '٥', '5');
  result := REPLACE(result, '٦', '6');
  result := REPLACE(result, '٧', '7');
  result := REPLACE(result, '٨', '8');
  result := REPLACE(result, '٩', '9');
  
  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_password(password_input TEXT)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  result JSONB;
BEGIN
  result := jsonb_build_object('valid', true, 'message', '');
  
  -- التحقق من الطول
  IF LENGTH(password_input) < 8 THEN
    result := jsonb_build_object(
      'valid', false, 
      'message', 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل'
    );
    RETURN result;
  END IF;
  
  -- التحقق من وجود رقم
  IF password_input !~ '[0-9]' THEN
    result := jsonb_build_object(
      'valid', false, 
      'message', 'يجب أن تحتوي كلمة المرور على رقم واحد على الأقل'
    );
    RETURN result;
  END IF;
  
  -- التحقق من وجود حرف
  IF password_input !~ '[a-zA-Z]' THEN
    result := jsonb_build_object(
      'valid', false, 
      'message', 'يجب أن تحتوي كلمة المرور على حرف واحد على الأقل'
    );
    RETURN result;
  END IF;
  
  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_email(email_input TEXT)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  result JSONB;
  normalized_email TEXT;
BEGIN
  result := jsonb_build_object('valid', true, 'message', '', 'normalized', '');
  
  IF email_input IS NULL OR email_input = '' THEN
    result := jsonb_build_object(
      'valid', false, 
      'message', 'البريد الإلكتروني مطلوب'
    );
    RETURN result;
  END IF;
  
  normalized_email := normalize_email(email_input);
  
  -- التحقق من تنسيق البريد الإلكتروني
  IF normalized_email !~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' THEN
    result := jsonb_build_object(
      'valid', false, 
      'message', 'تنسيق البريد الإلكتروني غير صحيح'
    );
    RETURN result;
  END IF;
  
  result := jsonb_build_object(
    'valid', true, 
    'message', '', 
    'normalized', normalized_email
  );
  
  RETURN result;
END;
$$;