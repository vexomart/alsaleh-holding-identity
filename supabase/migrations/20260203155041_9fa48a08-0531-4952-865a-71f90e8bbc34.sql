-- Drop trigger first, then function, then recreate both
DROP TRIGGER IF EXISTS trigger_generate_customer_uid ON public.profiles;

DROP FUNCTION IF EXISTS public.generate_customer_uid();

-- Create the fixed function
CREATE FUNCTION public.generate_customer_uid()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
DECLARE
  random_part TEXT;
  new_uid TEXT;
  uid_exists BOOLEAN;
BEGIN
  -- Only generate if customer_uid is null
  IF NEW.customer_uid IS NOT NULL THEN
    RETURN NEW;
  END IF;

  -- Generate unique random UID with format: ASH-CL-XXXXXXXX
  LOOP
    random_part := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));
    new_uid := 'ASH-CL-' || random_part;
    
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE customer_uid = new_uid) INTO uid_exists;
    EXIT WHEN NOT uid_exists;
  END LOOP;
  
  NEW.customer_uid := new_uid;
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER trigger_generate_customer_uid
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_customer_uid();

-- Fix existing duplicate UIDs (ASH-ASH- -> ASH-CL-)
UPDATE public.profiles 
SET customer_uid = REPLACE(customer_uid, 'ASH-ASH-', 'ASH-CL-')
WHERE customer_uid LIKE 'ASH-ASH-%';