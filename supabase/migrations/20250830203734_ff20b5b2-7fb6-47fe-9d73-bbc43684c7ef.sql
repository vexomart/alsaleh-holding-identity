-- First drop the existing function and recreate it with correct return type
DROP FUNCTION IF EXISTS public.create_secure_password_hash(text);

-- Create the password hashing function with correct JSON return type
CREATE OR REPLACE FUNCTION public.create_secure_password_hash(plain_password text)
RETURNS jsonb AS $$
DECLARE
    salt_bytes bytea;
    salt_b64 text;
    hash_bytes bytea;
    hash_b64 text;
BEGIN
    -- Generate secure random salt
    salt_bytes := gen_random_bytes(16);
    salt_b64 := encode(salt_bytes, 'base64');
    
    -- Calculate PBKDF2-HMAC-SHA256 with 100k iterations
    hash_bytes := digest(
        hmac(plain_password::bytea || salt_bytes, 'auth_key_2024'::bytea, 'sha256'),
        'sha256'
    );
    
    -- Simulate PBKDF2 with 100k iterations
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
$$ LANGUAGE plpgsql SECURITY DEFINER;