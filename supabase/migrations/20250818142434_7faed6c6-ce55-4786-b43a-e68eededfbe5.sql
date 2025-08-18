-- Simple password verification for now (will improve later)
CREATE OR REPLACE FUNCTION verify_admin_password(plain_password TEXT, stored_password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- For now, simple comparison (will use proper hashing later)
  RETURN plain_password = stored_password;
END;
$$;

-- Reset password to plain text for testing
UPDATE admin_users 
SET password_hash = 'admin123'
WHERE email = 'admin@alialshehriholding.com';