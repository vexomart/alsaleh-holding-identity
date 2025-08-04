-- Configure Supabase to use custom email function
-- Update auth configuration to use custom email webhook
UPDATE auth.config 
SET 
  external_email_enabled = true,
  external_url = 'https://ibfcgweykqkzdodrfmci.supabase.co/functions/v1/auth-emails'
WHERE TRUE;

-- Set custom email templates to use webhook
INSERT INTO auth.hooks (hook_table_id, hook_name, created_at, updated_at)
VALUES (1, 'send_email', now(), now())
ON CONFLICT DO NOTHING;