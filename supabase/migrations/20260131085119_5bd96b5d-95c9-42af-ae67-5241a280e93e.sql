-- Enable realtime for services table (required for useServicesRealtime hook)
ALTER PUBLICATION supabase_realtime ADD TABLE public.services;