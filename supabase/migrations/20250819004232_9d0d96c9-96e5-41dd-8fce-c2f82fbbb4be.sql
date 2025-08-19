-- إصلاح شامل لحماية بيانات اعتماد المشرفين - الجزء الأول
-- إنشاء دوال التشفير والحماية

-- 1. دالة تشفير متقدمة للبيانات الحساسة
CREATE OR REPLACE FUNCTION encrypt_sensitive_admin_data(data_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  encryption_key TEXT;
  encrypted_data TEXT;
BEGIN
  -- استخدام مفتاح تشفير آمن
  encryption_key := encode(digest('ADMIN_ENCRYPTION_2024', 'sha256'), 'hex');
  
  -- تشفير البيانات باستخدام AES
  encrypted_data := encode(
    encrypt(
      data_text::bytea,
      encryption_key::bytea,
      'aes-cbc/pad:pkcs'
    ),
    'base64'
  );
  
  RETURN encrypted_data;
END;
$$;

-- 2. دالة فك التشفير الآمنة
CREATE OR REPLACE FUNCTION decrypt_sensitive_admin_data(encrypted_data TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  encryption_key TEXT;
  decrypted_data TEXT;
BEGIN
  -- التحقق من وجود البيانات
  IF encrypted_data IS NULL OR encrypted_data = '' THEN
    RETURN NULL;
  END IF;
  
  encryption_key := encode(digest('ADMIN_ENCRYPTION_2024', 'sha256'), 'hex');
  
  -- فك التشفير مع معالجة الأخطاء
  BEGIN
    decrypted_data := convert_from(
      decrypt(
        decode(encrypted_data, 'base64'),
        encryption_key::bytea,
        'aes-cbc/pad:pkcs'
      ),
      'UTF8'
    );
  EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
  END;
  
  RETURN decrypted_data;
END;
$$;

-- 3. دالة آمنة لإنشاء كلمة مرور مشفرة
CREATE OR REPLACE FUNCTION create_secure_admin_password(plain_password TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  salt TEXT;
  hash TEXT;
  encrypted_salt TEXT;
BEGIN
  -- التحقق من قوة كلمة المرور
  IF LENGTH(plain_password) < 12 THEN
    RAISE EXCEPTION 'كلمة المرور يجب أن تكون 12 حرف على الأقل';
  END IF;
  
  -- إنشاء salt عشوائي قوي
  salt := encode(gen_random_bytes(32), 'hex');
  
  -- تشفير كلمة المرور مع salt
  hash := crypt(plain_password || salt, gen_salt('bf', 12));
  
  -- تشفير salt للحماية الإضافية
  encrypted_salt := encrypt_sensitive_admin_data(salt);
  
  RETURN json_build_object(
    'hash', hash,
    'salt', encrypted_salt,
    'created_at', now()
  );
END;
$$;

-- 4. دالة التحقق الآمنة من كلمة المرور
CREATE OR REPLACE FUNCTION verify_secure_admin_password(
  plain_password TEXT, 
  stored_hash TEXT, 
  stored_encrypted_salt TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  decrypted_salt TEXT;
BEGIN
  -- فك تشفير salt
  decrypted_salt := decrypt_sensitive_admin_data(stored_encrypted_salt);
  
  IF decrypted_salt IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- التحقق من كلمة المرور
  RETURN stored_hash = crypt(plain_password || decrypted_salt, stored_hash);
END;
$$;