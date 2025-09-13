-- تحديث معلومات الأدمن لتتماشى مع alishehri
UPDATE public.admin_credentials 
SET 
  email = 'admin@alishehri.com',
  full_name = 'مدير النظام - شركة علي صالح الشهري القابضة',
  updated_at = now()
WHERE email = 'admin@masteredupath.com';