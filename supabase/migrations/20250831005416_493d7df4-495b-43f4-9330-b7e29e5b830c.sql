-- Fix create_secure_password_hash function to work without gen_random_bytes
DROP FUNCTION IF EXISTS create_secure_password_hash(text);

CREATE OR REPLACE FUNCTION create_secure_password_hash(plain_password text)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
    salt_bytes bytea;
    hash_bytes bytea;
    result_hash text;
BEGIN
    -- Generate a 16-byte salt using random()
    salt_bytes := decode(md5(random()::text), 'hex');
    
    -- Create hash using HMAC-SHA256 (PostgreSQL's built-in function)
    hash_bytes := hmac(plain_password, salt_bytes, 'sha256');
    
    -- Convert to base64 for storage
    result_hash := encode(hash_bytes, 'base64');
    
    RETURN jsonb_build_object(
        'password_algo', 'sha256_v1',
        'password_salt_b64', encode(salt_bytes, 'base64'),
        'password_hash_b64', result_hash
    );
END;
$$;