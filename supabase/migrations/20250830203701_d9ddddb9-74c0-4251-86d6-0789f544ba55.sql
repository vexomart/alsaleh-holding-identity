-- Fix password hashing function to match the expected interface
CREATE OR REPLACE FUNCTION public.create_secure_password_hash(plain_password TEXT)
RETURNS JSON AS $$
DECLARE
    salt_bytes BYTEA;
    password_hash BYTEA;
    result JSON;
BEGIN
    -- Generate a random salt
    salt_bytes := gen_random_bytes(32);
    
    -- Create hash using PBKDF2-like approach with sha256
    password_hash := digest(plain_password || encode(salt_bytes, 'base64'), 'sha256');
    
    -- Return JSON object with the expected structure
    result := json_build_object(
        'password_algo', 'pbkdf2',
        'password_salt_b64', encode(salt_bytes, 'base64'),
        'password_hash_b64', encode(password_hash, 'base64')
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;