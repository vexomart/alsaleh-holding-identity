-- Insert default user for admin email into auth.users (requires service role)
-- Note: In production, the user should sign up normally
INSERT INTO public.user_roles (user_id, role)
SELECT 
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'::uuid,
  'admin'::app_role
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'::uuid
);