-- إضافة حقل رقم الحساب المالي للعملاء في جدول profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS account_number TEXT;

-- إنشاء فهرس فريد لرقم الحساب المالي
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_account_number 
ON public.profiles(account_number) 
WHERE account_number IS NOT NULL;

-- تحديث دالة لتوليد رقم حساب مالي تلقائي
CREATE OR REPLACE FUNCTION generate_account_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
    counter INTEGER;
    account_num TEXT;
BEGIN
    -- الحصول على أكبر رقم حساب والزيادة عليه
    SELECT COALESCE(MAX(CAST(SUBSTRING(account_number FROM 4) AS INTEGER)), 10000) + 1
    INTO counter
    FROM public.profiles
    WHERE account_number IS NOT NULL AND account_number LIKE 'ACC%';
    
    -- تنسيق رقم الحساب كـ ACC + 6 أرقام
    account_num := 'ACC' || LPAD(counter::TEXT, 6, '0');
    
    RETURN account_num;
END;
$$;

-- إضافة trigger لتوليد رقم حساب مالي تلقائياً للعملاء الجدد
CREATE OR REPLACE FUNCTION set_account_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.account_number IS NULL THEN
        NEW.account_number := generate_account_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إضافة trigger
DROP TRIGGER IF EXISTS set_account_number_trigger ON profiles;
CREATE TRIGGER set_account_number_trigger
    BEFORE INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION set_account_number();

-- تحديث الحسابات الموجودة لإضافة أرقام الحسابات
DO $$
DECLARE
    profile_record RECORD;
BEGIN
    FOR profile_record IN 
        SELECT user_id FROM public.profiles WHERE account_number IS NULL
    LOOP
        UPDATE public.profiles 
        SET account_number = generate_account_number()
        WHERE user_id = profile_record.user_id;
    END LOOP;
END $$;