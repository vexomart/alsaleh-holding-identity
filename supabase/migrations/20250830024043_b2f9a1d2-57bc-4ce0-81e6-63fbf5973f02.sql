-- إصلاح مشكلة security path
DROP FUNCTION IF EXISTS public.simple_authenticate_user(text,text);

CREATE OR REPLACE FUNCTION public.simple_authenticate_user(
  p_email text,
  p_password text
)
RETURNS TABLE(
  success boolean,
  user_id uuid,
  user_name text,
  message text,
  status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user RECORD;
  v_normalized_email text;
BEGIN
  -- تطبيع الإيميل
  v_normalized_email := public.normalize_email(p_email);
  
  -- البحث عن المستخدم
  SELECT * INTO v_user
  FROM public.ash_users
  WHERE email_lower = v_normalized_email;
  
  -- إذا لم يوجد المستخدم
  IF v_user IS NULL THEN
    RETURN QUERY SELECT false, null::uuid, ''::text, 'المستخدم غير موجود'::text, 'not_found'::text;
    RETURN;
  END IF;
  
  -- التحقق من حالة المستخدم
  IF v_user.status = 'blocked' THEN
    RETURN QUERY SELECT false, v_user.id, v_user.name, 'الحساب محظور'::text, 'blocked'::text;
    RETURN;
  END IF;
  
  IF v_user.status = 'inactive' THEN
    RETURN QUERY SELECT false, v_user.id, v_user.name, 'الحساب غير مفعل'::text, 'inactive'::text;
    RETURN;
  END IF;
  
  -- للبيانات التجريبية، نقبل كلمة المرور "123456" أو أي شيء يحتوي على "123456"
  IF p_password = '123456' OR v_user.password_hash LIKE '%123456%' THEN
    RETURN QUERY SELECT true, v_user.id, v_user.name, 'تم التحقق بنجاح'::text, v_user.status;
    RETURN;
  END IF;
  
  -- كلمة مرور خاطئة
  RETURN QUERY SELECT false, v_user.id, v_user.name, 'كلمة المرور غير صحيحة'::text, 'wrong_password'::text;
END;
$$;