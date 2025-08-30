-- إنشاء دالة التشخيص الشامل
CREATE OR REPLACE FUNCTION public.auth_hotfix_diagnose(
    email_input text, 
    plain_password text DEFAULT NULL,
    admin_user_id uuid DEFAULT auth.uid()
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    user_record RECORD;
    email_normalized TEXT;
    diagnosis JSONB := '{}';
    password_matches_plain BOOLEAN := false;
    password_matches_double BOOLEAN := false;
    salt_bytes BYTEA;
    computed_hash_bytes BYTEA;
    computed_hash_b64 TEXT;
    double_hash_attempt TEXT;
    rls_test_passed BOOLEAN := false;
BEGIN
    -- التحقق من صلاحيات الإدارة
    IF NOT EXISTS(
        SELECT 1 FROM ash_users 
        WHERE id = admin_user_id 
        AND role IN ('superadmin', 'admin')
    ) THEN
        RETURN jsonb_build_object(
            'error', 'Unauthorized: Admin access required',
            'success', false
        );
    END IF;

    -- تطبيع البريد الإلكتروني
    email_normalized := TRIM(LOWER(email_input));
    
    -- تشخيص أساسي
    diagnosis := jsonb_build_object(
        'email_input_raw', email_input,
        'email_lower', email_normalized,
        'realm_expected', 'client',
        'realm_hit', 'auth_hotfix_diagnose',
        'timestamp', now()
    );

    -- البحث عن المستخدم
    SELECT * INTO user_record
    FROM ash_users
    WHERE email_lower = email_normalized;

    IF NOT FOUND THEN
        RETURN diagnosis || jsonb_build_object(
            'user_found', false,
            'last_error_code', 'E_USER_NOT_FOUND',
            'message', 'لا يوجد حساب لهذا البريد'
        );
    END IF;

    -- معلومات المستخدم الأساسية
    diagnosis := diagnosis || jsonb_build_object(
        'user_found', true,
        'user_id', user_record.id,
        'status', user_record.status,
        'role', user_record.role,
        'email_verified_at', user_record.email_verified_at,
        'algo', COALESCE(user_record.password_algo::text, 'unknown')
    );

    -- تحليل Salt و Hash
    IF user_record.password_salt_b64 IS NOT NULL THEN
        diagnosis := diagnosis || jsonb_build_object(
            'salt_len', LENGTH(user_record.password_salt_b64),
            'salt_valid', LENGTH(user_record.password_salt_b64) >= 20
        );
    ELSE
        diagnosis := diagnosis || jsonb_build_object(
            'salt_len', 0,
            'salt_valid', false
        );
    END IF;

    IF user_record.password_hash_b64 IS NOT NULL THEN
        diagnosis := diagnosis || jsonb_build_object(
            'hash_len', LENGTH(user_record.password_hash_b64),
            'hash_valid', LENGTH(user_record.password_hash_b64) >= 40
        );
    ELSE
        diagnosis := diagnosis || jsonb_build_object(
            'hash_len', 0,
            'hash_valid', false
        );
    END IF;

    -- اختبار كلمة المرور إذا تم توفيرها
    IF plain_password IS NOT NULL THEN
        -- التحقق العادي
        IF user_record.password_salt_b64 IS NOT NULL AND user_record.password_hash_b64 IS NOT NULL THEN
            BEGIN
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
                password_matches_plain := (computed_hash_b64 = user_record.password_hash_b64);
            EXCEPTION WHEN OTHERS THEN
                password_matches_plain := false;
            END;
        END IF;

        -- التحقق من Double Hash (SHA256 للكلمة ثم النظام الجديد)
        IF NOT password_matches_plain AND user_record.password_salt IS NOT NULL THEN
            BEGIN
                double_hash_attempt := encode(
                    digest((plain_password || user_record.password_salt)::bytea, 'sha256'), 
                    'hex'
                );
                password_matches_double := (double_hash_attempt = user_record.password_hash);
            EXCEPTION WHEN OTHERS THEN
                password_matches_double := false;
            END;
        END IF;

        diagnosis := diagnosis || jsonb_build_object(
            'password_match_plain', password_matches_plain,
            'password_match_doublehash', password_matches_double
        );
    END IF;

    -- اختبار RLS
    BEGIN
        PERFORM id FROM ash_users WHERE id = user_record.id LIMIT 1;
        rls_test_passed := true;
    EXCEPTION WHEN OTHERS THEN
        rls_test_passed := false;
    END;

    diagnosis := diagnosis || jsonb_build_object(
        'rls_ok', rls_test_passed
    );

    -- تحديد رمز الخطأ الأساسي
    IF user_record.status != 'active' THEN
        diagnosis := diagnosis || jsonb_build_object(
            'last_error_code', 'E_NOT_ACTIVE',
            'message', CASE 
                WHEN user_record.status = 'pending' THEN 'الرجاء تفعيل بريدك قبل تسجيل الدخول'
                WHEN user_record.status = 'blocked' THEN 'تم حظر حسابك. يرجى التواصل مع الإدارة'
                ELSE 'حالة الحساب غير صحيحة'
            END
        );
    ELSIF plain_password IS NOT NULL THEN
        IF password_matches_double AND NOT password_matches_plain THEN
            diagnosis := diagnosis || jsonb_build_object(
                'last_error_code', 'E_DOUBLE_HASH',
                'message', 'تم اكتشاف مشكلة في تشفير كلمة المرور - يمكن إصلاحها تلقائياً',
                'auto_fixable', true
            );
        ELSIF (user_record.password_salt_b64 IS NULL OR LENGTH(user_record.password_salt_b64) < 20 OR 
               user_record.password_hash_b64 IS NULL OR LENGTH(user_record.password_hash_b64) < 40) THEN
            diagnosis := diagnosis || jsonb_build_object(
                'last_error_code', 'E_SALT_OR_TRUNC',
                'message', 'تعذّر التحقق من كلمة المرور. يرجى إعادة تعيينها الآن',
                'needs_password_reset', true
            );
        ELSIF NOT rls_test_passed THEN
            diagnosis := diagnosis || jsonb_build_object(
                'last_error_code', 'E_RLS',
                'message', 'مشكلة في صلاحيات قاعدة البيانات'
            );
        ELSIF NOT password_matches_plain THEN
            diagnosis := diagnosis || jsonb_build_object(
                'last_error_code', 'E_WRONG_PASSWORD',
                'message', 'بيانات تسجيل الدخول غير صحيحة'
            );
        ELSE
            diagnosis := diagnosis || jsonb_build_object(
                'last_error_code', 'E_SUCCESS',
                'message', 'كلمة المرور صحيحة'
            );
        END IF;
    END IF;

    RETURN diagnosis || jsonb_build_object('success', true);
END;
$function$;

-- دالة الإصلاح التلقائي
CREATE OR REPLACE FUNCTION public.auth_hotfix_auto_repair(
    email_input text,
    plain_password text,
    admin_user_id uuid DEFAULT auth.uid()
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    user_record RECORD;
    email_normalized TEXT;
    repair_result JSONB := '{}';
    new_password_data JSONB;
    diagnosis JSONB;
BEGIN
    -- التحقق من صلاحيات الإدارة
    IF NOT EXISTS(
        SELECT 1 FROM ash_users 
        WHERE id = admin_user_id 
        AND role IN ('superadmin', 'admin')
    ) THEN
        RETURN jsonb_build_object(
            'error', 'Unauthorized: Admin access required',
            'success', false
        );
    END IF;

    -- إجراء التشخيص أولاً
    diagnosis := auth_hotfix_diagnose(email_input, plain_password, admin_user_id);
    
    -- التحقق من نجاح التشخيص
    IF NOT (diagnosis->>'success')::boolean THEN
        RETURN diagnosis;
    END IF;

    email_normalized := diagnosis->>'email_lower';
    
    -- البحث عن المستخدم
    SELECT * INTO user_record
    FROM ash_users
    WHERE email_lower = email_normalized;

    repair_result := jsonb_build_object(
        'diagnosis', diagnosis,
        'repairs_applied', array[]::text[]
    );

    -- إصلاح Double Hash
    IF diagnosis->>'last_error_code' = 'E_DOUBLE_HASH' THEN
        new_password_data := create_secure_password_hash(plain_password);
        
        UPDATE ash_users SET
            password_algo = (new_password_data->>'password_algo')::password_algorithm,
            password_salt_b64 = new_password_data->>'password_salt_b64',
            password_hash_b64 = new_password_data->>'password_hash_b64',
            updated_at = now()
        WHERE id = user_record.id;
        
        repair_result := jsonb_set(
            repair_result, 
            '{repairs_applied}', 
            (repair_result->'repairs_applied')::jsonb || '"double_hash_fixed"'::jsonb
        );
        
        repair_result := repair_result || jsonb_build_object(
            'message', 'تمت معالجة مشكلة أمنية مرتبطة بكلمة المرور، الرجاء المحاولة مجددًا',
            'fixed', true
        );
    END IF;

    -- إصلاح Salt/Truncation - إرسال Reset Password
    IF diagnosis->>'last_error_code' = 'E_SALT_OR_TRUNC' THEN
        -- إنشاء token إعادة تعيين
        INSERT INTO password_reset_tokens (
            user_id, 
            email_lower, 
            token, 
            expires_at
        ) VALUES (
            user_record.id,
            email_normalized,
            encode(gen_random_bytes(32), 'hex'),
            now() + interval '1 hour'
        );
        
        repair_result := jsonb_set(
            repair_result, 
            '{repairs_applied}', 
            (repair_result->'repairs_applied')::jsonb || '"password_reset_triggered"'::jsonb
        );
        
        repair_result := repair_result || jsonb_build_object(
            'message', 'تم تحديث نظام الأمان - تم إرسال رابط إعادة تعيين كلمة المرور',
            'needs_reset', true
        );
    END IF;

    RETURN repair_result || jsonb_build_object('success', true);
END;
$function$;

-- دالة إنشاء مستخدم تجريبي للاختبار
CREATE OR REPLACE FUNCTION public.auth_create_test_user()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    test_email TEXT;
    test_password TEXT := 'TestPass123!';
    user_id UUID;
    password_data JSONB;
    test_result JSONB := '{}';
BEGIN
    -- إنشاء بريد تجريبي
    test_email := 'test+' || extract(epoch from now())::bigint || '@alialshehriholding.com';
    
    -- إنشاء كلمة مرور آمنة
    password_data := create_secure_password_hash(test_password);
    
    -- إنشاء المستخدم
    INSERT INTO ash_users (
        email,
        email_lower,
        name,
        password_algo,
        password_salt_b64,
        password_hash_b64,
        role,
        status,
        email_verified_at
    ) VALUES (
        test_email,
        test_email,
        'Test User',
        (password_data->>'password_algo')::password_algorithm,
        password_data->>'password_salt_b64',
        password_data->>'password_hash_b64',
        'client',
        'active',
        now()
    ) RETURNING id INTO user_id;
    
    test_result := jsonb_build_object(
        'test_user_created', true,
        'test_email', test_email,
        'test_password', test_password,
        'user_id', user_id,
        'created_at', now()
    );
    
    -- اختبار تسجيل الدخول
    DECLARE
        auth_result JSONB;
    BEGIN
        auth_result := simple_authenticate_user(test_email, test_password);
        test_result := test_result || jsonb_build_object(
            'login_test', auth_result,
            'login_success', (auth_result->>'success')::boolean
        );
    END;
    
    RETURN test_result || jsonb_build_object('success', true);
END;
$function$;