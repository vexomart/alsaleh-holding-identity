-- Enable Realtime for Wallet Tables (PHASE WALLET-1)
-- This allows real-time updates for wallet balance, transactions, and bank transfers

-- Enable realtime for customer_wallets table
ALTER PUBLICATION supabase_realtime ADD TABLE public.customer_wallets;

-- Enable realtime for financial_transactions table
ALTER PUBLICATION supabase_realtime ADD TABLE public.financial_transactions;

-- Enable realtime for bank_transfer_requests table
ALTER PUBLICATION supabase_realtime ADD TABLE public.bank_transfer_requests;