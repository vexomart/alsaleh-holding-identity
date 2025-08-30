-- Enable real-time for ash_users table
ALTER TABLE public.ash_users REPLICA IDENTITY FULL;

-- Add table to realtime publication  
ALTER PUBLICATION supabase_realtime ADD TABLE public.ash_users;