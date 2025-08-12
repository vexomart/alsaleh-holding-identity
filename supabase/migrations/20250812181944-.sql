-- Fix auth security settings
-- Update auth.config to set proper OTP expiry and enable leaked password protection
UPDATE auth.config SET 
  -- Set OTP expiry to 5 minutes instead of default 1 hour
  otp_expiry = 300,
  -- Enable leaked password protection
  enable_leaked_password_protection = true
WHERE 
  name IN ('otp_expiry', 'enable_leaked_password_protection');