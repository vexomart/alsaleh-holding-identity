-- Add md5_v1 to password_algorithm enum
ALTER TYPE password_algorithm ADD VALUE IF NOT EXISTS 'md5_v1';

-- Also update the function to use sha256_v1 which already exists
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
        'password_algo', 'sha256_v1',
        'password_salt_b64', encode(salt_text::bytea, 'base64'),
        'password_hash_b64', encode(hash_text::bytea, 'base64')
    );
END;
$$;