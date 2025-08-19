-- Create admin_role enum first if it doesn't exist
DO $$ BEGIN
    CREATE TYPE admin_role AS ENUM ('owner', 'admin', 'editor');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create secure admin authentication system using Supabase auth
-- This replaces the custom admin_users table with proper Supabase auth integration

-- Create admin_profiles table to store additional admin data
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role admin_role NOT NULL DEFAULT 'editor',
  department TEXT,
  phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on admin_profiles
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin_profiles
CREATE POLICY "Users can view their own admin profile" 
ON public.admin_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own admin profile" 
ON public.admin_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Only super admins can manage admin profiles" 
ON public.admin_profiles 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_profiles ap 
    WHERE ap.user_id = auth.uid() 
    AND ap.role = 'owner' 
    AND ap.is_active = true
  )
);

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE user_id = $1 
    AND is_active = true
  );
$$;

-- Create function to get admin role
CREATE OR REPLACE FUNCTION public.get_admin_role(user_id UUID DEFAULT auth.uid())
RETURNS admin_role
LANGUAGE SQL
STABLE SECURITY DEFINER
AS $$
  SELECT role FROM public.admin_profiles 
  WHERE user_id = $1 
  AND is_active = true
  LIMIT 1;
$$;

-- Create function to handle admin profile creation
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only create admin profile if user has admin metadata
  IF NEW.raw_user_meta_data->>'is_admin' = 'true' THEN
    INSERT INTO public.admin_profiles (
      user_id,
      full_name,
      role,
      department
    ) VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      COALESCE((NEW.raw_user_meta_data->>'role')::admin_role, 'editor'),
      NEW.raw_user_meta_data->>'department'
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for new admin users
DROP TRIGGER IF EXISTS on_auth_user_created_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_admin_user();

-- Create secure session management function
CREATE OR REPLACE FUNCTION public.create_secure_admin_session(
  admin_user_id UUID,
  session_data JSONB DEFAULT '{}'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  session_id TEXT;
  admin_profile RECORD;
  result JSONB;
BEGIN
  -- Verify user is admin
  SELECT * INTO admin_profile 
  FROM public.admin_profiles 
  WHERE user_id = admin_user_id AND is_active = true;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User is not an active admin';
  END IF;
  
  -- Generate session ID
  session_id := encode(gen_random_bytes(32), 'base64');
  
  -- Log successful admin login
  INSERT INTO public.security_audit_logs (
    event_type,
    user_id,
    action,
    risk_level,
    metadata
  ) VALUES (
    'admin_login_success',
    admin_user_id,
    'admin_authentication',
    'medium',
    jsonb_build_object(
      'role', admin_profile.role,
      'session_id', session_id,
      'timestamp', now(),
      'session_data', session_data
    )
  );
  
  -- Update last login
  UPDATE public.admin_profiles 
  SET last_login_at = now()
  WHERE user_id = admin_user_id;
  
  result := jsonb_build_object(
    'success', true,
    'session_id', session_id,
    'user', jsonb_build_object(
      'id', admin_profile.user_id,
      'full_name', admin_profile.full_name,
      'role', admin_profile.role,
      'department', admin_profile.department
    )
  );
  
  RETURN result;
END;
$$;