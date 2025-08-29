-- إنشاء دالة ensure_user_wallet محسنة
CREATE OR REPLACE FUNCTION public.ensure_user_wallet(p_user_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_wallet_id UUID;
BEGIN
  -- محاولة العثور على المحفظة الموجودة
  SELECT id INTO v_wallet_id
  FROM public.customer_wallets
  WHERE user_id = p_user_id;
  
  -- إذا لم توجد، إنشاء محفظة جديدة
  IF v_wallet_id IS NULL THEN
    INSERT INTO public.customer_wallets (user_id, balance, currency)
    VALUES (p_user_id, 0.00, 'SAR')
    RETURNING id INTO v_wallet_id;
  END IF;
  
  RETURN v_wallet_id;
END;
$function$;