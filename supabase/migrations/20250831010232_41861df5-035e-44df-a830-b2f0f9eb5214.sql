-- Fix ash_users RLS policy for insert
DROP POLICY IF EXISTS ash_users_public_insert ON ash_users;

-- Create a proper insert policy that allows public registration
CREATE POLICY ash_users_public_insert_fixed 
ON ash_users 
FOR INSERT 
WITH CHECK (true);

-- Test the create_secure_password_hash function
-- This query will tell us if the function works
DO $$
DECLARE
    test_result JSONB;
BEGIN
    SELECT create_secure_password_hash('test123') INTO test_result;
    RAISE NOTICE 'Password hash test successful: %', test_result;
END $$;