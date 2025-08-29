-- Fix security issues by setting proper search_path for functions
SET search_path TO 'public';

-- Update the function with proper search_path
CREATE OR REPLACE FUNCTION public.handle_auth_user_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile for new user
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), NEW.email)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Create user role (default to viewer)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'viewer'::app_role)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public';