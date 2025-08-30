-- 1) توحيد نموذج كلمة المرور (Schema & Columns)
-- تحديث جدول ash_users لإضافة الأعمدة المطلوبة

-- إضافة ENUM للخوارزميات
DO $$ BEGIN
    CREATE TYPE password_algorithm AS ENUM ('sha256_v1', 'bcrypt_v1', 'argon2id_v1');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- إضافة الأعمدة الجديدة
ALTER TABLE public.ash_users 
ADD COLUMN IF NOT EXISTS password_algo password_algorithm DEFAULT 'sha256_v1' NOT NULL,
ADD COLUMN IF NOT EXISTS password_salt_b64 VARCHAR(44),
ADD COLUMN IF NOT EXISTS password_hash_b64 VARCHAR(88);

-- إضافة فهرس فريد على email_lower
CREATE UNIQUE INDEX IF NOT EXISTS idx_ash_users_email_lower 
ON public.ash_users(email_lower);

-- إنشاء جدول لتسجيل محاولات المصادقة
CREATE TABLE IF NOT EXISTS public.auth_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    email_lower TEXT NOT NULL,
    action TEXT NOT NULL, -- login, signup, verify_otp, password_reset
    status TEXT NOT NULL, -- success, failed, error
    error_code TEXT, -- E_WRONG_PASSWORD, E_DOUBLE_HASH, E_SALT_OR_TRUNC, E_WRONG_REALM
    probe_result JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS للوحة auth_logs
ALTER TABLE public.auth_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all auth logs" ON public.auth_logs
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.ash_users 
        WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
);

CREATE POLICY "System can insert auth logs" ON public.auth_logs
FOR INSERT WITH CHECK (true);

-- 2) دوال التشفير والتحقق (PBKDF2-HMAC-SHA256)

-- دالة إنشاء كلمة مرور آمنة
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

-- دالة التحقق من كلمة المرور
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
    double_hash_computed TEXT;
    legacy_hash TEXT;
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
    
    -- 3) التحقق العادي أولاً
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
    
    -- 4) كاشف الأعطال الذكي
    probe_results := jsonb_build_object('probes_run', array[]::text[]);
    
    -- أ) Double-Hash Probe
    IF user_record.password_hash IS NOT NULL AND user_record.password_salt IS NOT NULL THEN
        -- محاولة double-hash: PBKDF2(SHA256(plain))
        salt_bytes := decode(user_record.password_salt_b64, 'base64');
        IF salt_bytes IS NULL AND user_record.password_salt IS NOT NULL THEN
            -- استخدام salt القديم إن وُجد
            salt_bytes := decode(user_record.password_salt, 'hex');
        END IF;
        
        IF salt_bytes IS NOT NULL THEN
            -- حساب SHA256 للـ plain أولاً
            legacy_hash := encode(digest(plain_password::bytea, 'sha256'), 'hex');
            
            -- ثم حساب PBKDF2 على النتيجة
            computed_hash_bytes := digest(
                hmac(legacy_hash::bytea || salt_bytes, 'auth_key_2024'::bytea, 'sha256'),
                'sha256'
            );
            
            FOR i IN 1..99999 LOOP
                computed_hash_bytes := digest(
                    hmac(computed_hash_bytes || salt_bytes, 'auth_key_2024'::bytea, 'sha256'),
                    'sha256'
                );
            END LOOP;
            
            double_hash_computed := encode(computed_hash_bytes, 'hex');
            probe_results := jsonb_set(probe_results, '{probes_run}', 
                (probe_results->'probes_run')::jsonb || '"double_hash"'::jsonb);
            
            IF double_hash_computed = user_record.password_hash THEN
                -- إصلاح تلقائي: تحديث لكلمة المرور الصحيحة
                auth_result := public.create_secure_password_hash(plain_password);
                
                UPDATE public.ash_users SET
                    password_algo = (auth_result->>'password_algo')::password_algorithm,
                    password_salt_b64 = auth_result->>'password_salt_b64',
                    password_hash_b64 = auth_result->>'password_hash_b64'
                WHERE id = user_record.id;
                
                probe_results := jsonb_set(probe_results, '{double_hash_fixed}', 'true'::jsonb);
                
                RETURN jsonb_build_object(
                    'success', true,
                    'user_id', user_record.id,
                    'probe_results', probe_results,
                    'auto_fixed', 'double_hash',
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
    END IF;
    
    -- ب) Salt/Encoding Probe
    IF user_record.password_salt_b64 IS NULL OR length(user_record.password_hash_b64) < 40 THEN
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

-- دالة تسجيل محاولات المصادقة
CREATE OR REPLACE FUNCTION public.log_auth_attempt(
    email_lower_param TEXT,
    action_param TEXT,
    status_param TEXT,
    error_code_param TEXT DEFAULT NULL,
    probe_result_param JSONB DEFAULT '{}',
    user_id_param UUID DEFAULT NULL,
    metadata_param JSONB DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    INSERT INTO public.auth_logs (
        user_id, email_lower, action, status, error_code, probe_result, metadata
    ) VALUES (
        user_id_param, email_lower_param, action_param, status_param, 
        error_code_param, probe_result_param, metadata_param
    );
END;
$$;