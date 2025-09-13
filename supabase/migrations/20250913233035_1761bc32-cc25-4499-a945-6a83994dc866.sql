-- تحديث البريد الإلكتروني للأدمن إلى admin@alialshehriholding.com
UPDATE public.admin_credentials 
SET 
  email = 'admin@alialshehriholding.com',
  full_name = 'مدير النظام - شركة علي صالح الشهري القابضة',
  updated_at = now()
WHERE email = 'admin@alishehri.com';