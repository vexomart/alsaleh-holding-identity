-- إضافة الإيميل للعميل محمد الشهري
UPDATE profiles 
SET email = 'fekrah4you@gmail.com', 
    updated_at = now()
WHERE full_name = 'محمد الشهري' 
  AND email IS NULL;