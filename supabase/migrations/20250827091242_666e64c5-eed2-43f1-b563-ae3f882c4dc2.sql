-- إضافة عمود email لجدول profiles إذا لم يكن موجوداً
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'email') THEN
        ALTER TABLE profiles ADD COLUMN email text;
    END IF;
END $$;

-- إضافة فهرس للبحث السريع بالإيميل
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);