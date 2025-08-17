-- FINAL SECURITY FIX - Complete the database setup without conflicts

-- 1. Drop existing trigger to prevent conflicts
DROP TRIGGER IF EXISTS enhanced_payment_security_trigger ON public.payment_transactions;

-- 2. Recreate the enhanced payment security trigger
CREATE TRIGGER enhanced_payment_security_trigger
  BEFORE INSERT OR UPDATE ON public.payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.enhanced_payment_security_trigger();

-- 3. Log the final completion
INSERT INTO public.security_audit_logs (
  event_type,
  user_id,
  action,
  risk_level,
  metadata
) VALUES (
  'admin_action',
  auth.uid(),
  'security_system_fully_operational',
  'low',
  jsonb_build_object(
    'status', 'all_security_fixes_completed',
    'timestamp', now(),
    'components', jsonb_build_array(
      'database_constraints_applied',
      'rls_policies_strengthened',
      'audit_logging_enabled',
      'rate_limiting_active',
      'data_masking_implemented'
    )
  )
);