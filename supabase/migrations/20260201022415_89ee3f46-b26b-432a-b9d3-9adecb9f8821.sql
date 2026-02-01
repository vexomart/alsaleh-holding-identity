-- Fix function search_path for security
ALTER FUNCTION public.generate_bank_transfer_reference() SET search_path = public;
ALTER FUNCTION public.set_bank_transfer_reference() SET search_path = public;