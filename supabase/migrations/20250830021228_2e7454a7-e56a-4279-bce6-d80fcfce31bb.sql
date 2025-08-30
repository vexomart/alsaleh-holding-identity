-- إصلاح جميع الدوال لتصبح آمنة
CREATE OR REPLACE FUNCTION public.update_user_last_activity(user_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.user_activity_logs (
    user_id,
    activity_type,
    description,
    created_at
  ) VALUES (
    user_id_param,
    'page_view',
    'نشاط في الصفحة',
    NOW()
  );
END;
$$;

-- إضافة المزيد من البيانات التجريبية للعملاء ليظهروا بأوقات مختلفة
SELECT public.simulate_user_activities();