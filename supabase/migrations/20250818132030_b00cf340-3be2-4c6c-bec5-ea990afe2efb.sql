-- إنشاء أول مستخدم أدمين في النظام
-- سيتم إنشاء المستخدم بعد التسجيل وإعطاءه صلاحيات الأدمين تلقائياً

-- إنشاء trigger لإعطاء صلاحيات أدمين للمستخدم الأول
CREATE OR REPLACE FUNCTION public.assign_first_admin()
RETURNS TRIGGER AS $$
DECLARE
  user_count INTEGER;
BEGIN
  -- التحقق من عدد المستخدمين في النظام
  SELECT COUNT(*) INTO user_count FROM public.user_roles;
  
  -- إذا كان هذا أول مستخدم، اجعله أدمين
  IF user_count = 0 THEN
    UPDATE public.user_roles 
    SET role = 'admin'::app_role 
    WHERE user_id = NEW.user_id;
    
    -- تسجيل هذا الحدث في سجل الأمان
    INSERT INTO public.security_audit_logs (
      event_type,
      action,
      user_id,
      risk_level,
      metadata
    ) VALUES (
      'admin_creation',
      'first_admin_assigned',
      NEW.user_id,
      'medium',
      jsonb_build_object(
        'description', 'First user assigned as admin',
        'timestamp', now()
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ربط الـ trigger بجدول user_roles
DROP TRIGGER IF EXISTS assign_first_admin_trigger ON public.user_roles;
CREATE TRIGGER assign_first_admin_trigger
  AFTER INSERT ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_first_admin();

-- إنشاء function لإعطاء صلاحيات أدمين يدوياً (للاستخدام الطارئ)
CREATE OR REPLACE FUNCTION public.make_user_admin(target_email text)
RETURNS boolean AS $$
DECLARE
  target_user_id uuid;
  role_exists boolean;
BEGIN
  -- البحث عن المستخدم باستخدام الإيميل
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = target_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', target_email;
  END IF;
  
  -- التحقق من وجود صف في user_roles
  SELECT EXISTS(
    SELECT 1 FROM public.user_roles 
    WHERE user_id = target_user_id
  ) INTO role_exists;
  
  IF role_exists THEN
    -- تحديث الدور الموجود
    UPDATE public.user_roles 
    SET role = 'admin'::app_role,
        updated_at = now()
    WHERE user_id = target_user_id;
  ELSE
    -- إنشاء دور جديد
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'admin'::app_role);
  END IF;
  
  -- تسجيل الحدث
  INSERT INTO public.security_audit_logs (
    event_type,
    action,
    user_id,
    risk_level,
    metadata
  ) VALUES (
    'admin_creation',
    'manual_admin_assignment',
    target_user_id,
    'high',
    jsonb_build_object(
      'target_email', target_email,
      'assigned_by', auth.uid(),
      'timestamp', now()
    )
  );
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;