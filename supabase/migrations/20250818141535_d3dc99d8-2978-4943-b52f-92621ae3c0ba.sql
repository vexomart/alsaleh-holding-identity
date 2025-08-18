-- Check if admin user exists and create if not
DO $$
BEGIN
  -- Delete existing admin user if exists (for clean slate)
  DELETE FROM admin_users WHERE email = 'admin@alialshehriholding.com';
  
  -- Insert the default admin user with simple password
  INSERT INTO admin_users (name, email, password_hash, role, is_active) VALUES
  ('مدير النظام', 'admin@alialshehriholding.com', 'admin123', 'owner', true);
  
END $$;