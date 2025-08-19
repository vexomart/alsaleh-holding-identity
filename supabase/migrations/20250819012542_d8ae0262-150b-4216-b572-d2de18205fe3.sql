-- Fix the last remaining security issue with cms_settings table

-- Ensure cms_settings table has proper RLS policies
DROP POLICY IF EXISTS "Admins can manage settings" ON cms_settings;

CREATE POLICY "Secure: Only admins can manage cms settings"
ON cms_settings FOR ALL
USING (has_admin_role(auth.uid(), 'admin'::user_role))
WITH CHECK (has_admin_role(auth.uid(), 'admin'::user_role));

-- Force RLS on cms_settings
ALTER TABLE cms_settings FORCE ROW LEVEL SECURITY;