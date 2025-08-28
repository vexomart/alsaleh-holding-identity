-- إصلاح تحذيرات الأمان بإضافة search_path للدوال
CREATE OR REPLACE FUNCTION public.generate_affiliate_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  code TEXT;
  counter INTEGER := 0;
BEGIN
  LOOP
    -- إنشاء كود من 8 أرقام وحروف
    code := 'AFF' || LPAD((EXTRACT(EPOCH FROM now())::bigint % 100000)::TEXT, 5, '0');
    
    -- التحقق من عدم وجود الكود
    IF NOT EXISTS (SELECT 1 FROM public.affiliate_program WHERE affiliate_code = code) THEN
      RETURN code;
    END IF;
    
    counter := counter + 1;
    IF counter > 10 THEN
      -- إضافة رقم عشوائي إذا فشل إنشاء كود فريد
      code := code || (random() * 999)::integer;
      RETURN code;
    END IF;
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_affiliate_level(user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  total_referrals INTEGER;
  new_level TEXT;
BEGIN
  -- حساب إجمالي الإحالات
  SELECT COUNT(*) INTO total_referrals
  FROM public.affiliate_referrals
  WHERE affiliate_user_id = user_id;
  
  -- تحديد المستوى
  IF total_referrals >= 100 THEN
    new_level := 'ماسي';
  ELSIF total_referrals >= 50 THEN
    new_level := 'ذهبي';
  ELSIF total_referrals >= 20 THEN
    new_level := 'فضي';
  ELSE
    new_level := 'برونزي';
  END IF;
  
  -- تحديث المستوى في قاعدة البيانات
  UPDATE public.affiliate_program
  SET level_name = new_level,
      updated_at = now()
  WHERE affiliate_program.user_id = calculate_affiliate_level.user_id;
  
  RETURN new_level;
END;
$$;