-- Update handle_new_user trigger to store phone number and preserve full_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name,
    phone,
    preferred_language,
    is_active
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      CASE 
        WHEN NEW.email LIKE 'phone_%@ash.local' THEN 'مستخدم ' || RIGHT(REPLACE(REPLACE(NEW.email, 'phone_', ''), '@ash.local', ''), 4)
        ELSE split_part(NEW.email, '@', 1)
      END
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'phone',
      NEW.phone
    ),
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'ar'),
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    email = COALESCE(EXCLUDED.email, profiles.email),
    updated_at = now();
  
  RETURN NEW;
END;
$$;