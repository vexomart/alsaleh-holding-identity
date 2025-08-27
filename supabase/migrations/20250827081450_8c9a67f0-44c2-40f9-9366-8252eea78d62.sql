-- إضافة دور الإدارة للمستخدم الموجود
INSERT INTO public.user_roles (user_id, role)
SELECT 'a60a2612-4ff4-441c-8dff-4444b29c8802'::uuid, 'admin'::app_role
WHERE NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = 'a60a2612-4ff4-441c-8dff-4444b29c8802'::uuid 
    AND role = 'admin'::app_role
);

-- التأكد من وجود البيانات
SELECT user_id, role, created_at 
FROM public.user_roles 
WHERE user_id = 'a60a2612-4ff4-441c-8dff-4444b29c8802'::uuid;