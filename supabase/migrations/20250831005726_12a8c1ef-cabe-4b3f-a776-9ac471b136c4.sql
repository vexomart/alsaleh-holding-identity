-- Fix password hash function with simple MD5 approach
DROP FUNCTION IF EXISTS create_secure_password_hash(text);

CREATE OR REPLACE FUNCTION create_secure_password_hash(plain_password text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    salt_text text;
    hash_text text;
BEGIN
    -- Generate a simple salt using random()
    salt_text := md5(random()::text);
    
    -- Create hash using MD5 (simple approach for compatibility)
    hash_text := md5(plain_password || salt_text);
    
    RETURN jsonb_build_object(
        'password_algo', 'md5_v1',
        'password_salt_b64', encode(salt_text::bytea, 'base64'),
        'password_hash_b64', encode(hash_text::bytea, 'base64')
    );
END;
$$;

-- Update authenticate function to work with MD5
DROP FUNCTION IF EXISTS simple_authenticate_user(text, text);

CREATE OR REPLACE FUNCTION simple_authenticate_user(email_lower_param text, plain_password text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    user_record RECORD;
    salt_text text;
    computed_hash text;
BEGIN
    -- البحث عن المستخدم
    SELECT id, email, name, role, status, email_verified_at,
           password_algo, password_salt_b64, password_hash_b64
    INTO user_record
    FROM ash_users
    WHERE email_lower = email_lower_param;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'E_USER_NOT_FOUND',
            'message', 'لا يوجد حساب لهذا البريد'
        );
    END IF;
    
    -- التحقق من حالة المستخدم
    IF user_record.status = 'blocked' THEN
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'E_USER_BLOCKED',
            'message', 'تم حظر حسابك. يرجى التواصل مع الإدارة'
        );
    END IF;
    
    IF user_record.status = 'pending' THEN
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'E_USER_PENDING',
            'message', 'الرجاء تفعيل بريدك قبل تسجيل الدخول'
        );
    END IF;
    
    -- التحقق من كلمة المرور
    IF user_record.password_salt_b64 IS NOT NULL AND user_record.password_hash_b64 IS NOT NULL THEN
        -- فك تشفير salt
        salt_text := convert_from(decode(user_record.password_salt_b64, 'base64'), 'UTF8');
        
        -- حساب الهاش باستخدام MD5
        computed_hash := md5(plain_password || salt_text);
        
        -- مقارنة الهاش المُحَوَّل
        IF encode(computed_hash::bytea, 'base64') = user_record.password_hash_b64 THEN
            RETURN jsonb_build_object(
                'success', true,
                'user_id', user_record.id,
                'user', jsonb_build_object(
                    'id', user_record.id,
                    'email', user_record.email,
                    'name', user_record.name,
                    'role', user_record.role,
                    'status', user_record.status
                )
            );
        END IF;
    END IF;
    
    -- كلمة مرور خاطئة
    RETURN jsonb_build_object(
        'success', false,
        'error_code', 'E_WRONG_PASSWORD',
        'message', 'بيانات تسجيل الدخول غير صحيحة'
    );
END;
$$;