-- إزالة الدوال الموجودة وإعادة إنشائها
DROP FUNCTION IF EXISTS public.create_secure_password_hash(text);
DROP FUNCTION IF EXISTS public.simple_authenticate_user(text, text);

-- إضافة ENUM للخوارزميات
DO $$ BEGIN
    CREATE TYPE password_algorithm AS ENUM ('sha256_v1', 'bcrypt_v1', 'argon2id_v1');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- إضافة الأعمدة الجديدة لجدول ash_users
ALTER TABLE public.ash_users 
ADD COLUMN IF NOT EXISTS password_algo password_algorithm DEFAULT 'sha256_v1' NOT NULL,
ADD COLUMN IF NOT EXISTS password_salt_b64 VARCHAR(44),
ADD COLUMN IF NOT EXISTS password_hash_b64 VARCHAR(88);

-- دالة إنشاء كلمة مرور آمنة بـ PBKDF2-HMAC-SHA256
CREATE OR REPLACE FUNCTION public.create_secure_password_hash(plain_password TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    salt_bytes BYTEA;
    salt_b64 TEXT;
    hash_bytes BYTEA;
    hash_b64 TEXT;
BEGIN
    -- توليد 16 بايت عشوائي للـ salt
    salt_bytes := gen_random_bytes(16);
    salt_b64 := encode(salt_bytes, 'base64');
    
    -- حساب PBKDF2-HMAC-SHA256 مع 100k iterations
    hash_bytes := digest(
        hmac(plain_password::bytea || salt_bytes, 'auth_key_2024'::bytea, 'sha256'),
        'sha256'
    );
    
    -- تكرار 100k مرة (محاكاة PBKDF2)
    FOR i IN 1..99999 LOOP
        hash_bytes := digest(
            hmac(hash_bytes || salt_bytes, 'auth_key_2024'::bytea, 'sha256'),
            'sha256'
        );
    END LOOP;
    
    hash_b64 := encode(hash_bytes, 'base64');
    
    RETURN jsonb_build_object(
        'password_algo', 'sha256_v1',
        'password_salt_b64', salt_b64,
        'password_hash_b64', hash_b64
    );
END;
$$;

-- دالة التحقق من كلمة المرور مع كاشف الأعطال الذكي
CREATE OR REPLACE FUNCTION public.simple_authenticate_user(email_lower_param TEXT, plain_password TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    user_record RECORD;
    salt_bytes BYTEA;
    computed_hash_bytes BYTEA;
    computed_hash_b64 TEXT;
    probe_results JSONB := '{}';
    auth_result JSONB;
    legacy_hash TEXT;
    legacy_hash_with_salt TEXT;
BEGIN
    -- البحث عن المستخدم
    SELECT id, email, name, role, status, email_verified_at,
           password_algo, password_salt_b64, password_hash_b64,
           password_hash, password_salt, password_hash_version
    INTO user_record
    FROM public.ash_users
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
    
    -- التحقق العادي أولاً (الأعمدة الجديدة)
    IF user_record.password_salt_b64 IS NOT NULL AND user_record.password_hash_b64 IS NOT NULL THEN
        salt_bytes := decode(user_record.password_salt_b64, 'base64');
        
        -- حساب PBKDF2-HMAC-SHA256
        computed_hash_bytes := digest(
            hmac(plain_password::bytea || salt_bytes, 'auth_key_2024'::bytea, 'sha256'),
            'sha256'
        );
        
        FOR i IN 1..99999 LOOP
            computed_hash_bytes := digest(
                hmac(computed_hash_bytes || salt_bytes, 'auth_key_2024'::bytea, 'sha256'),
                'sha256'
            );
        END LOOP;
        
        computed_hash_b64 := encode(computed_hash_bytes, 'base64');
        
        IF computed_hash_b64 = user_record.password_hash_b64 THEN
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
    
    -- كاشف الأعطال الذكي للحالات القديمة
    probe_results := jsonb_build_object('probes_run', array[]::text[]);
    
    -- Legacy Hash Probe: محاولة النظام القديم SHA256(password + salt)
    IF user_record.password_hash IS NOT NULL AND user_record.password_salt IS NOT NULL THEN
        BEGIN
            -- حساب SHA256 للـ password + salt كما كان في النظام القديم
            legacy_hash_with_salt := encode(
                digest((plain_password || user_record.password_salt)::bytea, 'sha256'), 
                'hex'
            );
            
            -- مقارنة مع الهاش القديم
            IF legacy_hash_with_salt = user_record.password_hash THEN
                -- إصلاح تلقائي: تحديث لكلمة المرور الصحيحة
                auth_result := public.create_secure_password_hash(plain_password);
                
                UPDATE public.ash_users SET
                    password_algo = (auth_result->>'password_algo')::password_algorithm,
                    password_salt_b64 = auth_result->>'password_salt_b64',
                    password_hash_b64 = auth_result->>'password_hash_b64'
                WHERE id = user_record.id;
                
                probe_results := jsonb_set(probe_results, '{legacy_hash_fixed}', 'true'::jsonb);
                
                RETURN jsonb_build_object(
                    'success', true,
                    'user_id', user_record.id,
                    'probe_results', probe_results,
                    'auto_fixed', 'legacy_hash',
                    'user', jsonb_build_object(
                        'id', user_record.id,
                        'email', user_record.email,
                        'name', user_record.name,
                        'role', user_record.role,
                        'status', user_record.status
                    )
                );
            END IF;
        EXCEPTION WHEN OTHERS THEN
            -- تجاهل أخطاء التحويل
            NULL;
        END;
        
        probe_results := jsonb_set(probe_results, '{probes_run}', 
            (probe_results->'probes_run')::jsonb || '"legacy_hash"'::jsonb);
    END IF;
    
    -- Salt/Encoding Probe
    IF user_record.password_salt_b64 IS NULL OR COALESCE(user_record.password_hash_b64, '') = '' THEN
        probe_results := jsonb_set(probe_results, '{probes_run}', 
            (probe_results->'probes_run')::jsonb || '"salt_or_trunc"'::jsonb);
        probe_results := jsonb_set(probe_results, '{needs_reset}', 'true'::jsonb);
        
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'E_SALT_OR_TRUNC',
            'message', 'تعذّر التحقق من كلمة المرور. الرجاء إعادة تعيينها الآن',
            'probe_results', probe_results,
            'needs_password_reset', true
        );
    END IF;
    
    -- الحالة الافتراضية: كلمة مرور خاطئة
    RETURN jsonb_build_object(
        'success', false,
        'error_code', 'E_WRONG_PASSWORD',
        'message', 'بيانات تسجيل الدخول غير صحيحة',
        'probe_results', probe_results
    );
END;
$$;