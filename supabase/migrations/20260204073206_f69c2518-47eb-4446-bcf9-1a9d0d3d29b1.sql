-- Enable realtime for security tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.trusted_devices;
ALTER PUBLICATION supabase_realtime ADD TABLE public.account_activity_log;