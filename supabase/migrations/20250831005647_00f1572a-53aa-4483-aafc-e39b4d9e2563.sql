-- Enable pgcrypto extension and fix password hash function
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Drop and recreate the function with proper extension support
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
    
    -- Create hash using simple SHA256 with pgcrypto
    hash_text := encode(digest((plain_password || salt_text)::bytea, 'sha256'), 'base64');
    
    RETURN jsonb_build_object(
        'password_algo', 'sha256_v1',
        'password_salt_b64', encode(salt_text::bytea, 'base64'),
        'password_hash_b64', hash_text
    );
END;
$$;