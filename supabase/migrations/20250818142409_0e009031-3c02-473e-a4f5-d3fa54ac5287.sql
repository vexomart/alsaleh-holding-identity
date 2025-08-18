-- Enable pgcrypto extension for proper hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create function to hash passwords properly
CREATE OR REPLACE FUNCTION hash_admin_password(plain_password TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Use pgcrypto's crypt function with salt
  RETURN crypt(plain_password, gen_salt('bf', 8));
END;
$$;

-- Update existing admin user with hashed password  
UPDATE admin_users 
SET password_hash = hash_admin_password('admin123')
WHERE email = 'admin@alialshehriholding.com';

-- Create function to verify admin password
CREATE OR REPLACE FUNCTION verify_admin_password(plain_password TEXT, hashed_password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN hashed_password = crypt(plain_password, hashed_password);
END;
$$;