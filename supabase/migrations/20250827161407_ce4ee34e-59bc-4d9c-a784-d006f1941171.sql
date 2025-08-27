-- Enable realtime for payment_transactions table
ALTER TABLE public.payment_transactions REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.payment_transactions;

-- Enable realtime for wallet_transactions table
ALTER TABLE public.wallet_transactions REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.wallet_transactions;