-- Update customer UID generation to use random alphanumeric
CREATE OR REPLACE FUNCTION public.generate_customer_uid()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  tenant_short TEXT;
  random_part TEXT;
  new_uid TEXT;
  uid_exists BOOLEAN;
BEGIN
  -- Get tenant short code
  SELECT COALESCE(SUBSTRING(t.slug, 1, 3), 'ASH')
  INTO tenant_short
  FROM public.tenants t
  WHERE t.id = NEW.tenant_id;
  
  IF tenant_short IS NULL THEN
    tenant_short := 'ASH';
  END IF;
  
  -- Generate unique random UID
  LOOP
    -- Generate 8-character random alphanumeric
    random_part := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));
    new_uid := 'ASH-' || UPPER(tenant_short) || '-' || random_part;
    
    -- Check if exists
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE customer_uid = new_uid) INTO uid_exists;
    EXIT WHEN NOT uid_exists;
  END LOOP;
  
  NEW.customer_uid := new_uid;
  RETURN NEW;
END;
$function$;

-- Update wallet number generation to use bank-style format
CREATE OR REPLACE FUNCTION public.generate_wallet_number()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  random_digits TEXT;
  new_wallet_number TEXT;
  wallet_exists BOOLEAN;
BEGIN
  -- Generate unique 16-digit wallet number (bank card style)
  LOOP
    -- Generate 16-digit number starting with 4 (Visa-style)
    random_digits := '4' || 
      lpad(floor(random() * 1000)::text, 3, '0') ||
      lpad(floor(random() * 10000)::text, 4, '0') ||
      lpad(floor(random() * 10000)::text, 4, '0') ||
      lpad(floor(random() * 10000)::text, 4, '0');
    
    new_wallet_number := random_digits;
    
    -- Check if exists
    SELECT EXISTS(SELECT 1 FROM public.customer_wallets WHERE wallet_number = new_wallet_number) INTO wallet_exists;
    EXIT WHEN NOT wallet_exists;
  END LOOP;
  
  NEW.wallet_number := new_wallet_number;
  RETURN NEW;
END;
$function$;