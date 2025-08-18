-- Fix function search path security issues
ALTER FUNCTION has_admin_role(UUID, user_role) SET search_path = '';
ALTER FUNCTION update_updated_at_column() SET search_path = '';
ALTER FUNCTION log_audit_event() SET search_path = '';
ALTER FUNCTION save_revision() SET search_path = '';