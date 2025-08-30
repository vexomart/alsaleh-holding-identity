-- إصلاح رجعي للمستخدمين الموجودين
SET search_path = public;

-- تحديث المستخدمين الذين لديهم verification_codes مستخدمة بنجاح
UPDATE ash_users 
SET 
  status = 'active',
  verified_at = COALESCE(verified_at, NOW())
WHERE id IN (
  SELECT DISTINCT u.id 
  FROM ash_users u
  JOIN verification_codes vc ON vc.email = u.email
  WHERE vc.used = true 
    AND u.status = 'pending'
    AND u.verified_at IS NULL
);

-- إنشاء إحصائيات سريعة للتشخيص
CREATE OR REPLACE FUNCTION public.get_quick_auth_stats()
RETURNS TABLE(
  stat_name TEXT,
  stat_value BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    'total_users'::TEXT as stat_name,
    COUNT(*)::BIGINT as stat_value
  FROM ash_users
  
  UNION ALL
  
  SELECT 
    'verified_users'::TEXT as stat_name,
    COUNT(*)::BIGINT as stat_value
  FROM ash_users 
  WHERE status = 'active' AND verified_at IS NOT NULL
  
  UNION ALL
  
  SELECT 
    'pending_users'::TEXT as stat_name,
    COUNT(*)::BIGINT as stat_value
  FROM ash_users 
  WHERE status = 'pending'
  
  UNION ALL
  
  SELECT 
    'users_with_passwords'::TEXT as stat_name,
    COUNT(*)::BIGINT as stat_value
  FROM ash_users 
  WHERE password_hash IS NOT NULL AND password_hash != ''
  
  UNION ALL
  
  SELECT 
    'recent_otps'::TEXT as stat_name,
    COUNT(*)::BIGINT as stat_value
  FROM ash_email_otps 
  WHERE created_at > NOW() - INTERVAL '24 hours';
END;
$$;